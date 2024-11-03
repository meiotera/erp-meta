"use strict";

const criarElemento = (elemento, classe, texto, tipo, required = false) => {
  const elementoCriado = document.createElement(elemento);
  elementoCriado.classList.add(...classe);
  elementoCriado.textContent = texto;
  elementoCriado.type = tipo;
  elementoCriado.required = required;
  return elementoCriado;
};

const renderizarTabela = (paciente, container) => {
  const linha = criarElemento("tr", "", "", "", false);
  const link = criarElemento("a", ["btn-historico"], paciente.nome, "a", false);
  const nome = criarElemento("td", "", [], "", false);
  const telefone = criarElemento("td", "", paciente.telefone, "", false);
  const cpf = criarElemento("td", "", paciente.cpf, "", false);

  link.setAttribute("data-cliente-id", paciente.id);

  nome.appendChild(link);

  container.innerHTML = "";
  container.appendChild(linha);

  linha.append(nome, telefone, cpf);
};

export { criarElemento, renderizarTabela };
