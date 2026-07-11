CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    stock INT NOT NULL,
    weight_kg DOUBLE
);
