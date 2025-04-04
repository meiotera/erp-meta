import React, { useCallback, useContext, useEffect, useState } from 'react';
import SectionMain from '../components/SectionMain/SectionMain';
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
        <div className={styles.inputContainer}>
          <Input
            label="Digite o Nome ou CPF"
            type="text"
            placeholder="Nome ou CPF"
            value={query}
            handleInputChange={(_, value) => setQuery(value)}
            className={styles.input}
          />
        </div>
        <Button action={handleBuscarCliente} className={'btn btn-primary'}>
          Buscar
        </Button>

        {message && <Message type={'alert-danger'} text={message.text} />}
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
          <div className={styles.historicoContainer}>
            {historico.map((h) => (
              <div
                key={h.agendamento.data}
                className={`${styles.historicoCard} card border-secondary mb-3`}
              >
                <div className="card-header">
                  {new Date(h.agendamento.data).toLocaleDateString()}
                </div>
                <div className="card-body text-secondary">
                  <p className="card-text">
                    <strong>Encaminhamento:</strong> {h.encaminhamento}
                  </p>
                  <p className="card-text">
                    <strong>Medicação:</strong> {h.medicacao}
                  </p>
                  <p className="card-text">
                    <strong>Objetivo:</strong> {h.objetivo}
                  </p>
                  <p className="card-text">
                    <strong>Observação:</strong> {h.observacao}
                  </p>
                  <p className="card-text">
                    <strong>Recursos:</strong> {h.recursos}
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
