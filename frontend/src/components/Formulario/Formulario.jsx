import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Message from '../Message/Message';
import Loading from '../Loading/Loading';

import Select from '../Select/Select';

const funcoes = [
  { value: 'admin', label: 'Administrador' },
  { value: 'funcionario', label: 'Especialista' },
];

const Formulario = ({
  campos,
  handleSubmit,
  btnForm,
  agendamentoId,
  idFuncionario,
  loading,
  initialData = {},
  className,
  newFuncionario,
  message,
  setMessage,
}) => {
  const [formData, setFormData] = useState(() =>
    campos.reduce((acc, campo) => {
      acc[campo.id] = campo.value || '';
      return acc;
    }, {}),
  );

  useEffect(() => {
    if (agendamentoId || idFuncionario) {
      setFormData((prevData) => {
        const updated = {
          ...prevData,
          funcionario: idFuncionario,
          id_agendamento: agendamentoId,
        };
        return JSON.stringify(updated) !== JSON.stringify(prevData)
          ? updated
          : prevData;
      });
    }
  }, [agendamentoId, idFuncionario]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prevData) => {
        const merged = { ...prevData, ...initialData };
        return JSON.stringify(merged) !== JSON.stringify(prevData)
          ? merged
          : prevData;
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const camposVazios = campos.filter((campo) => !formData[campo.id]);
    if (camposVazios.length > 0) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' });
      return false;
    }
    return true;
  };

  const handleInputChange = (id, value) => {
    if (id === 'cpf' || id === 'telefone') {
      value = value.replace(/\D/g, '');
    }
    setFormData((prevData) => {
      if (prevData[id] === value) return prevData; // evita re-render
      return { ...prevData, [id]: value };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(formData);
    }
  };

  return (
    <form onSubmit={onSubmit} className={className?.form}>
      {message && <Message type={message.type} text={message.text} />}

      <div className={className?.inputContainer}>
        {campos.map((campo) => (
          <Input
            key={campo.id}
            id={campo.id}
            type={campo.type}
            placeholder={campo.placeholder}
            value={formData[campo.id] || ''}
            handleInputChange={handleInputChange}
            label={campo.label}
            minLength={campo.minLength}
            maxLength={campo.maxLength}
          />
        ))}

        {newFuncionario && (
          <Select
            label="Função"
            id="role"
            options={funcoes}
            onChange={(e) => handleInputChange('role', e.target.value)}
          />
        )}
      </div>

      {btnForm &&
        (loading ? (
          <Loading />
        ) : (
          <button
            type="submit"
            className={`btn btn-primary button ${className?.button}`}
          >
            {btnForm}
          </button>
        ))}
    </form>
  );
};

export default Formulario;
