"strict mode";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const cadastrarCliente = async (
  nome,
  cpf,
  dataNascimento,
  telefone,
  email,
  responsavel,
  funcionario,
  id_agendamento,
  csrfToken
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${baseURL}/clientes/cadastrar-cliente`,
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      data: {
        nome,
        cpf,
        dataNascimento,
        telefone,
        email,
        responsavel,
        funcionario,
        id_agendamento,
      },
    });

    const data = response.data;
    if (response.status === 200) {
      Swal.fire({
        title: "Cadastro Realizado!",
        text: response.data.message,
        icon: "success",
      });

      location.assign("/agenda");
      // Faça as alterações específicas necessárias após o cadastro do cliente
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.message,
    });
  }
};
