import React, { useState, useCallback, useContext } from 'react';
import Tabela from '../components/Tabela/Tabela';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import Formulario from '../components/Formulario/Formulario';
import Loading from '../components/Loading/Loading';
import Section from '../components/Section/Section';
import { AgendaContext } from '../Contexts/AgendaContext';

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

const Agendamentos = ({ funcionario, agendamentos, loading, carregarMais }) => {
  const { agenda } = useContext(AgendaContext);

  const fecharModal = useCallback(() => {
    setIsOpen(false);
  }, []);

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
      {!loading && agendamentos.length < agenda.agendamentos.length && (
        <Button className={'btn-primary'} action={carregarMais}>
          Carregar mais
        </Button>
      )}
    </Section>
  );
};

export default Agendamentos;
