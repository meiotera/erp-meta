import React, { useState, useEffect, useContext } from 'react';
import { AgendaContext } from '../../Contexts/AgendaContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const FormCadastroCliente = ({ fecharModal, agendamento }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    responsavel: '',
    cpf: '',
    dataNascimento: '',
  });
  const { cadastrarClientePost, setMessage, loading } =
    useContext(AgendaContext);

  useEffect(() => {
    if (agendamento) {
      setFormData({
        nome: agendamento.nome || '',
        telefone: agendamento.telefone || '',
        email: agendamento.email || '',
        responsavel: '',
        cpf: agendamento.cpf || '',
        dataNascimento: '',
      });
    }
  }, [agendamento]);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    if (!formData.nome || !formData.telefone) {
      setMessage({ type: 'error', text: 'Nome e Telefone são obrigatórios.' });
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataComAgendamento = {
          ...formData,
          id_agendamento: agendamento?.id, // Inclua o ID do agendamento
        };

        await cadastrarClientePost(formDataComAgendamento);
        fecharModal(); // Fecha o modal após o cadastro
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="nome"
        type="text"
        placeholder="Nome"
        value={formData.nome}
        handleInputChange={handleInputChange}
        label="Nome:"
        required
      />
      <Input
        id="telefone"
        type="text"
        placeholder="Telefone"
        value={formData.telefone}
        handleInputChange={handleInputChange}
        label="Telefone:"
        required
      />
      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        handleInputChange={handleInputChange}
        label="Email:"
      />
      <Input
        id="dataNascimento"
        type="date"
        placeholder="Data de Nascimento"
        value={formData.dataNascimento}
        handleInputChange={handleInputChange}
        label="Data de Nascimento:"
      />
      <Input
        id="cpf"
        type="text"
        placeholder="CPF"
        value={formData.cpf}
        handleInputChange={handleInputChange}
        label="CPF:"
      />
      <Input
        id="responsavel"
        type="text"
        placeholder="Responsável"
        value={formData.responsavel}
        handleInputChange={handleInputChange}
        label="Responsável:"
      />
      <div className="buttonContainer">
        <button type="submit" className="btnSuccess" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button onClick={fecharModal} className="btnDanger">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormCadastroCliente;
