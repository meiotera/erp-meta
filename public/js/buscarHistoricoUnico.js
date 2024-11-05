"use strict";

import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const buscarHistoricoUnico = async (id_cliente) => {
  try {
    const response = await fetch(`${baseURL}/historico-cliente/${id_cliente}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await response.json();

    const historico = data.historico;

    if (historico.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Nenhum atendimento encontrado.",
      });

      return [];
    }

    if (data.status === 200) {
      renderizarHistorico(historico);

      return historico;
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
  }
};

const renderizarHistorico = (historico) => {
  const container = document.querySelector(".atendimento-anterior");

  container.innerHTML = "";

  historico.sort(
    (a, b) => new Date(b.agendamento.data) - new Date(a.agendamento.data)
  );

  historico.forEach((atendimento) => {
    const section = document.createElement("section");

    section.innerHTML = `
            <div class='card-header'>
              <h3 class=''>${atendimento.agendamento.nome}</h3>
                <p><strong>Data do Agendamento:</strong> ${new Date(
                  atendimento.agendamento.data
                ).toLocaleDateString()}</p>
            </div>
            <div class='card-body'>
                <p><strong>CPF:</strong> ${atendimento.agendamento.cpf}</p>
                <p><strong>Telefone:</strong>: ${
                  atendimento.agendamento.telefone
                }</p>
                <p><strong>Encaminhamento:</strong> ${
                  atendimento.encaminhamento
                }</p>
                <p><strong>Medicação:</strong> ${atendimento.medicacao}</p>
                <p><strong>Objetivo:</strong> ${atendimento.objetivo}</p>
                <p><strong>Observação:</strong> ${atendimento.observacao}</p>
                <p><strong>Recursos:</strong> ${atendimento.recursos}</p>
            </div>
        `;

    container.appendChild(section);
  });
};
