import React, { useState, useContext, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import Section from '../components/Section/Section';
import FormNovoAgendamento from '../components/FormNovoAgendamento/FormNovoAgendamento';

import { AgendaContext } from '../Contexts/AgendaContext';

import { parseISO } from 'date-fns';
import { startOfToday, isBefore, isSameDay } from 'date-fns';
import Modal from '../components/Modal/Modal';

import styles from './GerenciarAgenda.module.css';

const GerenciarAgenda = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState('');

  const { agenda } = useContext(AgendaContext);
  const { agenda: agendaCadastrada } = agenda;

  const handleDateClick = useCallback((info) => {
    const clickedDate = parseISO(info.dateStr);
    const today = startOfToday();

    if (isBefore(clickedDate, today) && !isSameDay(clickedDate, today)) {
      return;
    }

    setDataSelecionada(info.dateStr);
    setIsOpen(true);
  }, []);

  const dayCellClassNames = useCallback((date) => {
    if (isBefore(date.date, startOfToday())) {
      return ['dia-passado'];
    }
    return ['click-day'];
  }, []);

  const agendaList = useMemo(() => {
    return agendaCadastrada && agendaCadastrada.length > 0 ? (
      agendaCadastrada.map((registro, index) => (
        <div
          className={`card text-bg-success m-1 ${styles.cardDia}`}
          key={index}
        >
          <div className="card-header">
            <p>
              <strong>Data:</strong> {registro.data}
            </p>
          </div>
          <div className="card-body">
            <h5 className="card-title">Horários</h5>
            <p className="card-text"></p>
            {registro.horariosDisponiveis.map((horario, index) => (
              <span key={index}>{horario.hora} </span>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p>Nenhuma agenda encontrada.</p>
    );
  }, [agendaCadastrada]);

  return (
    <Section headingH2={'Gerenciar Agenda'}>
      <div className="containerAgendaGeral">
        <div className={styles.containerAgenda}>
          <div className={styles.calendario}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              locales={[ptBrLocale]}
              locale="pt-br"
              dayCellClassNames={dayCellClassNames}
              dateClick={handleDateClick}
            />
          </div>

          <div className={styles.minhaAgenda}>
            <h5 className="text-primary text-opacity-75">
              Dias/Horários disponíveis
            </h5>
            <div className={styles.diasSelecionados}>{agendaList}</div>
            <Modal isOpen={modalIsOpen} onClose={() => setIsOpen(false)}>
              <FormNovoAgendamento
                fecharModal={() => setIsOpen(false)}
                dataSelecionada={dataSelecionada}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default GerenciarAgenda;
