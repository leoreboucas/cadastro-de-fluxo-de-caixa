const sqlite3 = require('sqlite3').verbose();

// Conecta ao banco de dados
const db = new sqlite3.Database('./assets/registros.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error('Erro ao conectar ao banco:', err.message);
    }
    console.log('Conexão com registros.db estabelecida com sucesso.');
});

// Verifica as tabelas no banco de dados
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('Tabelas no banco:', rows);
});

// Fecha a conexão após testar
db.close((err) => {
    if (err) {
        return console.error('Erro ao fechar o banco:', err.message);
    }
    console.log('Conexão com registros.db encerrada.');
});