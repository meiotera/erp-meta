"use strict";

import Swal from "sweetalert2";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const updateEspecialista = async (formData, csrfToken) => {
  try {
    const response = await fetch(
      `${baseURL}/funcionarios/update-especialista`,
      {
        method: "PATCH",
        headers: {
          "CSRF-Token": csrfToken,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar especialista");
    }

    const data = await response.json();

    if (data.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: data.message,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }
};
