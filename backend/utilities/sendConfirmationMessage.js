const axios = require('axios');

// Configurações
const token = process.env.MESSAGE; // Token de acesso do WhatsApp Cloud API
const phoneNumberId = process.env.PHONE_NUMBER_ID; // ID do número de telefone no painel da Meta

// Função para enviar mensagem
async function enviarMensagemWhatsApp(telefone, nome, data, hora) {
  const numeroCliente = `55${telefone.replace(/\D/g, '')}`; // Número do cliente (formato internacional)

  // Estrutura do corpo da mensagem
  const corpoMensagem = {
    messaging_product: 'whatsapp',
    to: numeroCliente,
    type: 'template',
    template: {
      name: 'confirmacao', // Nome do template aprovado
      language: { code: 'pt_BR' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: nome }, // Substitui {{1}}
            { type: 'text', text: data }, // Substitui {{2}}
            { type: 'text', text: hora }, // Substitui {{3}}
          ],
        },
      ],
    },
  };

  try {
    const resposta = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      corpoMensagem,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (erro) {
    console.error(
      'Erro ao enviar mensagem:',
      erro.response?.data || erro.message,
    );
  }
}

module.exports = enviarMensagemWhatsApp;
