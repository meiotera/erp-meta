const axios = require("axios");

// Sua chave de API da Brevo

const sendTransactionalEmail = async (emailCliente, nome, data, hora) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: emailCliente }],
        subject: "Confirmação de Agendamento",
        htmlContent: `<html><body><h1>Olá ${nome}!</h1><p>Seu agendamento foi confirmado para a data ${data} às ${hora}h.</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erro ao enviar o e-mail:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = sendTransactionalEmail;
