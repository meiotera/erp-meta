"use strict";

import Swal from "sweetalert2";
import { renderizarTabela } from "./criarElemento.js";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const buscarPaciente = async (query, csrfToken) => {
  try {
    const response = await fetch(`${baseURL}/clientes/buscar-cliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ query }),
    });

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
