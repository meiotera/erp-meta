import React, { useContext, useEffect, useState } from 'react';

import { LoginContext } from '../../Contexts/LoginContext';
import { UsersContext } from '../../Contexts/UsersContext';
import Formulario from '../Formulario/Formulario';
import PasswordUpdateForm from '../PasswordUpdateForm/PasswordUpdateForm';
import Loading from '../Loading/Loading';
import styles from './Perfil.module.css';

const camposPerfil = [
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
    placeholder: 'Telefone (somente números)', // Adicionar dica
    label: 'Telefone',
    name: 'telefone',
    // Opcional: Adicionar atributos HTML5 para validação básica no navegador
    minLength: 11,
    maxLength: 11, // Ou um máximo maior se permitir DDD + 9 dígitos + etc.
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
    placeholder: 'Valor da consulta (opcional)',
    label: 'Valor da consulta',
    name: 'valor_consulta',
  },
  {
    id: 'foto',
    type: 'text',
    placeholder: 'https://exemplo.com/imagem.jpg',
    label: 'URL da Imagem de Perfil',
    name: 'foto',
  },
  { id: '_id', type: 'hidden', placeholder: '', label: '', name: '_id' },
];

const Perfil = () => {
  const { funcionario: loggedInUser } = useContext(LoginContext);
  const {
    buscarDadosFuncionario,
    loading: loadingProfileData,
    funcionarioEncontrado,
    updateDadosFuncionario,
    message: profileMessage,
    setMessage: setProfileMessage,

    updateSenhaFuncionario,
    passwordLoading,
    passwordMessage,
    setPasswordMessage,
  } = useContext(UsersContext);

  const [formData, setFormData] = useState(null);
  const funcionarioId = loggedInUser?.id || loggedInUser?.funcionario?.id;

  useEffect(() => {
    async function handleDadosFuncionario() {
      if (funcionarioId) {
        if (setProfileMessage) setProfileMessage(null);
        if (setPasswordMessage) setPasswordMessage(null);
        await buscarDadosFuncionario(funcionarioId);
      }
    }
    if (funcionarioId && !formData) {
      handleDadosFuncionario();
    }
  }, [funcionarioId, buscarDadosFuncionario]);

  useEffect(() => {
    const especialistaData = funcionarioEncontrado?.data?.especialista;
    if (
      especialistaData &&
      JSON.stringify(especialistaData) !== JSON.stringify(formData)
    ) {
      setFormData(especialistaData);
    }
  }, [funcionarioEncontrado, formData]);

  const handleProfileSubmit = async (data) => {
    await updateDadosFuncionario(data);
  };

  const handlePasswordSubmit = async (passwordData) => {
    if (!funcionarioId) {
      setPasswordMessage({
        type: 'error',
        text: 'ID do usuário não encontrado.',
      });
      return false;
    }

    const success = await updateSenhaFuncionario(funcionarioId, passwordData);
    return success;
  };

  useEffect(() => {
    return () => {
      if (setProfileMessage) setProfileMessage(null);
      if (setPasswordMessage) setPasswordMessage(null);
    };
  }, []);

  if (loadingProfileData && !formData) return <Loading />;

  const fotoUrl = formData?.foto || '';

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.profileSection}>
        <div className={styles.previewContainer}>
          <h2>Seu Perfil</h2>
          <p>Pré-visualização:</p>

          {fotoUrl ? (
            <img
              key={fotoUrl}
              src={fotoUrl}
              alt="Pré-visualização do Perfil"
              className={styles.previewImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <p className={styles.noPreviewText}>Nenhuma imagem definida.</p>
          )}
        </div>

        {formData && (
          <Formulario
            key={`profile-form-${formData._id}`}
            handleSubmit={handleProfileSubmit}
            message={profileMessage}
            setMessage={setProfileMessage}
            campos={camposPerfil}
            initialData={formData}
            btnForm={'Atualizar Perfil'}
            isLoading={loadingProfileData}
            className={{
              form: styles.form,
              inputContainer: styles.inputContainer,
              input: styles.input,
              button: styles.button,
            }}
          />
        )}
      </div>

      <div className={styles.passwordSection}>
        <h2>Alterar Senha</h2>

        {funcionarioId && (
          <PasswordUpdateForm
            onSubmit={handlePasswordSubmit}
            isLoading={passwordLoading}
            message={passwordMessage}
            setMessage={setPasswordMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Perfil;
