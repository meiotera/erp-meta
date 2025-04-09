import React, { useState, useEffect, useContext } from 'react';
import Input from '../Input/Input';
import Message from '../Message/Message';
import Loading from '../Loading/Loading';
import { UsersContext } from '../../Contexts/UsersContext';
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
  initialData, // Nova prop para dados iniciais
  className,
  newFuncionario,
}) => {
  const { setMessage, message } = useContext(UsersContext);

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
      setMessage({ type: 'error', text: 'Verifique todos os campos.' });
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

  // resetar todos os campos
  useEffect(() => {
    return () => {
      setFormData((prevData) =>
        campos.reduce((acc, campo) => {
          acc[campo.id] = '';
          return acc;
        }, prevData),
      );
    };
  }, []);

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
          />
        ))}

        {/* Adiciona o Select se newFuncionario for true */}
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
