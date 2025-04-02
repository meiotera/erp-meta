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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState('');
  const [modalContent, setModalContent] = useState(null);

  console.log(agenda);

  // const abrirModal = useCallback((id) => {
  //   setAgendamentoId(id);
  //   setModalContent('form');
  //   setIsOpen(true);
  // }, []);

  const fecharModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // const handleSubmit = async (formData) => {
  //   const response = await cadastrarCliente(formData);

  //   if (response.status === 200) {
  //     fecharModal();
  //     await carregarAgenda(); // Recarrega a agenda após o cadastro do cliente
  //     setAgendamentoId(formatarAgendamentos());
  //   }

  //   return response;
  // };

  return (
    <Section headingH2={`Olá ${funcionario.funcionario.nome}`}>
      <div className="container-table">
        {agendamentos.length < 1 ? (
          <p>Sem atendimentos agendados</p>
        ) : (
          <Tabela colunas={colunas} dados={agendamentos} />
        )}
      </div>
      {/* {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={fecharModal}>
          {modalContent === 'form' ? (
            <Formulario
              campos={campos}
              btnForm={'Cadastrar'}
              agendamentoId={agendamentoId}
              handleSubmit={handleSubmit}
              idFuncionario={funcionario.id}
            />
          ) : null}
        </Modal>
      )} */}
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
