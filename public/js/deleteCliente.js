import Swal from "sweetalert2";
import { renderizarTabela } from "./criarElemento.js";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const deleteCliente = async (id, csrfToken) => {
  try {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Depois de confirmar, o cliente será deletado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, apagar",
      cancelButtonText: "cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        const response = fetch(`${baseURL}/clientes/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        });

        const row = document.getElementById(`row-${id}`);
        row.remove();

        Swal.fire({
          title: "Deletado!",
          text: "O cliente foi deletado.",
          icon: "success",
        });
      }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro ao deletar cliente",
      text: "Ocorreu um erro ao deletar o cliente. Tente novamente mais tarde.",
    });
  }
};
