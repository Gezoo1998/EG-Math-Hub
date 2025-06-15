import { Article } from '../types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Advanced Calculus: Understanding Multivariable Integration',
    summary: 'A comprehensive exploration of multivariable calculus concepts, including double and triple integrals, with practical applications in physics and engineering.',
    content: `
# Advanced Calculus: Understanding Multivariable Integration

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

Multivariable integration provides powerful tools for solving real-world problems involving multiple dimensions and variables.
    `,
    author: 'Dr. Sarah Johnson',
    publishDate: '2024-01-15',
    tags: ['calculus', 'integration', 'multivariable'],
    category: 'Mathematics',
    readTime: 8,
    attachments: [
      {
        id: 'att1',
        name: 'integration_examples.pdf',
        type: 'pdf',
        url: '#',
        size: '2.3 MB'
      },
      {
        id: 'att2',
        name: 'matlab_scripts.zip',
        type: 'zip',
        url: '#',
        size: '856 KB'
      }
    ],
    equations: [
      '\\iint_R f(x,y) \\, dA',
      '\\iiint_E f(x,y,z) \\, dV'
    ]
  },
  {
    id: '2',
    title: 'Quantum Mechanics: Wave Functions and Probability',
    summary: 'An introduction to quantum mechanical wave functions, probability interpretation, and the Schrödinger equation.',
    content: `
# Quantum Mechanics: Wave Functions and Probability

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

Wave functions provide a complete description of quantum systems, allowing us to calculate probabilities and expectation values of physical observables.
    `,
    author: 'Prof. Michael Chen',
    publishDate: '2024-01-10',
    tags: ['quantum mechanics', 'wave functions', 'physics'],
    category: 'Physics',
    readTime: 12,
    attachments: [
      {
        id: 'att3',
        name: 'quantum_simulations.zip',
        type: 'zip',
        url: '#',
        size: '1.2 MB'
      }
    ],
    equations: [
      '|\\psi(x,t)|^2',
      '-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V(x)\\psi = E\\psi'
    ]
  },
  {
    id: '3',
    title: 'Linear Algebra: Eigenvalues and Eigenvectors',
    summary: 'A detailed study of eigenvalues and eigenvectors, their properties, and applications in various fields of science and engineering.',
    content: `
# Linear Algebra: Eigenvalues and Eigenvectors

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

Understanding eigenvalues and eigenvectors is fundamental to many areas of mathematics and its applications.
    `,
    author: 'Dr. Emily Rodriguez',
    publishDate: '2024-01-05',
    tags: ['linear algebra', 'eigenvalues', 'matrix theory'],
    category: 'Mathematics',
    readTime: 10,
    attachments: [
      {
        id: 'att4',
        name: 'linear_algebra_notes.pdf',
        type: 'pdf',
        url: '#',
        size: '3.1 MB'
      },
      {
        id: 'att5',
        name: 'python_examples.zip',
        type: 'zip',
        url: '#',
        size: '645 KB'
      }
    ],
    equations: [
      'Av = \\lambda v',
      '\\det(A - \\lambda I) = 0'
    ]
  }
];

export const categories = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Engineering'];
export const allTags = ['calculus', 'integration', 'multivariable', 'quantum mechanics', 'wave functions', 'physics', 'linear algebra', 'eigenvalues', 'matrix theory'];