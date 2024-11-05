"strict mode";

import axios from "axios";
import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const formAtendimentoPost = async (
  cliente,
  funcionario,
  recursos,
  observacao,
  encaminhamento,
  medicacao,
  objetivo,
  valor,
  agendamento,
  csrfToken
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${baseURL}/atendimento`,
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      data: {
        cliente,
        funcionario,
        recursos,
        observacao,
        encaminhamento,
        medicacao,
        objetivo,
        valor,
        agendamento,
      },
    });

    if (response.data.status === 200) {
      Swal.fire({
        title: "Atendimento realizado com sucesso!",
        text: response.data.message,
        icon: "question",
      });
      location.assign("/agenda");
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.message,
    });
  }
};
