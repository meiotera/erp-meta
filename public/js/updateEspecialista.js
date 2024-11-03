"use strict";

import Swal from "sweetalert2";

export const updateEspecialista = async (formData, csrfToken) => {
  try {
    const response = await fetch(
      `http://localhost:3000/funcionarios/update-especialista`,
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
