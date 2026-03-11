const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 4000;

const users = [
  { username: 'admin', password: 'admin12345' }
];

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function isAuthenticated(req, res, next) {
  if (req.cookies && req.cookies.username) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  res.render('home', { username: req.cookies.username || null });
});

app.get('/login', (req, res) => {
  if (req.cookies && req.cookies.username) {
    return res.redirect('/profile');
  }
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.render('login', { error: 'Invalid username or password.' });
  }

  res.cookie('username', username, { httpOnly: true });
  res.redirect('/profile');
});

app.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { username: req.cookies.username });
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
