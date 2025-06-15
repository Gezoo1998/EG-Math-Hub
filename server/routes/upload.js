import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { runQuery, getRow } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedTypes = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Upload files for article (admin only)
router.post('/:articleId', [
  authenticateToken,
  requireAdmin,
  upload.array('files', 10) // Max 10 files
], async (req, res) => {
  try {
    const { articleId } = req.params;

    // Verify article exists
    const article = await getRow('SELECT id FROM articles WHERE id = ?', [articleId]);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const attachmentId = uuidv4();
      const fileType = getFileType(file.mimetype);

      // Save file info to database
      await runQuery(`
        INSERT INTO attachments (id, article_id, name, original_name, type, size, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        attachmentId,
        articleId,
        file.filename,
        file.originalname,
        fileType,
        file.size,
        file.path
      ]);

      uploadedFiles.push({
        id: attachmentId,
        name: file.originalname,
        type: fileType,
        size: formatFileSize(file.size)
      });
    }

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Download file (public)
router.get('/download/:attachmentId', async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await getRow(
      'SELECT * FROM attachments WHERE id = ?',
      [attachmentId]
    );

    if (!attachment) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.original_name}"`);
    res.setHeader('Content-Type', getMimeType(attachment.type));

    // Stream the file
    const fileStream = fs.createReadStream(attachment.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete attachment (admin only)
router.delete('/:attachmentId', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const attachment = await getRow(
      'SELECT * FROM attachments WHERE id = ?',
      [attachmentId]
    );

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Delete from database
    await runQuery('DELETE FROM attachments WHERE id = ?', [attachmentId]);

    // Delete file from disk
    if (fs.existsSync(attachment.file_path)) {
      fs.unlinkSync(attachment.file_path);
    }

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

// Get attachments for article (public)
router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;

    const attachments = await getAllRows(
      'SELECT id, name, original_name, type, size FROM attachments WHERE article_id = ?',
      [articleId]
    );

    const formattedAttachments = attachments.map(att => ({
      id: att.id,
      name: att.original_name,
      type: att.type,
      size: formatFileSize(att.size),
      url: `/api/upload/download/${att.id}`
    }));

    res.json(formattedAttachments);
  } catch (error) {
    console.error('Get attachments error:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Helper functions
function getFileType(mimetype) {
  if (mimetype.includes('pdf')) return 'pdf';
  if (mimetype.includes('zip')) return 'zip';
  if (mimetype.includes('image')) return 'image';
  return 'other';
}

function getMimeType(type) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'image': 'image/jpeg',
    'other': 'application/octet-stream'
  };
  return mimeTypes[type] || 'application/octet-stream';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;