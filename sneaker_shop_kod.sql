CREATE DATABASE IF NOT EXISTS sneaker_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_hungarian_ci;

USE sneaker_shop;

CREATE TABLE felhasznalok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  jelszo_hash VARCHAR(255) NOT NULL,
  szerepkor VARCHAR(20) DEFAULT 'VASARLO',
  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cipo_modellek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marka VARCHAR(100) NOT NULL,
  modell VARCHAR(150) NOT NULL,
  ar INT NOT NULL,
  leiras TEXT,
  kep_url VARCHAR(255),
  aktiv BOOLEAN DEFAULT TRUE,
  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meretek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meret VARCHAR(10) NOT NULL UNIQUE
);


CREATE TABLE keszlet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cipo_id INT NOT NULL,
  meret_id INT NOT NULL,
  mennyiseg INT NOT NULL DEFAULT 0,

  UNIQUE (cipo_id, meret_id),

  FOREIGN KEY (cipo_id) REFERENCES cipo_modellek(id)
    ON DELETE CASCADE,

  FOREIGN KEY (meret_id) REFERENCES meretek(id)
    ON DELETE CASCADE
);


CREATE TABLE kosarak (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalo_id INT NOT NULL,

  FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id)
    ON DELETE CASCADE
);

CREATE TABLE kosar_tetelek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kosar_id INT NOT NULL,
  cipo_id INT NOT NULL,
  meret_id INT NOT NULL,
  darab INT NOT NULL DEFAULT 1,

  FOREIGN KEY (kosar_id) REFERENCES kosarak(id)
    ON DELETE CASCADE,
  FOREIGN KEY (cipo_id) REFERENCES cipo_modellek(id),
  FOREIGN KEY (meret_id) REFERENCES meretek(id)
);

CREATE TABLE rendelesek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalo_id INT NOT NULL,
  vegosszeg INT NOT NULL,
  allapot VARCHAR(30) DEFAULT 'UJ',
  letrehozva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id)
);


CREATE TABLE rendeles_tetelek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rendeles_id INT NOT NULL,
  cipo_nev VARCHAR(255) NOT NULL,
  meret VARCHAR(10) NOT NULL,
  ar INT NOT NULL,
  darab INT NOT NULL,

  FOREIGN KEY (rendeles_id) REFERENCES rendelesek(id)
    ON DELETE CASCADE
);

INSERT INTO meretek (meret) VALUES
('EU 38'),
('EU 39'),
('EU 40'),
('EU 41'),
('EU 42'),
('EU 43'),
('EU 44'),
('EU 45'),
('EU 46'),
('EU 47');



INSERT INTO cipo_modellek (marka, modell, ar, leiras, kep_url) VALUES
('Nike', 'Air Jordan 1 Retro High OG Chicago', 380, 'Ikonikus Jordan 1', NULL),
('Nike', 'Air Jordan 1 Retro High OG Bred', 360, 'Bred colorway', NULL),
('Nike', 'Air Jordan 4 Retro Military Black', 280, 'Jordan 4 Military Black', NULL),
('Nike', 'Dunk Low Panda', 220, 'Fekete-fehér Dunk', NULL),
('Nike', 'Air Force 1 Triple White', 120, 'Fehér AF1', NULL),
('Adidas', 'Yeezy Boost 350 V2 Zebra', 260, 'Zebra Yeezy', NULL),
('Adidas', 'Yeezy Boost 700 Wave Runner', 290, 'Wave Runner', NULL),
('New Balance', '2002R Protection Pack Phantom', 220, 'Protection Pack', NULL);


INSERT INTO keszlet (cipo_id, meret_id, mennyiseg) VALUES
(1, 5, 3),
(1, 7, 5),

(2, 5, 2),
(2, 7, 4),

(3, 6, 6),
(3, 7, 3),

(4, 5, 10),
(4, 7, 8),

(5, 6, 12),
(5, 7, 15);

