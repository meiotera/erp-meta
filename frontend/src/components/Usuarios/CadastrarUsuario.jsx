import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { LoginContext } from '../../Contexts/LoginContext';
import { UsersContext } from '../../Contexts/UsersContext';

import Formulario from '../Formulario/Formulario';
import { validateCPF } from 'validations-br';

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
  const { cadastraFuncionario, message, setMessage } = useContext(UsersContext);
  const [newFuncionario, setNewFuncionario] = useState(true);

  useEffect(() => {
    setNewFuncionario(true);

    return () => {
      setMessage(null);
      setNewFuncionario(false);
    };
  }, [setMessage]);

  const handleSubmit = useCallback(
    async (formData) => {
      if (formData.password !== formData.confirm_password) {
        setMessage({ type: 'error', text: 'As senhas não coincidem.' });
        return;
      }
      if (formData.cpf && !validateCPF(formData.cpf)) {
        setMessage({ type: 'error', text: 'CPF inválido.' });
        return;
      }
      await cadastraFuncionario(formData);
    },
    [cadastraFuncionario, setMessage],
  );

  const formClasses = useMemo(
    () => ({
      form: styles.form,
      inputContainer: styles.inputContainer,
      input: styles.input,
      button: styles.button,
    }),
    [],
  );

  return (
    <>
      <Formulario
        handleSubmit={handleSubmit}
        campos={campos}
        btnForm={'Cadastrar'}
        message={message}
        setMessage={setMessage}
        className={formClasses}
        newFuncionario={newFuncionario}
      />
    </>
  );
};

export default Usuarios;
