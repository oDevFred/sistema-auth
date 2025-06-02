// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o módulo mysql2
const mysql = require('mysql2/promise');

// Configura os parâmetros de conexão usando as variáveis de ambiente
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Se o pool deve esperar por conexxões disponíveis
    connectionLimit: 10, // Limite de conexões no pool
    queueLimit: 0 // Limite de requisições na fila (0 para ilimitado)
});

// Testa a conexão ao iniciar o pool
pool.getConnection()
    .then(connection => {
        console.log('Conectado ao banco de dados MySQL!');
        connection.release(); // Libera a conexão de volta para o pool
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    });

// Exporta o pool de conexões para ser usado em outras partes do aplicativo
module.exports = pool;