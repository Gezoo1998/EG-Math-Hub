import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabase, runQuery, getRow } from '../database/init.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database
    await initializeDatabase();

    // Create admin user if it doesn't exist
    const existingAdmin = await getRow('SELECT id FROM users WHERE username = ?', [process.env.ADMIN_USERNAME]);
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await runQuery(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [process.env.ADMIN_USERNAME, passwordHash, 'admin']
      );
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed categories
    const categories = ['Mathematics', 'Physics', 'Computer Science', 'Engineering'];
    for (const category of categories) {
      await runQuery('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category]);
    }
    console.log('✅ Categories seeded');

    // Seed tags
    const tags = [
      'calculus', 'integration', 'multivariable', 'quantum mechanics', 
      'wave functions', 'physics', 'linear algebra', 'eigenvalues', 
      'matrix theory', 'differential equations', 'topology', 'analysis',
      'algorithms', 'data structures', 'machine learning', 'statistics'
    ];
    for (const tag of tags) {
      await runQuery('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tag]);
    }
    console.log('✅ Tags seeded');

    // Seed sample articles
    const sampleArticles = [
      {
        id: uuidv4(),
        title: 'Advanced Calculus: Understanding Multivariable Integration',
        summary: 'A comprehensive exploration of multivariable calculus concepts, including double and triple integrals, with practical applications in physics and engineering.',
        content: `# Advanced Calculus: Understanding Multivariable Integration

## Introduction

Multivariable calculus extends the concepts of single-variable calculus to functions of multiple variables. This field is essential for understanding many phenomena in physics, engineering, and other scientific disciplines.

## Double Integrals

The double integral of a function f(x,y) over a region R is denoted as:

$$\\iint_R f(x,y) \\, dA$$

This can be computed as an iterated integral:

$$\\int_a^b \\int_{g_1(x)}^{g_2(x)} f(x,y) \\, dy \\, dx$$

### Example: Computing Area

To find the area of a region R, we compute:

$$\\text{Area} = \\iint_R 1 \\, dA$$

## Triple Integrals

For functions of three variables, we use triple integrals:

$$\\iiint_E f(x,y,z) \\, dV$$

### Applications in Physics

Triple integrals are particularly useful for calculating:
- Mass of a solid with variable density
- Center of mass
- Moments of inertia

The mass of a solid E with density function ρ(x,y,z) is:

$$m = \\iiint_E \\rho(x,y,z) \\, dV$$

## Conclusion

Multivariable integration provides powerful tools for solving real-world problems involving multiple dimensions and variables.`,
        author: 'Dr. Sarah Johnson',
        category: 'Mathematics',
        readTime: 8,
        tags: ['calculus', 'integration', 'multivariable']
      },
      {
        id: uuidv4(),
        title: 'Quantum Mechanics: Wave Functions and Probability',
        summary: 'An introduction to quantum mechanical wave functions, probability interpretation, and the Schrödinger equation.',
        content: `# Quantum Mechanics: Wave Functions and Probability

## The Wave Function

In quantum mechanics, the state of a particle is described by a wave function ψ(x,t). The probability of finding the particle between x and x+dx is given by:

$$P(x,t) = |\\psi(x,t)|^2 dx$$

## Time-Independent Schrödinger Equation

For a particle in a potential V(x), the time-independent Schrödinger equation is:

$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V(x)\\psi = E\\psi$$

### Particle in a Box

For a particle confined to a box of length L with infinite potential walls, the solutions are:

$$\\psi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\left(\\frac{n\\pi x}{L}\\right)$$

The corresponding energy levels are:

$$E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$$

## Conclusion

Wave functions provide a complete description of quantum systems, allowing us to calculate probabilities and expectation values of physical observables.`,
        author: 'Prof. Michael Chen',
        category: 'Physics',
        readTime: 12,
        tags: ['quantum mechanics', 'wave functions', 'physics']
      },
      {
        id: uuidv4(),
        title: 'Linear Algebra: Eigenvalues and Eigenvectors',
        summary: 'A detailed study of eigenvalues and eigenvectors, their properties, and applications in various fields of science and engineering.',
        content: `# Linear Algebra: Eigenvalues and Eigenvectors

## Definition

For a square matrix A, a non-zero vector v is an eigenvector with eigenvalue λ if:

$$Av = \\lambda v$$

## Finding Eigenvalues

The eigenvalues are found by solving the characteristic equation:

$$\\det(A - \\lambda I) = 0$$

### Example: 2×2 Matrix

For a 2×2 matrix:

$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$

The characteristic polynomial is:

$$\\lambda^2 - (a+d)\\lambda + (ad-bc) = 0$$

## Diagonalization

A matrix A is diagonalizable if there exists an invertible matrix P such that:

$$P^{-1}AP = D$$

where D is a diagonal matrix containing the eigenvalues.

## Applications

Eigenvalues and eigenvectors are crucial in:
- Principal Component Analysis (PCA)
- Stability analysis of dynamical systems
- Quantum mechanics (energy eigenstates)
- Google's PageRank algorithm

## Conclusion

Understanding eigenvalues and eigenvectors is fundamental to many areas of mathematics and its applications.`,
        author: 'Dr. Emily Rodriguez',
        category: 'Mathematics',
        readTime: 10,
        tags: ['linear algebra', 'eigenvalues', 'matrix theory']
      }
    ];

    for (const article of sampleArticles) {
      // Check if article already exists
      const existing = await getRow('SELECT id FROM articles WHERE title = ?', [article.title]);
      
      if (!existing) {
        // Insert article
        await runQuery(`
          INSERT INTO articles (id, title, summary, content, author, category, read_time, publish_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [article.id, article.title, article.summary, article.content, article.author, article.category, article.readTime]);

        // Link tags
        for (const tagName of article.tags) {
          const tag = await getRow('SELECT id FROM tags WHERE name = ?', [tagName]);
          if (tag) {
            await runQuery(
              'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
              [article.id, tag.id]
            );
          }
        }
      }
    }

    console.log('✅ Sample articles seeded');
    console.log('🎉 Database seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();