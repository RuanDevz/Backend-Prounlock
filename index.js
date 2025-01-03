const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();

app.use(express.json());
app.use(cors());

// Rotas de API
const userRouter = require('./routes/user');
const payRouter = require('./routes/payment');
const VipRouter = require('./routes/Vip');
const Forgotpass = require('./routes/forgotpassword');
const ResetPasswordRouter = require('./routes/resetpassword');
const UpdateVipStatus = require('./routes/updatevipstatus');
const streamingRouter = require('./routes/streaming');

const SendEmailRouter = require('./routes/sendEmail');

app.use('/api/streaming', streamingRouter);  
app.use('/auth', userRouter);
app.use('/vipcontent', VipRouter);
app.use('/pay', payRouter);
app.use('/forgot-password', Forgotpass);
app.use('/reset-password', ResetPasswordRouter);
app.use('/update-vip-status', UpdateVipStatus);
app.use('/api', SendEmailRouter);
app.use('/password', Forgotpass);




const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, 
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dado:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados');
  done();
});

db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return db.sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}...`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados Sequelize:', err);
  });
