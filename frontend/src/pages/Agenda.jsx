import React, { useContext, useEffect, useState, useCallback } from 'react';
import { LoginContext } from '../Contexts/LoginContext';
import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AgendaContext } from '../Contexts/AgendaContext';
import Loading from '../components/Loading/Loading';
import Agendamentos from './Agendamentos';
import GerenciarAgenda from './GerenciarAgenda';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import FormCadastroCliente from '../components/FormCadastroCliente/FormCadastroCliente';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'; // 1. Importar ConfirmModal

const Agenda = () => {
  const { funcionario } = useContext(LoginContext);
  const { agenda, loading, carregarAgenda, deleteAgendamento } =
    useContext(AgendaContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState(null);

  const handleOpenConfirmModal = (agendamento) => {
    setAgendamentoToDelete(agendamento);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setAgendamentoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (agendamentoToDelete) {
      deleteAgendamento(agendamentoToDelete.id);
      handleCloseConfirmModal();
    }
  };

  const formatarAgendamentos = useCallback(() => {
    if (!agenda?.agendamentos?.length) return [];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return agenda.agendamentos.slice(0, endIndex).map((agendamento) => {
      const botaoPrincipal =
        agendamento.isCadastrado && funcionario ? (
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
            action={() => {
              setIsOpen(true);
              setAgendamentoSelecionado(agendamento);
            }}
            className={'btn-info'}
          >
            Cadastrar
          </Button>
        );

      const botaoExcluir = (
        <Button
          className={'btn-danger ms-2'}
          action={() => handleOpenConfirmModal(agendamento)}
          title="Excluir Agendamento"
        >
          Excluir
        </Button>
      );

      return {
        data: agendamento.data,
        hora: agendamento.hora,
        cpf: agendamento.cpf,
        cliente: agendamento.nome,
        telefone: agendamento.telefone,
        email: agendamento.email,
        id: agendamento.id,
        acoes: (
          <>
            {botaoPrincipal}
            {botaoExcluir}
          </>
        ),
      };
    });
  }, [agenda, page, navigate, funcionario, deleteAgendamento]);

  useEffect(() => {
    setAgendamentos(formatarAgendamentos());
  }, [page, agenda, formatarAgendamentos]);

  const carregarMais = useCallback(() => {
    if (
      agenda?.agendamentos &&
      agendamentos.length < agenda.agendamentos.length &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [agendamentos, agenda, loading]);

  useEffect(() => {
    if (!agenda?.agendamentos?.length) {
      carregarAgenda();
    }
  }, [carregarAgenda, agenda?.agendamentos]);

  if (loading && agendamentos.length === 0) {
    return <Loading />;
  }

  const isNestedRouteActive = location.pathname !== '/agenda';

  return (
    <>
      {isNestedRouteActive ? (
        <Outlet />
      ) : (
        <>
          <Agendamentos
            funcionario={funcionario}
            agendamentos={agendamentos}
            loading={loading}
            carregarMais={carregarMais}
          />
          <GerenciarAgenda />
          {modalIsOpen && (
            <Modal
              isOpen={modalIsOpen}
              onClose={() => {
                setIsOpen(false);
                setAgendamentoSelecionado(null);
              }}
            >
              <FormCadastroCliente
                fecharModal={() => {
                  setIsOpen(false);
                  setAgendamentoSelecionado(null);
                }}
                agendamento={agendamentoSelecionado}
              />
            </Modal>
          )}

          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={handleCloseConfirmModal}
            onConfirm={handleConfirmDelete}
            message={`Tem certeza que deseja excluir o agendamento de ${
              agendamentoToDelete?.nome || ''
            }?`}
          />
        </>
      )}
    </>
  );
};

export default Agenda;
