# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js Express application called "lumiron-em" with Supabase authentication integration. The application provides a REST API with user authentication endpoints.

## Dependencies and Stack

**Core Dependencies:**
- `express` (v5.1.0) - Web framework for Node.js
- `@supabase/supabase-js` (v2.57.2) - Supabase JavaScript client
- `cors` (v2.8.5) - Cross-Origin Resource Sharing middleware
- `crypto-js` (v4.2.0) - JavaScript cryptography library
- `uid2` (v1.0.0) - UID generator
- `dotenv` (v17.2.2) - Environment variables loader

**Development Dependencies:**
- `nodemon` (v3.1.10) - Development server with auto-restart

## Development Commands

```bash
node server.js              # Start production server
npx nodemon server.js       # Start development server with auto-restart
npm test                    # Currently returns error - no tests configured yet
```

## Project Structure

```
lumiron-EM/
├── middleware/
│   ├── auth.js              # Supabase authentication middleware
│   └── utils.js             # Crypto utilities (SHA256, salt generation)
├── server.js                # Main Express server (minimal)
├── .env.example             # Environment variables template
├── package.json             # Project configuration and dependencies
└── package-lock.json        # Dependency lock file
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

## API Endpoints

**Authentication:**
- `POST /login` - User login with email/password
- `POST /register` - User registration with email/password
- `POST /logout` - User logout (requires authentication)
- `POST /forget-password` - Send password reset email

**Protected Routes:**
- `GET /profile` - Get user profile (requires authentication)

**Error Handling:**
- `404` - Route not found for undefined endpoints

## Architecture Notes

**Authentication Flow:**
- Uses Supabase for user management and JWT sessions
- Custom crypto utilities for additional password hashing (SHA256 + salt)
- Bearer token authentication via Authorization header
- isAuthenticated middleware protects routes

**Code Organization:**
- Minimal server.js with imported middleware
- Separated concerns: auth middleware, crypto utilities
- Custom crypto functions preserved from original implementation
- Error handling with appropriate HTTP status codes

## Authentication Usage

```javascript
// Login
const response = await fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

// Access protected route
const profile = await fetch('/profile', {
  headers: { 'Authorization': `Bearer ${session.access_token}` }
});
```