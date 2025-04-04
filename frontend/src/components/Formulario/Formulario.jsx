import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Message from '../Message/Message';
import Loading from '../Loading/Loading';

const Formulario = ({
  campos,
  handleSubmit,
  btnForm,
  agendamentoId,
  idFuncionario,
  loading,
  setMessage,
  message,
  initialData, // Nova prop para dados iniciais
}) => {
  const [formData, setFormData] = useState(() =>
    campos.reduce((acc, campo) => {
      acc[campo.id] = campo.value || '';
      return acc;
    }, {}),
  );

  // Atualiza os campos do funcionário e id_agendamento
  useEffect(() => {
    if (agendamentoId) {
      setFormData((prevData) => ({
        ...prevData,
        funcionario: idFuncionario,
        id_agendamento: agendamentoId,
      }));
    }
  }, [agendamentoId, idFuncionario]);

  // Preenche o formulário com os dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
      }));
    }
  }, [initialData]);

  const validateForm = () => {
    const camposVazios = campos.filter((campo) => !formData[campo.id]);
    if (camposVazios.length > 0) {
      setMessage({ type: 'alert-danger', text: 'Verifique todos os campos.' });
      return false;
    }
    return true;
  };

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(formData);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {message && <Message type={message.type} text={message.text} />}

      {campos.map((campo) => (
        <Input
          key={campo.id}
          id={campo.id}
          type={campo.type}
          placeholder={campo.placeholder}
          value={formData[campo.id] || ''}
          handleInputChange={handleInputChange}
          label={campo.label}
        />
      ))}

      {btnForm &&
        (loading ? (
          <Loading />
        ) : (
          <button type="submit" className="btn btn-primary button">
            {btnForm}
          </button>
        ))}
    </form>
  );
};

export default Formulario;
