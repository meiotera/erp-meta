"use strict";

import Swal from "sweetalert2";
import { renderizarTabela } from "./criarElemento.js";

export const buscarPaciente = async (query) => {
  try {
    const response = await fetch(
      `http://localhost:3000/clientes/buscar-cliente`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await response.json();

    const paciente = data.paciente;

    if (data.status === 200) {
      const container = document.querySelector(".pacientes-table tbody");
      renderizarTabela(paciente, container);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message,
    });
  }
};
