import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Message from '../Message/Message';
import useAgendamento from '../../Hooks/useAgendamento';

const Formulario = ({
  campos,
  handleSubmit,
  btnForm,
  agendamentoId,
  idFuncionario,
}) => {
  const { agendamento, loading, error } = useAgendamento(agendamentoId);

  // Inicializa o estado do formulário com os valores vindos dos campos
  const [formData, setFormData] = useState(() =>
    campos.reduce((acc, campo) => {
      acc[campo.id] = campo.value || '';
      return acc;
    }, {}),
  );

  const [message, setMessage] = useState(null);

  // Atualiza os campos quando os dados do agendamento forem carregados
  useEffect(() => {
    if (agendamento) {
      setFormData((prevData) => ({
        ...prevData,
        nome: agendamento.agendamento.nome || '',
        telefone: agendamento.agendamento.telefone || '',
        email: agendamento.agendamento.email || '',
        cpf: agendamento.agendamento.cpf || '',
      }));
    }
  }, [agendamento]);

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

  const validateForm = () => {
    const camposVazios = campos.filter((campo) => !formData[campo.id]);
    if (camposVazios.length > 0) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' });
      return false;
    }
    setMessage(null);
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
      {message && <Message type={'alert-danger'} text={message.text} />}
      {loading && <Message type={'alert-info'} text="Carregando dados..." />}
      {error && <Message type={'alert-danger'} text={error} />}

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

      <button type="submit" className="btn btn-primary">
        {btnForm}
      </button>
    </form>
  );
};

export default Formulario;
