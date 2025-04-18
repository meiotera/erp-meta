// /home/renan/erp-meta/frontend/src/components/FormAgendamento/FormAgendamento.jsx
import React, { useState, useContext, useEffect } from 'react';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Message from '../Message/Message'; // Ainda necessário para erros de validação/API
import { validateCPF } from 'validations-br';
import { UsersContext } from '../../Contexts/UsersContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './FormAgendamento.module.css';

function FormAgendamento({ diasDisponiveis, fecharModal }) {
  // Obtém message/setMessage para erros, loading, e postAgendamento
  const { postAgendamento, funcionarioId, message, setMessage, loading } =
    useContext(UsersContext);

  // Estados locais do formulário
  const [selectedDate, setSelectedDate] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    funcionario: funcionarioId,
  });

  console.log(diasDisponiveis);

  // Limpa a mensagem de ERRO do contexto ao desmontar
  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, [setMessage]);

  const validateForm = () => {
    // ... (lógica de validação existente, usando setMessage para erros)
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
    // setMessage(null); // Limpa antes de submeter no handleSubmit
    return true;
  };

  const handleDateChange = (event) => {
    // ... (lógica existente)
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);
    setMessage(null); // Limpa erro ao mudar data

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
    // ... (lógica existente)
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    // Opcional: limpar erro ao digitar
    // if (message) setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null); // Limpa mensagens de erro anteriores

    if (!validateForm()) {
      return; // Erro de validação, mensagem já definida
    }

    // Não precisa mais de try/catch aqui, pois o contexto trata
    const horarioSelecionado = event.target.horarios.value;

    // Chama postAgendamento e verifica o resultado
    const success = await postAgendamento({
      ...formData,
      agendamentos: [
        {
          data: selectedDate,
          hora: horarioSelecionado,
        },
      ],
    });

    // Fecha o modal do formulário APENAS se o agendamento foi bem-sucedido
    if (success) {
      fecharModal();
    }
    // Se !success, o modal permanece aberto e a mensagem de erro (definida no contexto) será exibida
  };

  return (
    // A key pode ser baseada na mensagem de erro agora
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

      {/* Renderiza APENAS mensagens de ERRO (ou validação) */}
      {message && message.type === 'error' && (
        <Message type={message.type} text={message.text} />
      )}

      {/* Restante dos Inputs e Selects ... */}
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
            // const itemDate = parseISO(item.data);
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
      {/* ... Fim dos Inputs e Selects */}

      <div className={styles.buttonContainer}>
        <button type="submit" className="btnSuccess" disabled={loading}>
          {loading ? 'Agendando...' : 'Agendar'}
        </button>
        <button
          type="button"
          onClick={fecharModal}
          className="btnDanger"
          disabled={loading} // Desabilita cancelar durante o loading também
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormAgendamento;
