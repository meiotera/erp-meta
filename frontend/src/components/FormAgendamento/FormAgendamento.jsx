import React, { useState, useContext } from 'react';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Message from '../Message/Message';
import { validateCPF } from 'validations-br';
import { UsersContext } from '../../Contexts/UsersContext';
import { format, parseISO } from 'date-fns';

import { ptBR } from 'date-fns/locale';

import styles from './FormAgendamento.module.css';

function FormAgendamento({ diasDisponiveis, fecharModal }) {
  const { postAgendamento, funcionarioId } = useContext(UsersContext);

  const [selectedDate, setSelectedDate] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
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
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);

    // Encontre os horários disponíveis para a data selecionada
    const selectedDay = diasDisponiveis.find(
      (dia) => dia.data === selectedDateValue,
    );
    setHorariosDisponiveis(selectedDay ? selectedDay.horariosDisponiveis : []);
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
      const selectedDateUTC = parseISO(selectedDate);

      await postAgendamento({
        ...formData,
        agendamentos: [
          {
            data: selectedDateUTC,
            hora: event.target.horarios.value,
          },
        ],
      });

      fecharModal();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar o formulário' });
    }
  };

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
        options={diasDisponiveis.map((item) => {
          const itemDate = new Date(item.data); // Converte a string ISO para um objeto Date
          const localDate = new Date(
            itemDate.getTime() + itemDate.getTimezoneOffset() * 60000,
          ); // Ajusta o fuso horário manualmente
          const formattedDate = format(localDate, 'dd-MM-yyyy', {
            locale: ptBR,
          });
          return {
            value: item.data,
            label: formattedDate,
          };
        })}
        onChange={handleDateChange}
      />
      <Select
        label="Horários disponíveis"
        id="horarios"
        options={horariosDisponiveis.map((h) => ({
          value: h.horario,
          label: h.horario,
        }))}
      />

      <div className="buttonContainer">
        <button type="submit" className="btnSuccess">
          Agendar
        </button>
        <button type="button" onClick={fecharModal} className="btnDanger">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormAgendamento;
