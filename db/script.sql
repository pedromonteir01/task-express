CREATE DATABASE userstask;

\c userstask;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    birthdate CHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    sign VARCHAR(15) NOT NULL
); 

INSERT INTO users(name, lastname, birthdate, email, age, sign) VALUES ('pedro','monteiro', '2006-11-19', 'pedro@email.com', 17, 'Escorpiao');