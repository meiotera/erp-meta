import React, { useContext, useEffect } from 'react';
import Formulario from '../Formulario/Formulario';
import Loading from '../Loading/Loading';

import styles from './Perfil.module.css';

import { LoginContext } from '../../Contexts/LoginContext';
import { UsersContext } from '../../Contexts/UsersContext';
import Message from '../Message/Message';

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
  {
    id: 'email',
    type: 'email',
    placeholder: 'E-mail',
    label: 'E-mail',
    name: 'email',
  },
  {
    id: 'profissao',
    type: 'text',
    placeholder: 'Profissão',
    label: 'Profissão',
    name: 'profissao',
  },
  {
    id: 'instagram',
    type: 'text',
    placeholder: 'Instagram',
    label: 'Instagram',
    name: 'instagram',
  },
  {
    id: 'descricao',
    type: 'text',
    placeholder: 'Descreva seu atendimento',
    label: 'Descrição',
    name: 'descricao',
  },
  {
    id: 'valor_consulta',
    type: 'text',
    placeholder: 'Valor da consulta',
    label: 'Valor da consulta',
  },
  {
    id: '_id',
    type: 'hidden',
    placeholder: '',
    label: '',
  },
];

const Perfil = () => {
  const { funcionario } = useContext(LoginContext);
  const {
    buscarDadosFuncionario,
    loading,
    funcionarioEncontrado,
    updateDadosFuncionario,
    message,
    setMessage,
  } = useContext(UsersContext);

  const funcionarioId = funcionario?.id || funcionario?.funcionario?.id;

  useEffect(() => {
    async function handleDadosFuncionario() {
      await buscarDadosFuncionario(funcionarioId);
    }
    handleDadosFuncionario();
  }, []);

  const handleSubmit = async (data) => {
    await updateDadosFuncionario(data);
  };

  // desmontar o componente quando sair da página
  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      {!loading && funcionarioEncontrado && (
        <Formulario
          handleSubmit={handleSubmit}
          campos={campos}
          initialData={funcionarioEncontrado.data.especialista}
          btnForm={'Atualizar'}
          className={{
            form: styles.form,
            inputContainer: styles.inputContainer,
            input: styles.input,
            button: styles.button,
          }}
        />
      )}
    </>
  );
};

export default Perfil;
