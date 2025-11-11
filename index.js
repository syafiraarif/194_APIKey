const express = require('express');
const crypto = require('crypto');
const path = require('path');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// 🔗 KONFIGURASI DATABASE
// ===============================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'apikey',
  port: 3309,
});

// Cek koneksi ke MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi ke MySQL gagal:', err);
  } else {
    console.log('✅ Terkoneksi ke MySQL (apikey)');
  }
});

// ===============================
// 🔑 FUNGSI GENERATE API KEY
// ===============================
function generateApiKey() {
  const randomBytes = crypto.randomBytes(8).toString('hex'); // 16 karakter hex
  return `sk-sm-v1-${randomBytes}`;
}

// ===============================
// 📦 ENDPOINT BUAT API KEY
// ===============================
app.post('/create', (req, res) => {
  const apiKey = generateApiKey();

  const query = 'INSERT INTO apikeyd (apikey) VALUES (?)';
  db.query(query, [apiKey], (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan API key:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Gagal menyimpan API key ke database',
      });
    }

    console.log(`✅ API Key baru disimpan ke DB: ${apiKey}`);
    res.json({ success: true, apiKey });
  });
});

// ===============================
// 🔍 ENDPOINT CEK API KEY
// ===============================
app.post('/cekapi', (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: 'API key tidak boleh kosong!',
    });
  }

  db.query('SELECT * FROM apikeyd WHERE apikey = ?', [apiKey], (err, results) => {
    if (err) {
      console.error('❌ Error saat cek API key:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Kesalahan server saat memeriksa API key',
      });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'API key valid ✅' });
    } else {
      res.status(401).json({ success: false, message: 'API key tidak valid ❌' });
    }
  });
});


// ===============================
// 🚀 JALANKAN SERVER
// ===============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
