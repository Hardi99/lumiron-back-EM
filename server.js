const express = require("express");
const cors = require("cors");
const { isAuthenticated, supabase } = require("./middleware/auth");
const { hashPassword, verifyPassword, generateToken } = require("./middleware/utils");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  
  const token = generateToken();
  res.status(200).json({ message: 'Login successful', token, session: data.session });
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const { hash, salt } = hashPassword(password);
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: { data: { hash, salt } }
  });
  if (error) return res.status(400).json({ error: error.message });
  
  res.status(201).json({ message: 'User registered successfully', user: data.user });
});

app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.post('/logout', isAuthenticated, async (req, res) => {
  await supabase.auth.signOut();
  res.json({ message: 'Logged out successfully' });
});

app.post('/forget-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return res.status(400).json({ error: error.message });
  
  res.json({ message: 'Password reset email sent successfully' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));