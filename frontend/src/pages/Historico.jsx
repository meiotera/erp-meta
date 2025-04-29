import React, { useContext, useEffect, useState } from 'react';
import { AgendaContext } from '../Contexts/AgendaContext';
import Section from '../components/Section/Section';
import Input from '../components/Input/Input';
import styles from './Historico.module.css';
import Message from '../components/Message/Message';
import Button from '../components/Button/Button';
import Loading from '../components/Loading/Loading';

const Historico = () => {
  const {
    cliente,
    buscarCliente,
    historico,
    buscarHistoricoCliente,
    message,
    setMessage,
    setCliente,
    setHistorico,
    loading,
  } = useContext(AgendaContext);
  const [query, setQuery] = useState('');

  const handleBuscarCliente = () => {
    setMessage(null);
    setHistorico(null);
    if (query.trim()) {
      buscarCliente(query);
    }
  };

  const handleHistorico = (id) => {
    buscarHistoricoCliente(id);
  };

  useEffect(() => {
    return function () {
      setMessage(null);
      setCliente(null);
      setHistorico(null);
    };
  }, []);

  return (
    <Section headingH2={'Buscar Histórico'}>
      <div className={styles.container}>
        {message && <Message type={'alert-danger'} text={message.text} />}
        <div className={styles.inputContainer}>
          <div className={styles.containerBusca}>
            <Input
              label="Digite o Nome ou CPF"
              type="text"
              placeholder="Nome ou CPF"
              value={query}
              handleInputChange={(_, value) => setQuery(value)}
              className={styles.input}
            />
            <Button action={handleBuscarCliente} className={'btn btn-primary'}>
              Buscar
            </Button>
          </div>
        </div>

        {cliente && cliente.length > 0 && (
          <ul className={styles.list}>
            {cliente.map((c) => (
              <li
                key={c.id}
                className={styles.listItem}
                onClick={() => handleHistorico(c.id)}
              >
                Nome: <strong>{c.nome}</strong> CPF: <strong>{c.cpf}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        historico && (
          <div className="container my-4">
            {historico.map((h, i) => (
              <div
                key={`${h.agendamento.data}-${i}`}
                className="card border-primary mb-4 shadow-sm"
              >
                <div className="card-header bg-primary text-white fw-semibold">
                  Atendimento em:{' '}
                  {new Date(h.agendamento.data).toLocaleDateString()}
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <span className="fw-bold">Encaminhamento:</span>{' '}
                    {h.encaminhamento}
                  </p>
                  <p className="mb-2">
                    <span className="fw-bold">Medicação:</span> {h.medicacao}
                  </p>
                  <p className="mb-2">
                    <span className="fw-bold">Objetivo:</span> {h.objetivo}
                  </p>
                  <p className="mb-2">
                    <span className="fw-bold">Observação:</span> {h.observacao}
                  </p>
                  <p className="mb-0">
                    <span className="fw-bold">Recursos:</span> {h.recursos}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </Section>
  );
};

export default Historico;
