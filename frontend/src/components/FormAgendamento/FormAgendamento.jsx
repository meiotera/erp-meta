import React, { useState, useContext, useEffect } from 'react';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Message from '../Message/Message';
import { validateCPF } from 'validations-br';
import { UsersContext } from '../../Contexts/UsersContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './FormAgendamento.module.css';

function FormAgendamento({ diasDisponiveis, fecharModal }) {
  const { postAgendamento, funcionarioId, message, setMessage, loading } =
    useContext(UsersContext);

  const [selectedDate, setSelectedDate] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    funcionario: funcionarioId,
  });

  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, [setMessage]);

  const validateForm = () => {
    if (
      formData.nome === '' ||
      formData.email === '' ||
      formData.cpf === '' ||
      formData.telefone === '' ||
      selectedDate === '' ||
      !document.getElementById('horarios')?.value
    ) {
      setMessage({
        type: 'error',
        text: 'Preencha todos os campos obrigatórios.',
      });
      return false;
    }
    if (!validateCPF(formData.cpf)) {
      setMessage({ type: 'error', text: 'CPF inválido' });
      return false;
    }

    return true;
  };

  const handleDateChange = (event) => {
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);
    setMessage(null);

    const selectedDay = diasDisponiveis.find(
      (dia) => dia.data === selectedDateValue,
    );
    setHorariosDisponiveis(selectedDay ? selectedDay.horariosDisponiveis : []);

    const horarioSelect = document.getElementById('horarios');
    if (horarioSelect) {
      horarioSelect.value = '';
    }
  };

  const handleInputChange = (id, value) => {
    if (id === 'cpf' || id === 'telefone') {
      value = value.replace(/\D/g, '');
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    const horarioSelecionado = event.target.horarios.value;

    const success = await postAgendamento({
      ...formData,
      agendamentos: [
        {
          data: selectedDate,
          hora: horarioSelecionado,
        },
      ],
    });

    if (success) {
      fecharModal();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      key={message ? message.text : 'no-message-form'}
    >
      <Input
        type="hidden"
        name="funcionario_id"
        id="funcionario_id"
        value={funcionarioId}
      />

      {message && message.type === 'error' && (
        <Message type={message.type} text={message.text} />
      )}

      <Input
        type="text"
        label="Nome"
        id="nome"
        placeholder="Informe seu nome"
        value={formData.nome}
        handleInputChange={handleInputChange}
        required
      />
      <Input
        type="email"
        label="Email"
        id="email"
        placeholder="Informe seu email"
        value={formData.email}
        handleInputChange={handleInputChange}
        required
      />
      <Input
        type="text"
        label="CPF"
        id="cpf"
        placeholder="CPF Somente números"
        value={formData.cpf}
        handleInputChange={handleInputChange}
        required
      />
      <Input
        type="tel"
        label="Telefone"
        id="telefone"
        placeholder="Informe seu telefone"
        value={formData.telefone}
        handleInputChange={handleInputChange}
        required
      />

      <Select
        label="Selecione uma data"
        id="data"
        value={selectedDate}
        options={[
          ...diasDisponiveis.map((item) => {
            const adjustedDate = new Date(
              new Date(item.data).getTime() + 3 * 60 * 60 * 1000,
            );
            const formattedDate = format(adjustedDate, 'dd/MM/yyyy', {
              locale: ptBR,
            });
            return {
              value: item.data,
              label: formattedDate,
            };
          }),
        ]}
        onChange={handleDateChange}
        required
      />
      <Select
        label="Horários disponíveis"
        id="horarios"
        options={[
          ...horariosDisponiveis
            .filter((h) => h.disponivel)
            .map((h) => ({
              value: h.horario,
              label: h.horario,
            })),
        ]}
        disabled={!selectedDate || horariosDisponiveis.length === 0}
        required
      />

      <div className={styles.buttonContainer}>
        <button type="submit" className="btnSuccess" disabled={loading}>
          {loading ? 'Agendando...' : 'Agendar'}
        </button>
        <button
          type="button"
          onClick={fecharModal}
          className="btnDanger"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormAgendamento;
