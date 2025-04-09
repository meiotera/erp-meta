import React from 'react';
import SectionMain from '../components/SectionMain/SectionMain';
import FormConsulta from '../components/FormConsulta/FormConsulta';
import { salvarConsulta } from '../../api/consultas'; // Importe a função salvarConsulta
import styles from './Consulta.module.css'; // Importa os estilos

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
  const handleSubmit = async (formData) => {
    try {
      const response = await salvarConsulta(formData);

      console.log('res', response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao salvar a consulta');
      }
    } catch (error) {
      throw error; // Repassa o erro para o componente `FormConsulta`
    }
  };

  return (
    <SectionMain>
      <div className={styles.consultaContainer}>
        <FormConsulta
          campos={campos}
          handleSubmit={handleSubmit}
          btnForm="Salvar"
        />
      </div>
    </SectionMain>
  );
};

export default Consulta;
