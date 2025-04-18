import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Section from '../components/Section/Section';

import FormAgendamento from '../components/FormAgendamento/FormAgendamento';
import Equipe from '../components/Equipe/Equipe';
import Loading from '../components/Loading/Loading';
import Message from '../components/Message/Message';
import Modal from '../components/Modal/Modal';
import { UsersContext } from '../Contexts/UsersContext';
import useMetaTags from '../Hooks/useMetaTags';

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

  useMetaTags({
    title: 'Agendamento | Meta Saúde Integrada',
    description:
      'Agende sua consulta na Clínica Meta Saúde Integrada de forma rápida e segura. Escolha o profissional, a especialidade e o melhor horário para você. Oferecemos atendimentos em Fisioterapia, Psicopedagogia, Psicanálise e Terapias integradas, com foco no cuidado humanizado e na sua qualidade de vida.',
    keywords:
      'agendamento online, clínica de fisioterapia, psicopedagogia, psicanálise, terapia, Mossoró, saúde integrada',
    robots: 'index, follow',
  });

  // Função que abre o modal
  const abrirModal = () => {
    setIsOpen(true);
    setLoading(false);
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
    fecharModal();
    setProfissionalSelecionado(id);
    setMessage(null);
    setDiasDisponiveis([]);
    setHorariosDisponiveis([]);
    fetchAgenda(id);
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

      abrirModal();
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
      setMessage(null);
      setProfissionalSelecionado(null);
      setAgenda([]);
    };
  }, [setAgenda]);

  return (
    <>
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
      <Section headingH2={'Selecione o especialista'}>
        <Equipe onClickEnabled={true} onClick={selecionarProfissional} />
      </Section>

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
    </>
  );
}

export default Agendamento;
