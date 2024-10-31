CREATE TABLE items (   id INT AUTO_INCREMENT PRIMARY KEY,   item_name VARCHAR(50) NOT NULL );
CREATE TABLE combinations (   id INT AUTO_INCREMENT PRIMARY KEY,   combination TEXT NOT NULL );
CREATE TABLE responses (     id INT AUTO_INCREMENT PRIMARY KEY,     request_items JSON NOT NULL,     request_length INT NOT NULL,     response_combination INT NOT NULL,     FOREIGN KEY (response_combination) REFERENCES combinations(id) ON DELETE CASCADE );