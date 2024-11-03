import Swal from "sweetalert2";

export const consultarFinanceiro = async (
  dataInicial,
  dataFinal,
  csrfToken
) => {
  try {
    const response = await fetch("http://localhost:3000/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        dataInicial,
        dataFinal,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });

        renderizarDados(data.data.realizado);
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

// Função para renderizar os dados na tabela
const renderizarDados = (dados) => {
  const tbody = document.querySelector("#table-financeiro tbody");
  tbody.innerHTML = ""; // Limpar conteúdo anterior

  dados.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${item.valorTotal.toFixed(2)}</td>
    `;

    tbody.appendChild(tr);
  });
};
