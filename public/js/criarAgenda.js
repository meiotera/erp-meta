"strict mode";

import axios from "axios";
import Swal from "sweetalert2";

export const criarAgenda = async (agenda, id_funcionario, csrfToken) => {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/criar-agenda",
      headers: {
        "CSRF-Token": csrfToken,
      },
      data: {
        agenda,
        id_funcionario,
      },
    });

    const data = response.data;

    if (response.data.status === "success") {
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        location.assign("/agenda");
      }, 1500);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.message,
    });
  }
};
