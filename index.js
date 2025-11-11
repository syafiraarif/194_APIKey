const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔗 Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'apiuser',
  password: 'Oranggabut712!',
  database: 'apikeydb'
});

// ✅ Cek koneksi database
db.connect(err => {
  if (err) {
    console.error('❌ Gagal terhubung ke database MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Terhubung ke database MySQL');
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
