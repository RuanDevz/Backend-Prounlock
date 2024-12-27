const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { User } = require("../models");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; 

    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/#/resetpassword?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PROUNLOCK - RESETAR SENHA",
      html: `<p>Você solicitou o reset da sua senha, basta clicar no link</p>
             <a href="${resetLink}">Resetar senha</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Solicitação de reset de senha foi enviado para o email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending password reset email." });
  }
});

module.exports = router;