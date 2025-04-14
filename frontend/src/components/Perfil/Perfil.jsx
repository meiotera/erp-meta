import React, { useContext, useEffect, useState } from 'react';
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
  {
    id: '_id',
    type: 'hidden',
    placeholder: '',
    label: '',
    name: '_id',
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

  const [formData, setFormData] = useState(null);
  const funcionarioId = funcionario?.id || funcionario?.funcionario?.id;

  useEffect(() => {
    async function handleDadosFuncionario() {
      if (funcionarioId) {
        await buscarDadosFuncionario(funcionarioId);
      }
    }
    if (!formData) {
      handleDadosFuncionario();
    }
  }, [funcionarioId, formData]);
  useEffect(() => {
    if (funcionarioEncontrado?.data?.especialista && !formData) {
      setFormData(funcionarioEncontrado.data.especialista);
    }
  }, [funcionarioEncontrado, formData]);

  const handleSubmit = async (data) => {
    const dataToSend = { ...formData, ...data };

    setFormData(dataToSend);

    await updateDadosFuncionario(dataToSend);
  };

  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, []);

  if (loading && !formData) return <Loading />;

  const fotoUrl = formData?.foto || '';

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.previewContainer}>
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
          handleSubmit={handleSubmit}
          campos={campos}
          initialData={formData}
          btnForm={'Atualizar Perfil'}
          className={{
            form: styles.form,
            inputContainer: styles.inputContainer,
            input: styles.input,
            button: styles.button,
          }}
        />
      )}
    </div>
  );
};

export default Perfil;
