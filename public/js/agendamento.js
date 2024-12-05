"use strict";

import axios from "axios";
import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const agendar = async (
  nome,
  telefone,
  email,
  cpf,
  agendamentos,
  funcionario,
  csrfToken
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${baseURL}/agenda/agendamentos`,
      headers: {
        "CSRF-Token": csrfToken,
      },
      data: {
        nome,
        telefone,
        email,
        cpf,
        agendamentos, // Array de objetos { data, hora }
        funcionario,
      },
    });

    if (response.status === 200) {
      Swal.fire({
        title: "Verifique seu email.",
        text: `Um email de confirmação foi enviado para ${email}.`,
        width: 600,
        padding: "3em",
        color: "#716add",
        confirmButtonColor: "#3085d6",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }

    // recarregar pagina
  } catch (err) {
    console.error(err.response);
    alert("Erro ao agendar, tente novamente!");
  }
};
