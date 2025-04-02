import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Section from '../components/Section/Section';
import SectionMain from '../components/SectionMain/SectionMain';
import FormAgendamento from '../components/FormAgendamento/FormAgendamento';
import Equipe from '../components/Equipe/Equipe';
import Loading from '../components/Loading/Loading';
import Message from '../components/Message/Message';
import Modal from '../components/Modal/Modal';
import { UsersContext } from '../Contexts/UsersContext';

function Agendamento() {
  const {
    loading,
    agenda,
    setAgenda,
    fetchAgenda,
    message,
    setMessage,
    setLoading,
  } = useContext(UsersContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  const location = useLocation();

  // Função que abre o modal
  const abrirModal = () => {
    setIsOpen(true);
    setLoading(false);
    // Reseta a mensagem ao abrir o modal
  };

  // Função que fecha o modal
  const fecharModal = () => {
    setIsOpen(false);
    setDiasDisponiveis([]);
    setHorariosDisponiveis([]);
    setMessage(null);
    setAgenda([]);
  };

  // Função chamada ao clicar em um profissional
  const selecionarProfissional = (id) => {
    fecharModal(); // Fecha o modal antes de buscar a nova agenda
    setProfissionalSelecionado(id);
    setMessage(null); // Reseta a mensagem
    setDiasDisponiveis([]); // Reseta os dias disponíveis
    setHorariosDisponiveis([]); // Reseta os horários disponíveis
    fetchAgenda(id); // Busca a agenda do profissional
  };

  const atualizarDiasEHorarios = useCallback(() => {
    if (!agenda || agenda.length === 0) {
      if (modalIsOpen) {
        setMessage({
          type: 'error',
          text: 'Agenda não disponível para este profissional.',
        });
      }
      return;
    }

    const diasComHorarios = agenda.filter((item) =>
      item.horariosDisponiveis.some((h) => h.disponivel),
    );

    if (diasComHorarios.length > 0) {
      setDiasDisponiveis(diasComHorarios);

      const horarios = diasComHorarios.flatMap((item) =>
        item.horariosDisponiveis.map((h) => ({
          horario: h.horario,
          disponivel: h.disponivel,
        })),
      );
      setHorariosDisponiveis(horarios);

      abrirModal(); // Abre o modal se houver horários disponíveis
    } else {
      if (modalIsOpen) {
        setMessage({
          type: 'error',
          text: 'Agenda não disponível para este profissional.',
        });
      }
    }
  }, [agenda, modalIsOpen]);

  useEffect(() => {
    if (profissionalSelecionado) {
      atualizarDiasEHorarios();
    }
  }, [agenda, profissionalSelecionado, atualizarDiasEHorarios]);

  // Função de limpeza ao desmontar o componente
  useEffect(() => {
    return () => {
      setIsOpen(false);
      setDiasDisponiveis([]);
      setHorariosDisponiveis([]);
      setMessage(null); // Reseta a mensagem ao desmontar o componente
      setProfissionalSelecionado(null);
      setAgenda([]);
    };
  }, [setAgenda]);

  return (
    <SectionMain>
      <Section headingH2={'Selecione o especialista'}>
        <Equipe onClickEnabled={true} onClick={selecionarProfissional} />
      </Section>

      {loading ? (
        <Loading />
      ) : (
        !modalIsOpen &&
        message && (
          <Message
            type={message.type === 'error' ? 'alert-warning' : 'alert-success'}
            text={message.text}
          />
        )
      )}

      <Modal
        isOpen={modalIsOpen}
        onClose={fecharModal}
        contentLabel="Modal de Agendamento"
      >
        <FormAgendamento
          diasDisponiveis={diasDisponiveis}
          horarios={horariosDisponiveis}
          fecharModal={fecharModal}
        />
      </Modal>
    </SectionMain>
  );
}

export default Agendamento;
