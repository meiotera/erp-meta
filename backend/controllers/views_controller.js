const { formatarData } = require("../utilities/utils");
const Funcionarios = require("../models/Funcionarios");
const Agenda_Especialista = require("../models/Agenda_Especialista");
const Agendamento = require("../models/Agendamento");
const Atendimento = require("../models/Atendimento");

const {
  getHistoricoCliente,
} = require("../controllers/atendimento_controller");

const {
  listar_meus_pacientes,
  buscar_paciente,
} = require("../controllers/cliente_controller");

const { meus_agendamentos } = require("../controllers/agendamento_controller");

exports.getHome = async (req, res, next) => {
  try {
    const funcionarios = await Funcionarios.find();
    res.status(200).json({ funcionarios });
  } catch (error) {
    next(error);
  }
};

exports.getAgendamento = async (req, res, next) => {
  try {
    const buscarAgenda = await Agenda_Especialista.find().populate(
      "funcionario"
    );
    const agenda = buscarAgenda.map((agendaItem) => {
      const agendaFiltrada = agendaItem.agenda
        .map((dia) => {
          const horariosDisponiveis = dia.horariosDisponiveis
            .filter((horario) => horario.disponivel === true)
            .map((horario) => horario.horario);

          return {
            data: formatarData(dia.data),
            horariosDisponiveis,
          };
        })
        .filter((dia) => dia.horariosDisponiveis.length > 0); // Filtra apenas os dias com horários disponíveis

      return {
        nome: agendaItem.funcionario.nome,
        valor: agendaItem.funcionario.valor_consulta,
        id: agendaItem.funcionario._id,
        profissao: agendaItem.funcionario.profissao, // Inclua a profissão do funcionário diretamente
        agenda: agendaFiltrada,
      };
    });

    res.status(200).json({ agenda });
  } catch (error) {
    next(error);
  }
};

exports.getHorariosDatas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agenda = await Agenda_Especialista.findOne({ funcionario: id });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda não encontrada" });
    }

    const dias = agenda.agenda.map((dia) => formatarData(dia.data));
    const horarios = agenda.agenda.map((dia) => {
      // Filtrar apenas os horários disponíveis
      return dia.horariosDisponiveis.filter((horario) => horario.disponivel);
    });

    res.status(200).json({ dias, horarios });
  } catch (error) {
    next(error);
  }
};

exports.getLogin = async (req, res, next) => {
  res.status(200).json({ message: "Login page" });
};

exports.getAgenda = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const agendamentos = await meus_agendamentos(req, res, next, skip, limit);
    const funcionario = req.funcionario.id;

    const atendimentosRealizados = await Atendimento.find({
      realizado: true,
    }).populate("agendamento");

    const agendamentosFiltrados = agendamentos.filter((agendamento) => {
      const agendamentoRealizado = atendimentosRealizados.find(
        (atendimento) => {
          return (
            atendimento.agendamento &&
            atendimento.agendamento._id.toString() ===
              agendamento._id.toString()
          );
        }
      );

      return !agendamentoRealizado;
    });

    const totalAgendamentos = await Agendamento.countDocuments({
      funcionario,
    });

    const agendamentosFormatados = agendamentosFiltrados
      .slice(0, limit)
      .map((agendamento) => {
        return {
          nome: agendamento.nome,
          cpf: agendamento.cpf,
          telefone: agendamento.telefone,
          data: formatarData(agendamento.data),
          hora: agendamento.hora,
          id: agendamento._id,
          isCadastrado: agendamento.isCadastrado,
          cliente: agendamento.cliente,
        };
      });

    const agenda = await Agenda_Especialista.findOne({
      funcionario: funcionario,
      "agenda.horariosDisponiveis": { $elemMatch: { disponivel: true } },
    }).populate("funcionario");

    if (!agenda) {
      console.log(
        "Agenda do especialista não encontrada para o funcionarioId: ",
        funcionario
      );
      return res.status(200).json({
        status: "success",
        agendamentos: agendamentosFormatados,
        agenda: [], // Passar um array vazio se não houver agenda
        page,
        limit,
        totalAgendamentos,
      });
    }

    const agendaFormatada = agenda.agenda
      .map(({ data, horariosDisponiveis }) => {
        return {
          data: formatarData(data),
          horariosDisponiveis: horariosDisponiveis
            .filter((horario) => horario.disponivel === true) // mantém apenas horários disponíveis
            .map((horario) => ({
              hora: horario.horario,
              disponivel: horario.disponivel,
            })),
        };
      })
      .filter(({ horariosDisponiveis }) => horariosDisponiveis.length > 0);

    res.status(200).json({
      status: "success",
      agendamentos: agendamentosFormatados,
      agenda: agendaFormatada,
      page,
      limit,
      totalAgendamentos,
    });
  } catch (error) {
    next(error);
  }
};

exports.meusPacientes = async (req, res, next) => {
  try {
    const meusPacientes = await listar_meus_pacientes(req, res, next);
    res.status(200).json({
      status: "success",
      pacientes: meusPacientes,
    });
  } catch (error) {
    next(error);
  }
};

exports.meusAtendimentosRealizados = async (req, res, next) => {
  try {
    const funcionario = req.funcionario.id;

    const meus_atendimentos = await Atendimento.find({
      funcionario: funcionario,
    })
      .populate("cliente")
      .populate("agendamento");

    res.status(200).json({
      status: 200,
      message: "Atendimentos realizados",
      meus_atendimentos,
    });
  } catch (error) {
    return criarRespostaErro(res, 500, "Erro ao buscar atendimentos");
  }
};

exports.getCadastroCliente = async (req, res, next) => {
  res.status(200).json({ message: "Cadastro de cliente" });
};

exports.renderHistoricoCliente = async (req, res, next) => {
  try {
    const historicoAtendimento = await getHistoricoCliente(req, res, next);
    res.status(200).json({
      status: 200,
      message: "Histórico do cliente",
      historico: historicoAtendimento,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar histórico do cliente",
    });
  }
};

exports.getCadastrarEspecialista = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Cadastrar especialista" });
  } catch (error) {
    next(error);
  }
};

exports.getMeuPerfil = async (req, res, next) => {
  res.status(200).json({ message: "Meu perfil" });
};

exports.getFinanceiro = async (req, res, next) => {
  res.status(200).json({ message: "Financeiro" });
};  


