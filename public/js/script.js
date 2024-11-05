"use strict";

import "@babel/polyfill";
import { agendar } from "./agendamento.js";
import { login, logout } from "./login.js";
import { formAtendimentoPost } from "./formAtendimento.js";
import { cadastrarCliente } from "./cadastroCliente";
import { criarElemento } from "./criarElemento.js";
import { criarAgenda } from "./criarAgenda.js";
import { buscarHistoricoUnico } from "./buscarHistoricoUnico.js";
import { buscarPaciente } from "./buscaPaciente.js";
import { cadastroEspecialista } from "./cadastroEspecialista.js";
import { updateEspecialista } from "./updateEspecialista.js";
import { deleteCliente } from "./deleteCliente.js";
import { consultarFinanceiro } from "./consultarFinanceiro.js";

import Swal from "sweetalert2";

// ELEMENTOS DO DOM
const formAtualizarEspecialista = document.getElementById(
  "update-dados-especialista"
);
const btnDeleteCliente = document.querySelectorAll("#btn-delete-cliente");
const formFinanceiroEspecialista = document.getElementById(
  "consulta-por-especialista"
);
const loginForm = document.getElementById("login-form");
const cadastroConta = document.getElementById("cadastro-conta");
const logoutBtn = document.getElementById("logout");
const formAgendamento = document.getElementById("agendamento-form");
const formAgendamentoPersonalizado = document.getElementById(
  "agendamento-personalizado"
);

const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

if (btnDeleteCliente) {
  btnDeleteCliente.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = btn.getAttribute("data-id");
      await deleteCliente(id, csrfToken);
    });
  });
}

//MENU
// const input = document.querySelectorAll('.container input');

const accordion = document.querySelectorAll(".accordion");

for (let i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function () {
    this.classList.toggle("active");

    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

// CARDS-ESPECIALISTAS
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  const section_form = document.querySelector(".section_form");
  const form = document.getElementById("agendamento-form");
  const funcionarioIdInput = document.getElementById("funcionario_id");
  const funcionarioNameSpan = document.getElementById("funcionario_nome");

  if (!cards || !funcionarioIdInput || !funcionarioNameSpan) return;

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const funcionarioId = card.getAttribute("data-id");
      const funcionarioNome = card.querySelector(".card-body h5").textContent;

      funcionarioIdInput.value = funcionarioId;
      funcionarioNameSpan.textContent = funcionarioNome;
      section_form.style.display = "block";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const dataElement = document.getElementById("data");
  const horariosSelect = document.getElementById("horarios");
  const funcionarioNomeSpan = document.getElementById("funcionario_nome");
  const funcionarioIdInput = document.getElementById("funcionario_id");
  const sectionForm = document.querySelector(".section_form");

  const inputElements = document.querySelectorAll(".section-equipe input");
  inputElements.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const nextElementSibling = item.nextElementSibling;
      if (!nextElementSibling || !nextElementSibling.firstChild) {
        return;
      }

      const funcionarioId =
        nextElementSibling.firstChild.getAttribute("data-id");
      const funcionarioNome = item.value;
      const agenda = JSON.parse(
        nextElementSibling.firstChild.getAttribute("data-agenda")
      );

      inputElements.forEach((i) => {
        if (i !== this && i.closest(".card-funcionario")) {
          i.closest(".card-funcionario").classList.remove("active");
        }
      });

      if (this.closest(".card-funcionario")) {
        this.closest(".card-funcionario").classList.toggle("active");
      }

      // Atualizar o nome e o ID do funcionário selecionado
      funcionarioNomeSpan.textContent = funcionarioNome;
      funcionarioIdInput.value = funcionarioId;

      // Mostrar a seção do formulário
      sectionForm.style.display = "block";

      // Atualizar o elemento de seleção de datas
      dataElement.innerHTML = '<option value="">Selecione uma data</option>';

      agenda.forEach((dia) => {
        const option = document.createElement("option");
        option.value = dia.data;
        option.textContent = dia.data;
        option.setAttribute(
          "data-horarios",
          JSON.stringify(dia.horariosDisponiveis)
        );
        dataElement.appendChild(option);
      });

      // Adiciona um listener para atualizar horários ao mudar a data
      dataElement.addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        const horariosDisponiveis = JSON.parse(
          selectedOption.getAttribute("data-horarios")
        );

        // Limpar opções anteriores
        horariosSelect.innerHTML =
          '<option value="">Selecione um horário</option>';

        horariosDisponiveis.forEach((horario) => {
          const option = document.createElement("option");
          option.value = horario;
          option.textContent = horario;
          horariosSelect.appendChild(option);
        });
      });
    });
  });
});

