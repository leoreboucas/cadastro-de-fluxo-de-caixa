const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Recebendo requisição: ${req.method} ${req.url}`);  // Log de todas as requisições
    next();
});

const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'registros'
});

app.get('/dados', (req, res) => {
    db.query('SELECT * FROM cadastros ORDER BY datavendas DESC', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar dados.');
        } else {
            res.json(results);
        }
    });
});

app.post('/dados', (req, res) => {
    console.log('Corpo da requisição:', req.body);  
    const { caixa, despesas, data } = req.body;

    db.query(
        'INSERT INTO cadastros (caixa, despesas, datavendas) VALUES (?, ?, ?)',
        [caixa, despesas, data],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao inserir dados.');
            } else {
                res.status(200).send('Dados inseridos com sucesso!');
            }
        }
    );
});

app.use((req, res, next) => {
    console.log(`Recebendo requisição: ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});