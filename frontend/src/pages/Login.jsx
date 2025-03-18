import React, { useContext } from 'react';
import SectionMain from '../components/SectionMain/SectionMain';
import Formulario from '../components/Formulario/Formulario';
import Section from '../components/Section/Section';
import Message from '../components/Message/Message';
import { LoginContext } from '../Contexts/LoginContext';

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
    placeholder: 'Informa sua senha',
    label: 'Senha',
  },
];

const Login = () => {
  const { postLogin, message } = useContext(LoginContext);

  const handleSubmit = async (formData) => {
    const response = await postLogin(formData);
    return response;
  };

  return (
    <SectionMain>
      <Section headingH2="Entre com suas credenciais">
        {message && <Message type={message.type} text={message.text} />}
        <Formulario
          campos={campos}
          handleSubmit={handleSubmit}
          btnForm={'Entrar'}
        />
      </Section>
    </SectionMain>
  );
};

export default Login;
