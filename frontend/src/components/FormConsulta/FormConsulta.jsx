import React, { useState, useEffect, useContext } from 'react';
import Message from '../Message/Message';
import Button from '../Button/Button';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { AgendaContext } from '../../Contexts/AgendaContext';

import styles from './FormConsulta.module.css';

const FormConsulta = ({ campos, handleSubmit, btnForm }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { carregarAgenda } = useContext(AgendaContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState(
    campos.reduce((acc, campo) => {
      acc[campo.id] = '';
      return acc;
    }, {}),
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const agendamento = queryParams.get('agendamento');
  const funcionario = queryParams.get('funcionario');
  const clienteNome = queryParams.get('nome');
  const idCliente = queryParams.get('cliente');

  useEffect(() => {
    if (agendamento) {
      setFormData((prevData) => ({
        ...prevData,
        funcionario: funcionario,
        agendamento: agendamento,
        cliente: idCliente,
      }));
    }
  }, [agendamento, funcionario, idCliente]);

  const validateForm = () => {
    const camposVazios = campos.filter((campo) => {
      const value = formData[campo.id];
      return !value || value.trim() === '';
    });

    if (
      camposVazios.length > 0 ||
      !formData.valor ||
      formData.valor.trim() === ''
    ) {
      setMessage({
        type: 'error',
        text: 'Preencha todos os campos, incluindo o valor da consulta',
      });
      return false;
    }

    setMessage(null);
    return true;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleValorChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      valor: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      await handleSubmit(formData);
      navigate('/agenda');
      carregarAgenda(); // Recarrega a agenda após o envio do formulário
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (isSubmitting) {
      navigate('/agenda');
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmLeave = () => {
    setIsConfirmModalOpen(false);
    navigate('/agenda');
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      {message && <Message type="alert-danger" text={message.text} />}
      <div className={styles.headerForm}>
        <span>Atendendo {clienteNome}</span>
        <Button className={'btn-secondary'} action={handleBackClick}>
          Voltar para Agenda
        </Button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="hidden"
          onChange={handleInputChange}
          name="agendamento"
          id="funcionario"
        />
        <input
          type="hidden"
          onChange={handleInputChange}
          name="funcionario"
          id="agendamento"
        />
        <input
          type="hidden"
          onChange={handleInputChange}
          name="cliente"
          id="cliente"
        />
        {campos.map((campo) => (
          <div key={campo.id} className="form-group">
            <label className={`${styles.label}`} htmlFor={campo.id}>
              {campo.label}
            </label>
            <textarea
              id={campo.id}
              type={campo.type}
              placeholder={campo.placeholder}
              value={formData[campo.id] || ''}
              onChange={handleInputChange}
              className={`form-control ${styles.textareaPaper} `}
            />
          </div>
        ))}
        <label htmlFor="valor" className="mt-4">
          Valor da consulta
        </label>
        <input
          type="text"
          id="valor"
          name="valor"
          className="form-control mb-4 mt-4"
          placeholder="Informe o valor da consulta"
          value={formData.valor || ''}
          onChange={handleValorChange}
        />
        <button type="submit" className="btn btn-primary">
          {btnForm}
        </button>
      </form>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLeave}
        message="Você tem alterações não salvas. Deseja sair sem salvar?"
      />
    </>
  );
};

export default FormConsulta;
