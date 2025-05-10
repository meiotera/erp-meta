import React, { useContext, useEffect, useState } from 'react';

import { LoginContext } from '../Contexts/LoginContext';
import Formulario from '../components/Formulario/Formulario';
import Section from '../components/Section/Section';

const campos = [
  {
    id: 'email',
    type: 'email',
    placeholder: 'Informe seu email',
    label: 'Email',
  },
  {
    id: 'password',
    type: 'password',
    placeholder: 'Informe sua senha',
    label: 'Senha',
  },
];

const Login = () => {
  const { postLogin, loading, setLoading, message, setMessage } =
    useContext(LoginContext);
  const [initialData, setInitialData] = useState(null);

  const [newFuncionario, setNewFuncionario] = useState(false);

  const handleSubmit = async (formData) => {
    const res = await postLogin(formData);

    if (res.status === 'success') {
      setInitialData({ email: '', password: '' });
    }
  };
  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, []);

  return (
    <Section
      headingH2="Entre com suas credenciais"
      className={'d-flex justify-content-center flex-column align-items-center'}
    >
      <div className="w-100" style={{ maxWidth: '350px' }}>
        <Formulario
          campos={campos}
          handleSubmit={handleSubmit}
          btnForm={'Entrar'}
          loading={loading}
          setLoading={setLoading}
          message={message} // Passa a mensagem como prop
          setMessage={setMessage}
          newFuncionario={newFuncionario}
          initialData={initialData}
        />
      </div>
    </Section>
  );
};

export default Login;
