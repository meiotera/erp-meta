import { configurarEventListeners } from "./script.js";

document.addEventListener("DOMContentLoaded", function () {
  loadPage();
});

export function loadPage() {
  const mainContent = document.querySelector("main");
  const navLinks = document.querySelectorAll("nav .top--menu ul a");

  function loadPage(url, addToHistory = true) {
    fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar a página");
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newMainContent = doc.querySelector("main");

        if (newMainContent) {
          mainContent.innerHTML = newMainContent.innerHTML;

          // Configurar event listeners para o novo conteúdo carregado
          configurarEventListeners();

          if (addToHistory) {
            window.history.pushState({ path: url }, "", url);
          }
        } else {
          throw new Error("Elemento <main> não encontrado na resposta");
        }
      })
      .catch((error) => console.error("Erro ao carregar a página:", error));
  }

  // Adicionar eventos de clique nos links de navegação
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = this.href;
      loadPage(url);
    });
  });

  // Manipular o botão de voltar/avançar do navegador
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.path) {
      loadPage(event.state.path, false);
    }
  });
}
