"use strict";

import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const cadastroEspecialista = async (
  nome,
  email,
  telefone,
  profissao,
  password,
  confirm_password,
  role,
  csrfToken,
  descricao
) => {
  try {
    const response = await fetch(
      `${baseURL}/funcionarios/cadastrar-especialista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          profissao,
          password,
          confirm_password,
          role,
          descricao,
          // csrfToken,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json(); // Analisa a resposta JSON
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: data.message, // Acessa a mensagem da resposta
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível conectar ao servidor.",
    });
  }
};
