// /home/renan/erp-meta/frontend/src/pages/Agendamentos.jsx
import React, { useCallback, useContext } from 'react';
import Tabela from '../components/Tabela/Tabela';
import Button from '../components/Button/Button';

import Loading from '../components/Loading/Loading';
import Section from '../components/Section/Section';
import { AgendaContext } from '../Contexts/AgendaContext';

const colunas = [
  { header: 'Nome', field: 'cliente' },
  { header: 'Data', field: 'data' },
  { header: 'Hora', field: 'hora' },
  { header: 'Telefone', field: 'telefone' },
  { header: 'Ações', field: 'acoes' },
];

const Agendamentos = ({ funcionario, agendamentos, loading, carregarMais }) => {
  const { agenda } = useContext(AgendaContext);

  return (
    <Section headingH2={`Minha agenda`}>
      <div className="container-table">
        {agendamentos.length < 1 ? (
          <p>Sem atendimentos agendados</p>
        ) : (
          <Tabela colunas={colunas} dados={agendamentos} />
        )}
      </div>

      {loading && <Loading />}

      {!loading &&
        agenda?.agendamentos &&
        agendamentos.length < agenda.agendamentos.length && (
          <Button className={'btn-primary'} action={carregarMais}>
            Carregar mais
          </Button>
        )}
    </Section>
  );
};

export default Agendamentos;
