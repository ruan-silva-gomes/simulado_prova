-- 1. CRIAÇÃO DO BANCO: Remove se já existir e cria do zero
DROP DATABASE IF EXISTS saep_db;
CREATE DATABASE saep_db;
USE saep_db;

-- 2. TABELA USUÁRIOS: Armazena quem pode acessar o sistema
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(50),
    senha VARCHAR(50)
);

-- 3. TABELA PRODUTOS: Catálogo de itens com estoque mínimo e atual
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    estoque_minimo INT,
    estoque_atual INT,
    especificacoes VARCHAR(255) -- Armazena tensão, RAM, Tela, etc.
);

-- 4. TABELA MOVIMENTAÇÕES: Registro histórico de entradas e saídas
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    usuario_id INT,
    tipo ENUM('entrada', 'saida'),
    quantidade INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Chaves Estrangeiras para garantir a integridade
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 5. DADOS INICIAIS: Popula o banco para testes (Pelo menos 3 registros por tabela)
INSERT INTO usuarios (nome, email, senha) VALUES 
('João Silva', 'joao@teste.com', '123'),
('Maria Oliveira', 'maria@teste.com', '123'),
('Carlos Souza', 'carlos@teste.com', '123');

INSERT INTO produtos (nome, estoque_minimo, estoque_atual, especificacoes) VALUES 
('Smartphone Samsung S23', 5, 12, 'Bivolt, 128GB, 5G'),
('Notebook Dell Vostro', 3, 2, 'Bivolt, 16GB RAM, 512GB SSD'),
('Smart TV LG 55"', 2, 5, '4K UHD, HDR10, Bluetooth');

INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data) VALUES 
(1, 1, 'entrada', 10, '2024-08-10 10:00:00'),
(2, 2, 'entrada', 5, '2024-08-11 14:30:00'),
(3, 3, 'entrada', 5, '2024-08-12 09:15:00');
