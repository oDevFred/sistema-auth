// Carrega as variáveis de ambiente (necessário para DB_NAME etc.)
require('dotenv').config();

// Importa o Epress, o pool de conexões do DB que criamos e a biblioteca bcrypt para hash de senhahs
const express = require('express');
const pool = require('./config/db');
const bcrypt = require('bcrypt');

// Cria uma instância do aplicativo Express
const app = express();

// Define a porta do servidor, usando a variável de ambiente PORT ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Middleware: Permite que o Express lide com dados JSON enviados nas requisições
app.use(express.json());
// Midleware: Serve arquivos estáticos da pasta 'public' (para HTML/CSS)
app.use(express.static('public'));

// =============================================
//          Rotas de autenticação
// =============================================

// Rota de Registro de Usuário
app.post('/register', async (req, res) => {
    // Extraii username, email e password do corpo da requisição
    const { username, email, password } = req.body;

    // Valiidação básiica de entrada
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios (username, email, password) devem ser preenchidos.'});
    }

    let connection;
    try {
        connection = await pool.getConnection(); // Obtém uma conexão do pool

        // 1. Verificar se o usuário ou e-mail já existem
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Nome de usuário ou e-mail já cadastro.'});
        }

        // 2. Gerar hash da senha para segurança
        const saltRounds = 10; // Custo de processamento para o hash (Quanto maios, mais seguro, porém mais lento)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Inserir o novo usuário na tabela 'users'
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // 4. Inserir um registro vazio na tabela 'profiles' para o novo usuário
        // A chave estrangeira user_id será o ID do usuário recém-criado
        await connection.execute(
            'INSERT INTO profiles (user_id) VALUES (?)',
            [result.insertId] // insertId contem o ID do último registro inserido
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.insertId });
    } catch(error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao registrar usuário.'});
    } finally {
        if (connection) connection.release() // Libera a conexão de volta para a pool
    }
});

// Rota de Login de Usuário
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validação básica de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senhha são obrigatórios.'});
    }

    let connection;
    try {
        connection = await pool.getConnection(); // Obtém uma conexão pool

        // 1. Buscar o usuário pelo e-mail
        const [users] = await connection.execute(
            'SELECT id, username, password FROM users WHERE email = ?',
            [email]
        );

        // Se nenhum usuário for encontrado com o e-mail
        if (users.length == 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const user = users[0];

        // 2. Comparar a senha fornecida com o hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Se as credenciais estiverem corretas
        res.status(200).json({ message: 'Login realizado com sucesso!', userId: user.id, username: user.username });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login' });
    } finally {
        if (connection) connection.release(); // Libera a conexão de volta para o pool
    }
});

// =============================================
//          Inicialização do servidor
// =============================================

// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});