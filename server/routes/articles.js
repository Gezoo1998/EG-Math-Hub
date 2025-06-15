import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { runQuery, getRow, getAllRows } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all articles (public)
router.get('/', [
  query('category').optional().trim().escape(),
  query('tags').optional(),
  query('search').optional().trim().escape(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, tags, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT DISTINCT a.*, 
             GROUP_CONCAT(t.name) as tags,
             (SELECT COUNT(*) FROM attachments WHERE article_id = a.id) as attachment_count
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE a.published = 1
    `;
    
    const params = [];

    // Add category filter
    if (category && category !== 'All') {
      sql += ' AND a.category = ?';
      params.push(category);
    }

    // Add search filter
    if (search) {
      sql += ' AND (a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ? OR a.author LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add tag filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      const tagPlaceholders = tagArray.map(() => '?').join(',');
      sql += ` AND a.id IN (
        SELECT at.article_id 
        FROM article_tags at 
        JOIN tags t ON at.tag_id = t.id 
        WHERE t.name IN (${tagPlaceholders})
        GROUP BY at.article_id 
        HAVING COUNT(DISTINCT t.name) = ?
      )`;
      params.push(...tagArray, tagArray.length);
    }

    sql += ' GROUP BY a.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const articles = await getAllRows(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(DISTINCT a.id) as total FROM articles a';
    let countParams = [];

    if (category && category !== 'All') {
      countSql += ' WHERE a.category = ? AND a.published = 1';
      countParams.push(category);
    } else {
      countSql += ' WHERE a.published = 1';
    }

    const totalResult = await getRow(countSql, countParams);
    const total = totalResult.total;

    // Format articles
    const formattedArticles = articles.map(article => ({
      ...article,
      tags: article.tags ? article.tags.split(',') : [],
      publishDate: article.publish_date,
      readTime: article.read_time,
      hasAttachments: article.attachment_count > 0
    }));

    res.json({
      articles: formattedArticles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get article
    const article = await getRow(
      'SELECT * FROM articles WHERE id = ? AND published = 1',
      [id]
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Get tags
    const tags = await getAllRows(`
      SELECT t.name 
      FROM tags t 
      JOIN article_tags at ON t.id = at.tag_id 
      WHERE at.article_id = ?
    `, [id]);

    // Get attachments
    const attachments = await getAllRows(
      'SELECT id, name, original_name, type, size FROM attachments WHERE article_id = ?',
      [id]
    );

    const formattedArticle = {
      ...article,
      tags: tags.map(t => t.name),
      attachments: attachments.map(att => ({
        id: att.id,
        name: att.original_name,
        type: att.type,
        size: formatFileSize(att.size),
        url: `/api/upload/download/${att.id}`
      })),
      publishDate: article.publish_date,
      readTime: article.read_time
    };

    res.json(formattedArticle);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create article (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').isLength({ min: 1 }).trim(),
  body('summary').isLength({ min: 1 }).trim(),
  body('content').isLength({ min: 1 }),
  body('author').isLength({ min: 1 }).trim(),
  body('category').isLength({ min: 1 }).trim(),
  body('tags').optional().isArray(),
  body('readTime').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, summary, content, author, category, tags = [], readTime = 5 } = req.body;
    const articleId = uuidv4();

    // Insert article
    await runQuery(`
      INSERT INTO articles (id, title, summary, content, author, category, read_time, publish_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [articleId, title, summary, content, author, category, readTime]);

    // Insert category if it doesn't exist
    await runQuery(
      'INSERT OR IGNORE INTO categories (name) VALUES (?)',
      [category]
    );

    // Handle tags
    for (const tagName of tags) {
      // Insert tag if it doesn't exist
      await runQuery('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
      
      // Get tag ID
      const tag = await getRow('SELECT id FROM tags WHERE name = ?', [tagName]);
      
      // Link article to tag
      await runQuery(
        'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
        [articleId, tag.id]
      );
    }

    res.status(201).json({
      message: 'Article created successfully',
      articleId
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().isLength({ min: 1 }).trim(),
  body('summary').optional().isLength({ min: 1 }).trim(),
  body('content').optional().isLength({ min: 1 }),
  body('author').optional().isLength({ min: 1 }).trim(),
  body('category').optional().isLength({ min: 1 }).trim(),
  body('tags').optional().isArray(),
  body('readTime').optional().isInt({ min: 1 }),
  body('published').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if article exists
    const existingArticle = await getRow('SELECT id FROM articles WHERE id = ?', [id]);
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (key !== 'tags' && updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await runQuery(
        `UPDATE articles SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Handle tags update
    if (updates.tags) {
      // Remove existing tags
      await runQuery('DELETE FROM article_tags WHERE article_id = ?', [id]);

      // Add new tags
      for (const tagName of updates.tags) {
        await runQuery('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
        const tag = await getRow('SELECT id FROM tags WHERE name = ?', [tagName]);
        await runQuery(
          'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
          [id, tag.id]
        );
      }
    }

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article (admin only)
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const result = await runQuery('DELETE FROM articles WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Get all categories (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await getAllRows('SELECT name FROM categories ORDER BY name');
    const categoryNames = ['All', ...categories.map(c => c.name)];
    res.json(categoryNames);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all tags (public)
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await getAllRows('SELECT name FROM tags ORDER BY name');
    res.json(tags.map(t => t.name));
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;