const express = require('express');
const db = require('./models'); 
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();

const userRouter = require('./routes/user');
const Payment = require('./routes/payment')

app.use(express.json());
app.use(cors());
app.use('/payment', Payment);
app.use('/auth', userRouter);

db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return db.sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}...`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
