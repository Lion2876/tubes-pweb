CREATE DATABASE IF NOT EXISTS infokos_bengkulu;
USE infokos_bengkulu;

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kost
CREATE TABLE kost (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  alamat TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  deskripsi TEXT,
  gambar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fasilitas
CREATE TABLE fasilitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL
);

-- Kost_fasilitas
CREATE TABLE kost_fasilitas (
  kost_id INT,
  fasilitas_id INT,
  PRIMARY KEY(kost_id, fasilitas_id),
  FOREIGN KEY(kost_id) REFERENCES kost(id) ON DELETE CASCADE,
  FOREIGN KEY(fasilitas_id) REFERENCES fasilitas(id) ON DELETE CASCADE
);

-- Review
CREATE TABLE review (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  kost_id INT NOT NULL,
  rating TINYINT CHECK (rating BETWEEN 1 AND 5),
  komentar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(kost_id) REFERENCES kost(id) ON DELETE CASCADE
);

-- Wishlist
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  kost_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(kost_id) REFERENCES kost(id) ON DELETE CASCADE
);

-- Data dummy
-- Password: admin123 (bcrypt hash)
INSERT INTO users (nama, email, password, role) VALUES
('Admin Bengkulu', 'admin@infokos.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFJ1aVz6NNE5YdW3Z4pKp0I4v8Qn2n1y', 'admin'),
('Rudi', 'rudi@mail.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFJ1aVz6NNE5YdW3Z4pKp0I4v8Qn2n1y', 'user');

INSERT INTO fasilitas (nama) VALUES
('WiFi'), ('AC'), ('Kamar Mandi Dalam'), ('Parkir Motor'), ('Parkir Mobil'), ('Dapur'), ('Listrik Token'), ('Akses 24 Jam');

INSERT INTO kost (nama, harga, alamat, latitude, longitude, deskripsi, gambar) VALUES
('Kost Melati', 800000, 'Jl. Melati No.10, Ratu Agung', -3.8025, 102.2580, 'Kost nyaman dekat kampus UNIB', 'default.jpg'),
('Kost Mawar', 1200000, 'Jl. Mawar Indah, Gading Cempaka', -3.7976, 102.2653, 'Lingkungan tenang, fasilitas lengkap', 'default.jpg'),
('Kost Asri', 600000, 'Jl. Padang Jati, Ratu Samban', -3.8072, 102.2745, 'Harga terjangkau, cocok untuk mahasiswa', 'default.jpg'),
('Kost Sejahtera', 1500000, 'Jl. Hibrida, Muara Bangkahulu', -3.7850, 102.2508, 'Eksklusif, dekat mall dan rumah sakit', 'default.jpg');

-- Relasi kost-fasilitas (contoh)
INSERT INTO kost_fasilitas (kost_id, fasilitas_id) VALUES
(1,1),(1,3),(1,4),
(2,1),(2,2),(2,3),(2,5),(2,8),
(3,1),(3,4),
(4,1),(4,2),(4,3),(4,5),(4,6),(4,8);