// AGENDAMENTO PERSONALIZADO
if (formAgendamentoPersonalizado) {
  formAgendamentoPersonalizado.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const funcionario = document.getElementById("funcionario_id").value; // Pacientes não selecionam funcionário

    const agendamentos = Array.from(
      document.querySelectorAll('select[name="agendamentos"]')
    )
      .filter((select) => select.value)
      .map((select) => ({
        data: select.getAttribute("data-data"),
        hora: select.value,
      }));

    await agendar(
      nome,
      telefone,
      email,
      cpf,
      agendamentos,
      funcionario,
      csrfToken
    );
  });
}

// AGENDAMENTO
if (formAgendamento) {
  formAgendamento.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const funcionario = document.getElementById("funcionario_id").value;

    const agendamentos = [
      {
        data: document.getElementById("data").value,
        hora: document.getElementById("horarios").value,
      },
    ];

    await agendar(
      nome,
      telefone,
      email,
      cpf,
      agendamentos,
      funcionario,
      csrfToken
    );
  });
}

//LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    //verificar se o email é valido
    const emailRegex = /\S+@\S+\.\S+/;

    // se email vazio ou invalido, email vazio ou senha vazia
    if (!emailRegex.test(email) || email === "" || senha === "") {
      alert("Email ou senha inválidos");
      return;
    }

    await login(email, senha);
  });
}

//MODAL DETALHES - ficha do paciente
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona o modal e os botões "Iniciar"
  const modal = document.querySelector("#detalhesModal");
  const iniciarButtons = document.querySelectorAll(".btn-iniciar");
  const closeModalButton = document.querySelector(".close-modal");

  if (!modal) {
    return;
  }

  const nomeSpan = modal.querySelector(".nome");

  if (!nomeSpan) {
    return;
  }

  // Função para abrir o modal e definir o nome do paciente
  function openModal(event) {
    modal.classList.remove("hidden");
    const nomePaciente = event.currentTarget.getAttribute("data-nome");
    nomeSpan.textContent = nomePaciente;
  }

  // Função para fechar o modal
  function closeModal() {
    modal.classList.add("hidden");
    const textareas = modal.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      textarea.value = "";
    });
    const valor = modal.querySelector("#valor");
    if (valor) {
      valor.value = "";
    }
    return;
  }

  // Adiciona os event listeners aos botões "Iniciar"
  iniciarButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  // Adiciona o event listener ao botão de fechar o modal
  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal);
  }
});

