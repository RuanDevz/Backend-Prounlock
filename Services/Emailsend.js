const nodemailer = require('nodemailer');

const sendEmail = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: formData.email, 
    to: 'prounlocksuporte@gmail.com', 
    subject: `PROUNLOCK Mensagem de ${formData.name}`,
    text: `Você recebeu uma nova mensagem:\n\nNome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return 'Mensagem enviada com sucesso!';
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email');
  }
};

module.exports = sendEmail;
