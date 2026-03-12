import express from 'express';
import session from 'express-session';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('hospital.db');
const JWT_SECRET = 'medistaff-jwt-secret-key-2026';

declare module 'express-session' {
  interface SessionData {
    user: { id: number; username: string };
  }
}

// Initialize Database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      hire_date TEXT NOT NULL,
      phone TEXT,
      status TEXT DEFAULT 'active'
    );
  `);
  console.log('Database tables initialized');
} catch (error) {
  console.error('Database initialization error:', error);
}

// Seed default admin
const NEW_PASSWORD = 'j@123';
const hashedNewPassword = bcrypt.hashSync(NEW_PASSWORD, 10);
const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');

if (!existingAdmin) {
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedNewPassword);
  console.log('Default admin user created with new password');
} else {
  // Update existing admin password to the requested one
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hashedNewPassword, 'admin');
  console.log('Admin password updated to j@123');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1); // trust first proxy
  app.use(express.json());
  app.use(session({
    name: 'medistaff.sid',
    secret: 'hospital-management-secret',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    proxy: true,
    cookie: {
      secure: true,      // Required for SameSite=None
      sameSite: 'none',  // Required for cross-origin iframe
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        return next();
      } catch (err) {
        console.warn('[Auth] Invalid Token');
      }
    }

    // Fallback to session for backward compatibility during transition
    if (req.session.user) {
      req.user = req.session.user;
      return next();
    }

    console.warn(`[Auth] Unauthorized access to ${req.path} | Session: ${req.sessionID}`);
    res.status(401).json({ error: 'Unauthorized' });
  };

  // Auth Routes
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);
    const user: any = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      const userData = { id: user.id, username: user.username };
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
      
      req.session.user = userData;
      req.session.save();

      console.log('Login successful for:', username);
      res.json({ 
        message: 'Logged in successfully', 
        user: userData,
        token 
      });
    } else {
      console.log('Login failed for:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Could not log out' });
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/me', authenticate, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Staff CRUD Routes
  app.get('/api/staff', authenticate, (req, res) => {
    try {
      const staff = db.prepare('SELECT * FROM staff ORDER BY hire_date DESC').all();
      res.json(staff);
    } catch (error: any) {
      console.error('Database error fetching staff:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  });

  app.post('/api/staff', authenticate, (req, res) => {
    const { name, email, role, department, hire_date, phone } = req.body;
    try {
      const result = db.prepare(
        'INSERT INTO staff (name, email, role, department, hire_date, phone) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(name, email, role, department, hire_date, phone);
      res.status(201).json({ id: result.lastInsertRowid, name, email, role, department, hire_date, phone });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/staff/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { name, email, role, department, hire_date, phone } = req.body;
    try {
      db.prepare(
        'UPDATE staff SET name = ?, email = ?, role = ?, department = ?, hire_date = ?, phone = ? WHERE id = ?'
      ).run(name, email, role, department, hire_date, phone, id);
      res.json({ id, name, email, role, department, hire_date, phone });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/staff/:id', authenticate, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM staff WHERE id = ?').run(id);
    res.json({ message: 'Staff member deleted' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
