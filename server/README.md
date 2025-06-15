# EG Math Hub Backend

A robust Node.js backend API for the EG Math Hub mathematical research platform.

## Features

- **Authentication & Authorization**: JWT-based admin authentication
- **Article Management**: Full CRUD operations for mathematical articles
- **File Upload System**: Support for PDFs, images, and other attachments
- **Search & Filtering**: Advanced search with category and tag filtering
- **Database**: SQLite database with proper relationships
- **Security**: Rate limiting, input validation, and secure file handling
- **LaTeX Support**: Backend ready for mathematical content with LaTeX

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize and seed the database:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (only if no admin exists)
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/change-password` - Change password

### Articles
- `GET /api/articles` - Get all published articles (with pagination and filtering)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create new article (admin only)
- `PUT /api/articles/:id` - Update article (admin only)
- `DELETE /api/articles/:id` - Delete article (admin only)
- `GET /api/articles/meta/categories` - Get all categories
- `GET /api/articles/meta/tags` - Get all tags

### File Upload
- `POST /api/upload/:articleId` - Upload files for article (admin only)
- `GET /api/upload/download/:attachmentId` - Download file
- `DELETE /api/upload/:attachmentId` - Delete attachment (admin only)
- `GET /api/upload/article/:articleId` - Get attachments for article

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Tables
- **users**: Admin user accounts
- **articles**: Mathematical articles with content
- **tags**: Article tags for categorization
- **article_tags**: Many-to-many relationship between articles and tags
- **attachments**: File attachments for articles
- **categories**: Article categories

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_PATH=./database/egmath.db

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Admin Configuration
ADMIN_USERNAME=Gezoo
ADMIN_PASSWORD=Gezoo98

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated and sanitized
- **File Upload Security**: File type validation and size limits
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific frontend origin
- **SQL Injection Prevention**: Parameterized queries

## File Upload Support

Supported file types:
- PDF documents
- ZIP archives
- Images (JPEG, PNG, GIF)
- Text files
- Word documents

Maximum file size: 10MB (configurable)

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Initialize and seed database

### Database Management

The database is automatically created and initialized when the server starts. To reset the database:

1. Delete the database file: `rm database/egmath.db`
2. Run the seed script: `npm run seed`

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up proper file storage (consider cloud storage for production)
5. Use a process manager like PM2
6. Set up proper logging and monitoring

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Gezoo", "password": "Gezoo98"}'
```

### Create Article
```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "New Mathematical Discovery",
    "summary": "An exciting new theorem",
    "content": "# New Discovery\n\nThis is the content...",
    "author": "Dr. Smith",
    "category": "Mathematics",
    "tags": ["theorem", "proof"],
    "readTime": 5
  }'
```

### Get Articles
```bash
curl "http://localhost:3001/api/articles?category=Mathematics&page=1&limit=10"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details