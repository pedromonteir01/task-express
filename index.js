const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'userstask',
    password: 'ds564',
    port: 7007
});


const ageUser = (birthdate) => {
    const birthday = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();

    if(today.getMonth() < birthday.getMonth() || today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()) {
        age--;
    }

    return age < 0 ? 0 : age;
}

const getSign = (birthdate) => {
    const birthday = new Date(birthdate);
    const month = birthday.getMonth();
    const day = birthday.getDate();

    if(month == 11 && day >= 22 || month == 0 && day <= 20) {
        return 'Capricornio';
    } else if(month == 0 && day >= 21 || month == 1 && day <= 18) {
        return 'Aquario';
    } else if(month == 1 && day >= 19 || month == 2 && day <= 20) {
        return 'Peixes';
    } else if(month == 2 && day >= 21 || month == 3 && day <= 20) {
        return 'Aries';
    } else if(month == 3 && day >= 21 || month == 4 && day <= 20) {
        return 'Touro';
    } else if(month == 4 && day >= 21 || month == 5 && day <= 20) {
        return 'Gemeos';
    } else if(month == 5 && day >= 21 || month == 6 && day <= 22) {
        return 'Cancer';
    } else if(month == 6 && day >= 23 || month == 7 && day <= 22) {
        return 'Leao';
    } else if(month == 7 && day >= 23 || month == 8 && day <= 22) {
        return 'Virgem';
    } else if(month == 8 && day >= 23 || month == 9 && day <= 22) {
        return 'Libra';
    } else if(month == 9 && day >= 23 || month == 10 && day <= 21) {
        return 'Escorpiao';
    } else if(month == 10 && day >= 22 || month == 11 && day <= 21){
        return 'Sagitário';
    } else {
        return 'Nenhum';
    }
}

app.get('/users', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json({
            total: result.rowCount,
            users: result.rows
        });
    } catch(e) {
        console.error('Erro ao obter todos os usuários', e);
        res.status(500).send({ mensagem: 'Erro ao obter todos os usuários' });
    }
});

app.get('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);

        if(result.rowCount == 0) {
            res.status(404).send({ message: 'Usuário não encontrado' });
        } else {
            res.json(result.rows[0]);
        }

    } catch(e) {
        console.error('Erro ao obter todos os usuários', e);
        res.status(500).send({ mensagem: 'Erro ao obter todos os usuários' });
    }
});

app.post('/users', async(req, res) => {
    try {
        const { name, lastname, email, birthdate } = req.body;
        const age = ageUser(birthdate);
        const sign = getSign(birthdate);
        await pool.query('INSERT INTO users(name, lastname, email, birthdate, age, sign) VALUES($1, $2, $3, $4, $5, $6)', [name, lastname, email, birthdate, age, sign]);
        res.status(201).send('Sucesso ao criar usuário');
    } catch(e) {
        console.error('Erro ao criar o ussuário', e);
        res.status(500).send({ mensagem: 'Erro ao criar usuário' });
    }
});


app.delete('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id=$1', [id]);
        res.status(200).send({ message: `Usuário com id:${id}, deletado com sucesso` })
    } catch(e) {
        console.error('Erro ao excluir o ussuário', e);
        res.status(500).send({ mensagem: 'Erro ao excluir usuário' });
    }
});

app.put('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { name, lastname, email, birthdate } = req.body;
        const age = ageUser(birthdate);
        const sign = getSign(birthdate);
        await pool.query('UPDATE users SET name=$1, lastname=$2, email=$3, birthdate=$4, age=$5, sign=$6 WHERE id=$7', [name, lastname, email, birthdate, age, sign, id]);
        res.status(200).send({ message: 'Sucesso ao editar usuário'});
    } catch(e) {
        console.error('Erro ao editar usuário', e);
        res.status(500).send({ message: 'Erro ao editar usuário' });
    }
})
;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}🎍`);
})