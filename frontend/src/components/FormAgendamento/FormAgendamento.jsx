import React, { useState, useContext } from 'react';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Message from '../Message/Message';
import { validateCPF } from 'validations-br';
import { UsersContext } from '../../Contexts/UsersContext';

function FormAgendamento({ diasDisponiveis, horarios, fecharModal }) {
  const { postAgendamento, funcionarioId } = useContext(UsersContext);

  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    funcionario: funcionarioId,
  });

  const validateForm = () => {
    if (
      formData.nome === '' ||
      formData.email === '' ||
      formData.cpf === '' ||
      formData.telefone === ''
    ) {
      setMessage({
        type: 'alert-danger text-center',
        text: 'Preencha todos os campos',
      });
      return false;
    }

    if (!validateCPF(formData.cpf)) {
      setMessage({ type: 'alert-danger text-center', text: 'CPF inválido' });
      return false;
    }

    return true;
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleInputChange = (id, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await postAgendamento({
        ...formData,
        agendamentos: [
          {
            data: selectedDate,
            hora: event.target.horarios.value,
          },
        ],
      });
      setMessage({
        type: 'alert alert-primary',
        text: 'Atendimento agendado com sucesso!',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar o formulário' });
    }
  };

  const availableHorarios =
    selectedDate !== ''
      ? horarios[
          diasDisponiveis.findIndex((item) => item.data === selectedDate)
        ] || []
      : [];

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="hidden"
        name="funcionario_id"
        id="funcionario_id"
        value={funcionarioId}
      />
      {message && <Message type={message.type} text={message.text} />}
      <Input
        type="text"
        label="Nome"
        id="nome"
        placeholder="Informe seu nome"
        value={formData.nome}
        handleInputChange={handleInputChange}
      />
      <Input
        type="email"
        label="Email"
        id="email"
        placeholder="Informe seu email"
        value={formData.email}
        handleInputChange={handleInputChange}
      />
      <Input
        type="text"
        label="CPF"
        id="cpf"
        placeholder="CPF Somente números"
        value={formData.cpf}
        handleInputChange={handleInputChange}
      />
      <Input
        type="tel"
        label="Telefone"
        id="telefone"
        placeholder="Informe seu telefone"
        value={formData.telefone}
        handleInputChange={handleInputChange}
      />

      <Select
        label="Selecione uma data"
        id="data"
        options={diasDisponiveis.map((item) => ({
          value: item.data,
          label: new Date(item.data).toLocaleDateString(),
        }))}
        onChange={handleDateChange}
      />
      <Select
        label="Horários disponíveis"
        id="horarios"
        options={availableHorarios.map((h) => ({
          value: h.horario,
          label: h.horario,
        }))}
      />
      <button type="submit" className="btn btn-success">
        Agendar
      </button>
      <button onClick={fecharModal} className="btn btn-danger">
        Cancelar
      </button>
    </form>
  );
}

export default FormAgendamento;
