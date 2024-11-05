"use strict";

import Swal from "sweetalert2";

export const login = async (email, password) => {
  try {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const response = await fetch("/funcionarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // Inclua o token CSRF no cabeçalho
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      Swal.fire({
        title: "Login bem-sucedido!",
        icon: "success",
        confirmButtonText: "Ok",
      });
      location.assign("/agenda");
    } else {
      throw new Error(data.message || "Falha ao fazer login");
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.message || "Algo deu errado. Por favor, tente novamente.",
    });
  }
};

export const logout = async () => {
  try {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const res = await fetch("http://localhost:3000/funcionarios/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // Inclua o token CSRF no cabeçalho
      },
    });

    // ao fazer logout, redirecionar para a home
    if (res.status === 200) {
      location.assign("/");
    } else {
      throw new Error("Falha ao fazer logout");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo deu errado. Por favor, tente novamente.",
    });
  }
};