//CONSULTA - FORMULARIO
document.addEventListener("DOMContentLoaded", function () {
  const btnIniciar = document.querySelectorAll(".btn-iniciar");
  const btnHistorico = document.querySelector(".btn-historico");

  // Adiciona evento de submissão para o formulário
  const fichaPaciente = document.getElementById("fichaPaciente");
  let id_cliente = null;
  let id_agendamento = null;

  // Adiciona evento de clique para os botões "Iniciar"
  btnIniciar.forEach((btn) => {
    btn.addEventListener("click", function () {
      id_cliente = btn.getAttribute("data-cliente-id");
      id_agendamento = btn.getAttribute("data-agendamento-id");
      btnHistorico.setAttribute("data-cliente-id", id_cliente);
    });
  });

  //ENVIAR FORMULARIO
  if (fichaPaciente) {
    fichaPaciente.addEventListener("submit", async function (e) {
      e.preventDefault();
      const cliente = id_cliente;
      const agendamento = id_agendamento;
      const funcionario = document.getElementById("id_funcionario").value;
      const recursos = document.getElementById("recursos").value;
      const observacao = document.getElementById("observacao").value;
      const encaminhamento = document.getElementById("encaminhamento").value;
      const medicacao = document.getElementById("medicacao").value;
      const objetivo = document.getElementById("objetivo").value;
      const valor = document.getElementById("valor").value;

      if (
        !cliente ||
        !funcionario ||
        !recursos ||
        !observacao ||
        !encaminhamento ||
        !medicacao ||
        !objetivo ||
        !valor
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Verifique se todos os campos estão preenchidos",
        });
        return;
      }

      try {
        await formAtendimentoPost(
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
        );
      } catch (error) {
        return criarRespostaErro(500, "Erro ao criar atendimento");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".pacientes-table tbody");
  const modalContainer = document.querySelector(".modal-overlay");

  // Função para buscar histórico único
  async function handleHistoricoClick(event) {
    if (event.target.classList.contains("btn-historico")) {
      const btnHistorico = event.target;
      const cliente = btnHistorico.getAttribute("data-cliente-id");
      try {
        const historico = await buscarHistoricoUnico(cliente);
        return historico;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao buscar histórico",
        });
      }
    }
  }

  // Delegação de eventos para .btn-historico na tabela de pacientes
  if (container) {
    container.addEventListener("click", handleHistoricoClick);
  }

  // Delegação de eventos para .btn-historico no modal
  if (modalContainer) {
    modalContainer.addEventListener("click", handleHistoricoClick);
  }

  // TROCA DE TELAS ENTRE TABS
  const tabLinks = document.querySelectorAll(".nav-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const tabId = link.getAttribute("data-tab");

      tabLinks.forEach((link) => link.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
});

// Abrir pagina cadastrar cliente

function adicionarEventoCadastrarCliente() {
  const btnCadastrarCliente = document.querySelectorAll(
    ".btn-cadastrar-cliente"
  );

  if (btnCadastrarCliente) {
    btnCadastrarCliente.forEach((btn) => {
      btn.addEventListener("click", function (event) {
        const cpf = event.currentTarget.getAttribute("data-cpf");
        const agendamento = event.currentTarget.getAttribute("data-id");
        location.assign(
          `/cadastrar-cliente?cpf=${cpf}&agendamento=${agendamento}`
        );
      });
    });
  }
}
adicionarEventoCadastrarCliente();

// CADASTRO CLIENTE
document.addEventListener("DOMContentLoaded", function () {
  const formCadastroCliente = document.querySelector(".cadastro-cliente");

  // obter o valor do parâmetro 'cpf' da URL
  function getDataUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get("cpf");
    const agendamento = urlParams.get("agendamento");
    return {
      cpf,
      agendamento,
    };
  }

  // inserir o valor do 'cpf' no campo de entrada
  function insertDataInput() {
    const { cpf, agendamento } = getDataUrl();
    if (cpf) {
      document.getElementById("cpf").value = cpf;
    }
    if (agendamento) {
      document.getElementById("id_agendamento").value = agendamento;
    }
  }

  window.onload = insertDataInput;

  if (formCadastroCliente) {
    formCadastroCliente.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const cpfInput = document.getElementById("cpf").value;
      const agendamentoInput = document.getElementById("id_agendamento").value;
      const dataNascimento = document.getElementById("data_nascimento").value;
      const telefone = document.getElementById("telefone").value;
      const email = document.getElementById("email").value;
      const responsavel = document.getElementById("responsavel").value;
      const funcionario = document.getElementById("id_funcionario").value;

      // Corrigir a verificação dos campos
      if (
        !nome ||
        !cpfInput ||
        !dataNascimento ||
        !telefone ||
        !email ||
        !responsavel ||
        !agendamentoInput
      ) {
        alert("Preencha todos os campos");
        return;
      }

      try {
        await cadastrarCliente(
          nome,
          cpfInput,
          dataNascimento,
          telefone,
          email,
          responsavel,
          funcionario,
          agendamentoInput,
          csrfToken
        );
      } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
      }
    });
  }
});

// INSERIR ELEMENTO DA AGENDA
document.addEventListener("DOMContentLoaded", function () {
  const addDia = document.querySelector(".btn-add-dia");
  const btnsContainer = document.querySelector(".btns");

  if (addDia && btnsContainer) {
    addDia.addEventListener("click", function () {
      const div = criarElemento("div", ["form-group"]);
      const inputDia = criarElemento("input", [], "", "date", true);
      const btnAddHorario = criarElemento(
        "button",
        ["btn", "btn-add-horarios"],
        "Adicionar horários",
        "button"
      );

      div.append(inputDia, btnAddHorario);

      if (document.querySelector(".btn-salvar") === null) {
        if (div) {
          const btnSalvar = criarElemento(
            "button",
            ["btn", "btn-salvar"],
            "Salvar",
            "submit"
          );
          btnsContainer.appendChild(btnSalvar);
        }
      }

      btnsContainer.parentNode.insertBefore(div, btnsContainer);

      btnAddHorario.addEventListener("click", function () {
        criarInputHorario(div);
      });
    });
  }

  function criarInputHorario(container) {
    const inputHorario = criarElemento("input", [], "", "time", true);
    const btnDelete = criarElemento(
      "button",
      ["btn-delete"],
      "Remover",
      "button"
    );
    inputHorario.name = "horario";

    btnDelete.addEventListener("click", function () {
      container.removeChild(inputHorario);
      container.removeChild(btnDelete);
    });

    container.append(inputHorario, btnDelete);
  }
});

