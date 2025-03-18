import { useState, useEffect } from 'react';
import authToken from '../utils/authToken';

const useAgendamento = (id) => {
  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAgendamento = async () => {
      setLoading(true);
      try {
        const token = authToken();
        const response = await fetch(
          `http://localhost:3000/agenda/agendamento/${id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar agendamento');
        }

        const data = await response.json();
        setAgendamento(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamento();
  }, [id]);

  return { agendamento, loading, error };
};

export default useAgendamento;
