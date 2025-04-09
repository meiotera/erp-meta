import React, { useContext, useEffect, useState } from 'react';
import Section from '../Section/Section';
import Input from '../Input/Input';
import { LoginContext } from '../../Contexts/LoginContext';
import { UsersContext } from '../../Contexts/UsersContext';
import Message from '../Message/Message';
import Formulario from '../Formulario/Formulario';
import { validateCPF } from 'validations-br';
import Select from '../Select/Select';

import styles from './Usuario.module.css';

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
    id: 'cpf',
    type: 'text',
    placeholder: 'CPF (apenas números)',
    label: 'Informe o CPF',
    name: 'cpf',
  },
  {
    id: 'profissao',
    type: 'text',
    placeholder: 'Profissão',
    label: 'Profissão',
    name: 'profissao',
  },
  {
    id: 'password',
    type: 'password',
    placeholder: 'Informe uma senha',
    label: 'Senha',
    name: 'password',
  },
  {
    id: 'confirm_password',
    type: 'password',
    placeholder: 'Confirme uma senha',
    label: 'Confirmar senha',
    name: 'confirm_password',
  },
  {
    id: 'descricao',
    type: 'text',
    placeholder: 'Descreva seu atendimento',
    label: 'Descrição',
    name: 'descricao',
  },
];

const Usuarios = () => {
  const { funcionario } = useContext(LoginContext);
  const { cadastraFuncionario } = useContext(UsersContext);
  const [newFuncionario, setNewFuncionario] = useState(true);

  useEffect(() => {
    setNewFuncionario(true);
    return () => {
      setNewFuncionario(false);
    };
  }, []);

  const handleSubmit = async (formData) => {
    console.log('Dados enviados:', formData);
    await cadastraFuncionario(formData);
  };

  return (
    <>
      <Formulario
        handleSubmit={handleSubmit}
        campos={campos}
        btnForm={'Cadastrar'}
        className={{
          form: styles.form,
          inputContainer: styles.inputContainer,
          input: styles.input,
          button: styles.button,
        }}
        newFuncionario={newFuncionario}
        setNewFuncionario={setNewFuncionario}
      />
    </>
  );
};

export default Usuarios;
