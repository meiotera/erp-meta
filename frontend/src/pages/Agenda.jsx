import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../Contexts/LoginContext';
import { AgendaContext } from '../Contexts/AgendaContext';
import { cadastrarCliente } from '../../api/cadastroCliente';
import SectionMain from '../components/SectionMain/SectionMain';
import Tabela from '../components/Tabela/Tabela';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import Formulario from '../components/Formulario/Formulario';
import Section from '../components/Section/Section';
import Loading from '../components/Loading/Loading';

const colunas = [
  { header: 'Nome', field: 'cliente' },
  { header: 'Data', field: 'data' },
  { header: 'Hora', field: 'hora' },
  { header: 'Telefone', field: 'telefone' },
  { header: 'Ações', field: 'cadastrado' },
];

const campos = [
  {
    id: 'nome',
    type: 'text',
    placeholder: 'Nome',
    label: 'Nome',
    name: 'nome',
  },
  {
    id: 'telefone',
    type: 'text',
    placeholder: 'Telefone',
    label: 'Telefone',
    name: 'telefone',
  },
  { id: 'cpf', type: 'text', placeholder: 'CPF', label: 'CPF', name: 'cpf' },
  {
    id: 'email',
    type: 'email',
    placeholder: 'E-mail',
    label: 'E-mail',
    name: 'email',
  },
  {
    id: 'dataNascimento',
    type: 'date',
    placeholder: 'Data de Nascimento',
    label: 'Data de Nascimento',
    name: 'dataNascimento',
  },
  {
    id: 'responsavel',
    type: 'text',
    placeholder: 'Responsável',
    label: 'Responsável',
    name: 'responsavel',
  },
];

const Agenda = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { funcionario } = useContext(LoginContext);
  const { agenda, loading, message, carregarAgenda } =
    useContext(AgendaContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const formatarAgendamentos = useCallback(() => {
    if (!agenda?.agendamentos?.length) return [];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return agenda.agendamentos.slice(0, endIndex).map((agendamento) => ({
      data: agendamento.data,
      hora: agendamento.hora,
      cpf: agendamento.cpf,
      cliente: agendamento.nome,
      telefone: agendamento.telefone,
      id: agendamento.id,
      cadastrado:
        agendamento.isCadastrado || agendamento.id === agendamentoId ? (
          <Button
            className={'btn-success'}
            action={() =>
              navigate(
                `/agenda/consulta?nome=${agendamento.nome}&cliente=${agendamento.cliente.id}&agendamento=${agendamento.id}&funcionario=${funcionario.id}`,
              )
            }
          >
            Iniciar
          </Button>
        ) : (
          <Button
            action={() => abrirModal(agendamento.id)}
            className={'btn-info'}
          >
            Cadastrar
          </Button>
        ),
    }));
  }, [agenda.agenda, page, agendamentoId, navigate]);

  useEffect(() => {
    setAgendamentos(formatarAgendamentos());
  }, [page, agendamentoId, agenda]);

  const abrirModal = useCallback((id) => {
    setAgendamentoId(id);
    setIsOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = async (formData) => {
    const response = await cadastrarCliente(formData);

    if (response.status === 200) {
      fecharModal();
      await carregarAgenda(); // Recarrega a agenda após o cadastro do cliente
      setAgendamentos(formatarAgendamentos());
    }

    return response;
  };

  const carregarMais = useCallback(() => {
    if (agendamentos.length < agenda.agendamentos.length) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [agendamentos, agenda]);

  useEffect(() => {
    carregarAgenda();
  }, [location.pathname]);

  if (loading && agendamentos.length === 0) {
    return <Loading />;
  }

  if (message) {
    return <div className={`alert ${message.type}`}>{message.text}</div>;
  }

  // Verifica se há uma rota aninhada ativa
  const isNestedRouteActive = location.pathname !== '/agenda';

  return (
    <SectionMain>
      {isNestedRouteActive ? (
        <>
          <Outlet />
        </>
      ) : (
        <Section headingH2={`Olá ${funcionario.nome}`}>
          <div className="container-table">
            {agenda.agendamentos < 1 ? (
              <p>Sem atendimentos agendados</p>
            ) : (
              <Tabela colunas={colunas} dados={agendamentos} />
            )}
          </div>
          {modalIsOpen && (
            <Modal isOpen={modalIsOpen} onClose={fecharModal}>
              <Formulario
                campos={campos}
                btnForm={'Cadastrar'}
                agendamentoId={agendamentoId}
                handleSubmit={handleSubmit}
                idFuncionario={funcionario.id}
              />
            </Modal>
          )}
          {loading && <Loading />}
          {!loading && agendamentos.length < agenda.agendamentos.length && (
            <Button className={'btn-primary'} action={carregarMais}>
              Carregar mais
            </Button>
          )}
        </Section>
      )}
    </SectionMain>
  );
};

export default Agenda;
