const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk serve file statis (html, css, js)
app.use(express.static(__dirname));

// Atur folder tujuan upload
const upload = multer({ dest: 'uploads/' });

// Tampilkan index.html saat buka "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File berhasil diupload!');
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Setup storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send(`File uploaded successfully: <a href="/uploads/${req.file.filename}">${req.file.originalname}</a>`);
  } else {
    res.status(400).send('No file uploaded');
  }
});

// List files
app.get('/files', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) return res.send('Error reading files');
    const links = files.map(f => `<li><a href="/uploads/${f}" download>${f}</a></li>`).join('');
    res.send(`<h2>Available Files</h2><ul>${links}</ul><a href="/">Back</a>`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});