**Título:** Avaliação Final - Fundamentos em Nuvem

**Seu Nome Completo:** Caio Eduardo Ferreira Frederico

**Nome do Projeto:** Sistema de Cadastro e Login com Node.js e MySQL

-----

### **Introdução**

Este documento apresenta a implementação de um sistema básico de cadastro e login de usuários, desenvolvido como parte da avaliação final de Fundamentos em Nuvem. O projeto utiliza Node.js para o backend, Express como framework web, MySQL para o banco de dados e interfaces HTML/CSS/JavaScript no frontend. As senhas dos usuários são armazenadas de forma segura utilizando hash com `bcrypt`.

-----

### **Sumário / Índice (Opcional, mas recomendado)**

  * [Introdução](#introdução)
  * [Seção 1: Projeto e Planejamento](#seção-1-projeto-e-planejamento)
      * [Manual do Usuário](#manual-do-usuário)
  * [Seção 2: Implementação do Sistema](#seção-2-implementação-do-sistema)
      * [Código-fonte e Versionamento](#código-fonte-e-versionamento)
  * [Seção 3: Demonstração do Sistema](#seção-3-demonstração-do-sistema)
      * [Capturas de Tela e Explicação do Código](#captura-de-tela-e-explicação-do-código)
          * [1. Tela de Cadastro](#1-tela-de-cadastro)
          * [2. Tela de Login](#2-tela-de-login)
  * [Conclusão](#conclusão)

-----

### **Seção 1: Projeto e Planejamento**

#### **Manual do Usuário**

**Manual do Usuário - Sistema de Cadastro e Login**

Este manual fornece instruções passo a passo para utilizar o sistema de cadastro e login.

**1. Acesso ao Sistema:**

  * **Página de Cadastro:** Abra seu navegador e acesse `http://localhost:3000/register.html`
  * **Página de Login:** Abra seu navegador e acesse `http://localhost:3000/login.html`

**2. Como Cadastrar um Novo Usuário:**

1.  Acesse a página de cadastro (`http://localhost:3000/register.html`).
2.  Preencha o campo "Nome de Usuário" com o nome desejado.
3.  Preencha o campo "Email" com um endereço de e-mail válido e que ainda não esteja cadastrado.
4.  Preencha o campo "Senha" com uma senha segura.
5.  Clique no botão "Cadastrar".
6.  Uma mensagem de sucesso ou erro aparecerá abaixo do formulário. Se o cadastro for bem-sucedido, a mensagem será verde e o formulário será limpo.

**3. Como Fazer Login:**

1.  Acesse a página de login (`http://localhost:3000/login.html`).
2.  Preencha o campo "Email" com o e-mail de um usuário já cadastrado.
3.  Preencha o campo "Senha" com a senha correspondente.
4.  Clique no botão "Entrar".
5.  Uma mensagem de sucesso ou erro aparecerá abaixo do formulário. Se o login for bem-sucedido, a mensagem será verde.

-----

### **Seção 2: Implementação do Sistema**

#### **Código-fonte e Versionamento**

> O código-fonte completo do projeto, incluindo o frontend (HTML, CSS, JavaScript), o backend (Node.js/Express) e as configurações de banco de dados, está versionado no GitHub.
>
> **Link para o Repositório GitHub:** [Sistema Auth](https://github.com/oDevFred/sistema-auth)
>
> **Estrutura do Banco de Dados (Script SQL):**
> As tabelas `users` e `profiles` foram criadas no MySQL com base no seguinte script SQL:
>
> ```sql
> -- Criar o banco de dados (se ainda não existir)
> CREATE DATABASE IF NOT EXISTS nodejs_auth_db;
> ```
>
> \-- Usar o banco de dados recém-criado
> ```sql
>   USE nodejs_auth_db;
>```
>
> \-- Tabela de usuários (users)
> ```sql
>   CREATE TABLE IF NOT EXISTS users (
>       id INT AUTO_INCREMENT PRIMARY KEY,
>       username VARCHAR(255) NOT NULL UNIQUE,
>       password VARCHAR(255) NOT NULL,
>       email VARCHAR(255) NOT NULL UNIQUE,
>       telefone VARCHAR(100),
>       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
>   );
>```
>
> \-- Tabela de perfis (profiles)
> ```sql
>   CREATE TABLE IF NOT EXISTS profiles (
>       user_id INT PRIMARY KEY,
>       data_nascimento DATE,
>       foto_perfil VARCHAR(255),
>       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
>   );
> ```

-----

### **Seção 3: Demonstração do Sistema**

#### **Capturas de Tela e Explicação do Código**

##### **1. Tela de Cadastro**

  ![cadastro](https://media.discordapp.net/attachments/1333279562557161523/1379228043066740926/image.png?ex=683f79b6&is=683e2836&hm=41fa0b6a0dfda9386df03c285ebd9ae9d0f8928892b52f412983258d1bab66e4&=&format=webp&quality=lossless&width=1103&height=544)

**Código Frontend (`public/register.html` - Trecho principal do formulário e script):**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Usuário</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="containier">
        <h2>Cadastro de Usuários</h2>
        <form id="registerForm">
            <div class="input-group">
                <label for="registerUsername">Nome de Usuário:</label>
                <input type="text" id="registerUsername" name="username" required>
            </div>

            <div class="input-group">
                <label for="registerEmail">Email:</label>
                <input type="email" id="registerEmail" name="email" required>
            </div>

            <div class="input-group">
                <label for="registerPassword">Senha:</label>
                <input type="password" id="registerPassword" name="password" required>
            </div>

            <button type="submit">Cadastrar</button>
        </form>

        <p>Já tem uma conta? <a href="login.html">Faça login aqui</a></p>

        <p id="registerMessage" class="message"></p>
    </div>

    <script>
        document.getElementById('registerForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const messageElement = document.getElementById('registerMessage');

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageElement.textContent = data.message;
                    messageElement.style.color = 'green';
                    document.getElementById('registerForm').reset(); // Limpa o formulário
                } else {
                    messageElement.textContent = `Erro: ${data.message}`;
                    messageElement.style.color = 'red';
                }
            } catch (error) {
                console.error('Erro ao enviar requisição de registro:', error);
                messageElement.textContent = 'Erro ao conectar com o servidor.';
                messageElement.style.color = 'red';
            }
        });
    </script>
</body>
</html>
```

**Código Backend (`server.js` - Trecho da rota `/register`):**

```javascript
app.post('/register', async (req, res) => {
    // Extrai username, email e password do corpo da requisição
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
```

**Explicação:** A página `register.html` exibe um formulário para o usuário inserir nome de usuário, e-mail e senha. O JavaScript no frontend captura esses dados e os envia via `fetch` (método POST) para a rota `/register` no backend. No `server.js`, esta rota recebe os dados, valida-os, verifica se o e-mail ou nome de usuário já existem, gera um hash seguro da senha usando `bcrypt` e, finalmente, insere as informações do novo usuário (incluindo o hash da senha) nas tabelas `users` e `profiles` do MySQL.

-----

##### **2. Tela de Login**

  ![cadastro](https://media.discordapp.net/attachments/1333279562557161523/1379228304967471184/image.png?ex=683f79f4&is=683e2874&hm=9440143fdccbc110494f33fd04ccbcf4a2e068871aaca565eed943ccc4b1f405&=&format=webp&quality=lossless&width=1106&height=544)

**Código Frontend (`public/login.html` - Trecho principal do formulário e script):**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login de Usuário</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Login de Usuário</h2>
        <form id="loginForm">
            <div class="input-group">
                <label for="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="email" required>
            </div>

            <div class="input-group">
                <label for="loginPassword">Senha:</label>
                <input type="password" id="loginPassword" name="password" required>
            </div>

            <button type="submit">Entrar</button>
        </form>
        
        <p>Não tem uma conta? <a href="register.html">Cadastre-se aqui</a></p>

        <p id="loginMessage" class="message"></p>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const messageElement = document.getElementById('loginMessage');

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    messageElement.textContent = data.message;
                    messageElement.style.color = 'green';
                } else {
                    messageElement.textContent = `Erro: ${data.message}`;
                    messageElement.style.color = 'red';
                }
            } catch (error) {
                console.error('Error ao enviar requisição de login:', error);
                messageElement.textContent = 'Erro ao conectar com o servidor.';
                messageElement.style.color = 'red';
            }
        });
    </script>
</body>
</html>
```

**Código Backend (`server.js` - Trecho da rota `/login`):**

```javascript
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
```

**Explicação:** A página `login.html` apresenta um formulário para que o usuário insira seu e-mail e senha. O JavaScript captura esses valores e os envia via `fetch` (método POST) para a rota `/login` no backend. No `server.js`, essa rota busca o usuário pelo e-mail no banco de dados e, em seguida, usa `bcrypt.compare` para verificar se a senha fornecida corresponde ao hash armazenado. Se as credenciais estiverem corretas, uma mensagem de sucesso é retornada.

-----

### **Conclusão**

> Este projeto permitiu aplicar conhecimentos em desenvolvimento web full-stack, desde a configuração do ambiente, modelagem de banco de dados, desenvolvimento de APIs REST com Node.js e Express, até a criação de interfaces de usuário com HTML, CSS e JavaScript. A implementação da segurança de senhas com `bcrypt` reforça a importância das boas práticas em desenvolvimento de software.

> Você pode encontrar esse README no formato de PDF [aqui](https://drive.google.com/file/d/1YrJvcaFn1GmD6z2M5CPLrxcPVOZvaGw8/view?usp=sharing).