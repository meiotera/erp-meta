import React, { useState, useContext, useCallback } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { AgendaContext } from '../../Contexts/AgendaContext';
import { LoginContext } from '../../Contexts/LoginContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function FormNovoAgendamento({ fecharModal, dataSelecionada }) {
  const [inputs, setInputs] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState({});
  const { criarNovaAgenda } = useContext(AgendaContext);

  // Adiciona um novo campo de horário
  const adicionarHorario = useCallback(() => {
    const novoId = `horario-${inputs.length}`;
    setInputs((prevInputs) => [
      ...prevInputs,
      { id: novoId, type: 'time', label: 'Horário', placeholder: 'Horário' },
    ]);
  }, [inputs.length]);

  // Salva os horários diretamente na agenda
  const salvarHorarios = useCallback(async () => {
    const valores = Object.values(horariosSelecionados).filter(
      (h) => h.trim() !== '',
    );

    if (!dataSelecionada || valores.length === 0) {
      alert('Selecione ao menos um horário!');
      return;
    }

    // Formata os horários para o formato esperado pela API
    const horariosFormatados = valores.map((horario) => ({
      horario: horario,
      disponivel: true,
    }));

    const registros = {
      agenda: [
        {
          data: dataSelecionada,
          horariosDisponiveis: horariosFormatados,
        },
      ],
    };

    try {
      await criarNovaAgenda(registros); // Faz o POST diretamente
      alert('Horários incluídos na agenda com sucesso!');
      setInputs([]); // Limpa os campos de horário
      setHorariosSelecionados({});
      fecharModal(); // Fecha o modal
    } catch (error) {
      alert('Erro ao incluir horários na agenda. Tente novamente.');
    }
  }, [dataSelecionada, horariosSelecionados, criarNovaAgenda, fecharModal]);

  return (
    <div>
      <h2>
        Data Selecionada:{' '}
        {format(parseISO(dataSelecionada), 'dd/MM/yyyy', {
          locale: ptBR,
        })}
      </h2>
      <div id="additional-inputs" className="d-flex flex-column">
        {inputs.map((input) => (
          <Input
            key={input.id}
            id={input.id}
            type={input.type}
            label={input.label}
            placeholder={input.placeholder}
            value={horariosSelecionados[input.id] || ''}
            handleInputChange={(inputId, value) => {
              const newHorarios = {
                ...horariosSelecionados,
                [inputId]: value,
              };
              setHorariosSelecionados(newHorarios);
            }}
          />
        ))}
      </div>
      <button className="btn btn-primary m-4" onClick={adicionarHorario}>
        Adicionar Horário
      </button>
      <Button className="btn-primary m-4" action={salvarHorarios}>
        Incluir na agenda
      </Button>
    </div>
  );
}

export default FormNovoAgendamento;
