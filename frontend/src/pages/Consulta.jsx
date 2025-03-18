import React, { useState } from 'react';
import SectionMain from '../components/SectionMain/SectionMain';
import FormConsulta from '../components/FormConsulta/FormConsulta';
import { salvarConsulta } from '../../api/consultas'; // Importe a função salvarConsulta

const campos = [
  {
    id: 'objetivo',
    type: 'text',
    placeholder: 'Descreva os objetivos da sessão',
    label: 'Objetivo',
    name: 'objetivo',
  },
  {
    id: 'recursos',
    type: 'text',
    placeholder:
      'Descreva os materiais, testes, recursos ou exercícios realizados',
    label: 'Recursos',
    name: 'recursos',
  },
  {
    id: 'observacao',
    type: 'text',
    placeholder: 'Descreva as observações ao paciente',
    label: 'Observação',
    name: 'observacao',
  },
  {
    id: 'encaminhamento',
    type: 'text',
    placeholder: 'Informe os encaminhamentos do paciente',
    label: 'Encaminhamentos',
    name: 'encaminhamento',
  },
  {
    id: 'medicacao',
    type: 'text',
    placeholder: 'Informe a medicação prescrita',
    label: 'Medicação',
    name: 'medicacao',
  },
];

const Consulta = () => {
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = async (formData) => {
    try {
      const response = await salvarConsulta(formData);

      setValidationErrors([]); // Limpa os erros de validação após o sucesso
      return response;
    } catch (error) {
      console.log(error);
      if (error.errors) {
        setValidationErrors(error.errors);
      } else {
        setValidationErrors([error.message]);
      }
    }
  };

  return (
    <SectionMain>
      {validationErrors.length > 0 && (
        <div className="alert alert-danger">
          {validationErrors.map((err, index) => (
            <span className="erroForm" key={index}>
              {err}
            </span>
          ))}
        </div>
      )}
      <FormConsulta
        campos={campos}
        handleSubmit={handleSubmit}
        btnForm="Salvar"
      />
    </SectionMain>
  );
};

export default Consulta;
