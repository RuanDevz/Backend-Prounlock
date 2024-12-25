const nodemailer = require('nodemailer');

const sendEmail = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // ou outro serviço, como Outlook, Yahoo
    auth: {
      user: 'prounlocksuporte@gmail.com',
      pass: 'sua-senha-do-email', // Use variáveis de ambiente para maior segurança
    },
  });

  const mailOptions = {
    from: formData.email, // E-mail do remetente
    to: 'prounlocksuporte@gmail.com', // Alterado para o e-mail de destino correto
    subject: `Nova mensagem de ${formData.name}`,
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
