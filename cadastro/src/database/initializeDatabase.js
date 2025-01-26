import * as SQLite from 'expo-sqlite';

// Função para abrir o banco de dados de forma assíncrona
export async function openDatabase() {
    try {
        const db = await SQLite.openDatabaseAsync('registros.db');
        return db;
    } catch (error) {
        console.error('Erro ao abrir o banco de dados:', error);
    }
}

export async function initializeDatabase() {
    const db = await openDatabase();

    if (db) {
        try {
            // Criação das tabelas
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cadastros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          caixainicial DECIMAL(6,2),
          caixafinal DECIMAL(6,2),
          despesas DECIMAL(6,2),
          datavendas DATE
        );
      `);

            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto varchar(30),
            precounitario DECIMAL(6,2)
        );
      `);
        } catch (error) {
            console.error('Erro ao inicializar o banco de dados:', error);
        }
    }
}

export async function addCadastro(caixaInicial, caixaFinal, despesas, datavendas) {
    const db = await openDatabase();
    if(db) {
        try {
            db.execAsync(
                `INSERT INTO cadastros (caixainicial, caixafinal, despesas, datavendas) VALUES ('${caixaInicial}', '${caixaFinal}', '${despesas}', '${datavendas}');`)
        } catch (error) {
            throw error
        }
    }
};

export async function addProduct (product, UnitPrice) {
    const db = await openDatabase();
    if (db) {
        try {
            db.execAsync(
                `INSERT INTO produtos (produto, precounitario) VALUES ('${product}', '${UnitPrice}');`)
        } catch (error) {
            throw error
        }
    }
}

export async function editProduct(id, product, unitPrice) {
    const db = await openDatabase();
    if(db) {
        try {
            db.execAsync(
                `UPDATE produtos
                 SET produto='${product}', precounitario='${unitPrice}'
                 WHERE id='${id}'`
            )
        } catch (error) {
            throw error
        }
    }
}

export async function deleteData(id, type) {
    const db = await openDatabase();
    if (db) {
        try {
            db.execAsync(
                `DELETE FROM ${type === 'cadastro' ? 'cadastros':  'produtos'} WHERE id=${id};`)
            const result = await db.getAllAsync("SELECT * FROM cadastros;");
            console.log(result)
        } catch (error) {
            throw error
        }
    }
}

export async function checkProduct(id) {
    const db = await openDatabase();

    if (db) {
        try {
            const result = await db.getAllAsync(`SELECT id, produto, precounitario FROM produtos where id=${id};`);
            return result
        } catch (error) {
            console.error('Erro ao verificar tabelas:', error);
        }
    }
}

export async function calcRendas() {
    const result = await db.getAllAsync(`SELECT * FROM cadastros;`);
    return result
}


// Função para verificar as tabelas no banco de dados
export async function checkTables(type) {
    const db = await openDatabase();

    if (db) {
        try {
            if(type === 'cadastro'){
                const result = await db.getAllAsync("SELECT * FROM cadastros ORDER BY datavendas DESC;");
                return result
            } else {
                const result = await db.getAllAsync("SELECT * FROM produtos;");
                return result
            }
            
        } catch (error) {
            console.error('Erro ao verificar tabelas:', error);
        }
    }
}




// Chama a função para inicializar e verificar o banco
initializeDatabase();
// ApagarEssaBagaca();