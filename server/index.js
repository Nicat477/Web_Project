const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const UserModel = require('./models/Users');
const EmployeeModel = require('./models/Employee');
const cookieParser = require('cookie-parser'); // Import cookie-parser
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/web')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Event Listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// ================== BOOK ROUTES ==================
app.get('/', (req, res) => {
  UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

app.get('/getUser/:id', (req, res) => {
  UserModel.findById(req.params.id)
    .then(user => user ? res.json(user) : res.status(404).json({ error: 'Book not found' }))
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

app.put('/updateUser/:id', [
  body('publisher').trim().notEmpty().escape(),
  body('book').trim().notEmpty().escape(),
  body('date').isISO8601()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

app.delete('/deleteUser/:id', (req, res) => {
  UserModel.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Book deleted' }))
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

app.post('/createUser', [
  body('publisher').trim().notEmpty().escape(),
  body('book').trim().notEmpty().escape(),
  body('date').isISO8601()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  UserModel.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json({ error: 'Server error' }));
});

// ================== AUTH ROUTES ==================
app.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await EmployeeModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid password' });

    // Create a simple token (in a real app, use JWT)
    const token = process.env.JWT_SECRET; // Replace with a real secret;
    // Set the cookie
    res.cookie('token', token, {
      httpOnly: true, // Important for security
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict' // Help prevent CSRF attacks
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/register', [
  body('name').trim().notEmpty().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await EmployeeModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Add this route to your server
app.get('/check-auth', (req, res) => {
  // Access the token from the cookie
  const token = req.cookies.token;

  if (token === process.env.JWT_SECRET) { // Replace with your actual token verification logic
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));