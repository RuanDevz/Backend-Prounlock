const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();

const app = express();

const userRouter = require('./routes/user');
const linkRouter = require('./routes/Free');
const payRouter = require('./routes/payment');
const VipRouter = require('./routes/Vip');
const Forgotpass = require('./routes/forgotpassword')
const ResetPasswordRouter = require('./routes/resetpassword')

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
app.use('/freecontent', linkRouter);
app.use('/vipcontent', VipRouter);
app.use('/pay', payRouter); 
app.use('/forgot-password', Forgotpass)
app.use('/reset-password', ResetPasswordRouter)



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
