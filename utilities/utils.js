// utils.js
const Cliente = require("../models/Clientes");
const Funcionario = require("../models/Funcionarios");

const moment = require("moment-timezone");

async function validarCPF(cpf) {
  // Lógica de validação de CPF
  // Retorna um objeto com { type: 'success' | 'error', message: string, cpf: string }
  if (Number.isNaN(Number(cpf))) {
    return {
      message: "O CPF deve conter apenas números",
      type: `error`,
    };
  }

  if (cpf.length !== 11) {
    return {
      message: "O CPF deve conter 11 dígitos",
      type: `error`,
    };
  }

  // verificar se todos os digitos sao iguais
  if (cpf.split("").every((char) => char === cpf[0])) {
    return {
      message: "CPF inválido",
      type: `error`,
    };
  }

  let soma = 0;
  let resto;

  //validar primeiro digito
  for (let i = 1; i <= 9; i++) {
    soma += Number(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  let digito_um = resto === 10 || resto === 11 ? 0 : resto;

  // validar segundo digito
  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += Number(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  let digito_dois = resto === 10 || resto === 11 ? 0 : resto;

  if (Number(cpf.substring(9, 11)) !== Number(`${digito_um}${digito_dois}`)) {
    return {
      message: "CPF inválido",
      type: `error`,
    };
  } else {
    return {
      message: "CPF válido",
      type: `success`,
      cpf: cpf,
    };
  }
}

async function buscarFuncionarioECliente(funcionario_id, cpf) {
  const [funcionario, cliente] = await Promise.all([
    Funcionario.findById(funcionario_id),
    Cliente.findOne({
      cpf,
    }),
  ]);

  return {
    funcionario,
    cliente,
  };
}

function formatarData(data) {
  const date = moment.utc(data);
  const dia = date.format("DD");
  const mes = date.format("MM");
  const ano = date.format("YYYY");

  return `${dia}/${mes}/${ano}`;
}

function criarRespostaErro(res, status, message) {
  if (!res.headersSent) {
    return res.status(status).json({
      status,
      message,
    });
  }
  // Se os cabeçalhos já foram enviados, não faça nada
}

function diaDisponivel(dataVerificar, agenda) {
  const dataISO = new Date(dataVerificar).toISOString().split("T")[0];

  for (let i = 0; i < agenda.length; i++) {
    const dataAgendaISO = new Date(agenda[i].data).toISOString().split("T")[0];

    if (dataISO === dataAgendaISO) {
      return agenda[i]; // Retorna o objeto do dia específico
    }
  }

  return null; // Dia não encontrado na agenda
}

module.exports = {
  validarCPF,
  buscarFuncionarioECliente,
  criarRespostaErro,
  diaDisponivel,
  formatarData,
};