// CRIAR AGENDA
document.addEventListener("DOMContentLoaded", function () {
  const formAgenda = document.querySelector("#nova-agenda-form");
  const btnSalvar = document.querySelector(".btn-salvar");

  if (formAgenda) {
    formAgenda.addEventListener("submit", async function (e) {
      e.preventDefault();

      const funcionario = document.getElementById("id_funcionario").value;
      const dias = document.querySelectorAll('.form-group input[type="date"]');

      const agenda = [];

      dias.forEach((dia, index) => {
        const horariosDia = [];
        const horariosCorrespondentes = document.querySelectorAll(
          `.form-group:nth-of-type(${index + 1}) input[type="time"]`
        );

        horariosCorrespondentes.forEach((horario) => {
          horariosDia.push({
            horario: horario.value,
            disponivel: true,
          });
        });

        agenda.push({
          data: dia.value,
          horariosDisponiveis: horariosDia,
        });
      });

      try {
        await criarAgenda(agenda, funcionario, csrfToken);
      } catch (error) {
        console.error("Erro ao criar agenda:", error);
      }
    });
  }
});

// BUSCAR PACIENTE
// document.addEventListener("DOMContentLoaded", function () {
const searchForm = document.querySelector("#searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = document.getElementById("input-query").value;

    if (!query) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Informe um CPF ou nome para buscar",
      });
      return;
    }

    await buscarPaciente(query, csrfToken);
  });
}
// });

document.addEventListener("DOMContentLoaded", function () {
  const cadastro_especialista = document.getElementById(
    "cadastro-especialista"
  );

  if (cadastro_especialista) {
    cadastro_especialista.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const telefone = document.getElementById("telefone").value;
      const profissao = document.getElementById("profissao").value;
      const password = document.getElementById("password").value;
      const confirm_password =
        document.getElementById("confirm_password").value;
      const role = document.getElementById("role").value;

      if (
        !nome ||
        !email ||
        !telefone ||
        !profissao ||
        !password ||
        !role ||
        !confirm_password
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Preencha todos os campos",
        });
        return;
      }

      try {
        await cadastroEspecialista(
          nome,
          email,
          telefone,
          profissao,
          password,
          confirm_password,
          role,
          csrfToken
        );
      } catch (error) {
        console.error("Erro ao cadastrar especialista:", error);
      }
    });
  }
});

// ATUALIZAR ESPECIALISTA
if (formAtualizarEspecialista) {
  formAtualizarEspecialista.addEventListener("submit", async function (e) {
    e.preventDefault();

    const foto = document.getElementById("foto").files[0];
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const profissao = document.getElementById("profissao").value;
    const valor_consulta = document.getElementById("valor-consulta").value;
    const descricao = document.getElementById("descricao").value;
    const instagram = document.getElementById("instagram").value;
    const id = document.getElementById("_id").value;

    if (
      (!nome || !email || !telefone || !profissao || !valor_consulta || !foto,
      !descricao)
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Preencha todos os campos",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("profissao", profissao);
    formData.append("valor_consulta", valor_consulta);
    formData.append("foto", foto);
    formData.append("descricao", descricao);
    formData.append("instagram", instagram);
    formData.append("_id", id);

    await updateEspecialista(formData, csrfToken);
  });
}

// FINANCEIRO
if (formFinanceiroEspecialista) {
  formFinanceiroEspecialista.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dataInicial = document.getElementById("data-inicial").value;
    const dataFinal = document.getElementById("data-final").value;

    if (!dataInicial || !dataFinal) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Informe a data inicial e final para a consulta",
      });
      return;
    }

    await consultarFinanceiro(dataInicial, dataFinal, csrfToken);
  });
}

// LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    await logout();
  });
}

//teste
document.addEventListener("DOMContentLoaded", () => {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  const loadPage = async (page) => {
    try {
      const response = await fetch(`/agenda?page=${page}&limit=5`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.ok) {
        const html = await response.text(); // Converte a resposta para HTML
        document.querySelector("#table-body").innerHTML = html;
        window.history.pushState({}, "", `?page=${page}&limit=5`);
        adicionarEventoCadastrarCliente();
      } else {
        throw new Error("Erro ao carregar a página");
      }
    } catch (error) {
      console.error("Erro ao carregar a página:", error);
    }
  };

  if (prevPageButton) {
    prevPageButton.addEventListener("click", () => {
      const currentPage =
        parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
      if (currentPage > 1) {
        loadPage(currentPage - 1);
      }
    });
  }

  if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
      const currentPage =
        parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
      loadPage(currentPage + 1);
    });
  }
});
