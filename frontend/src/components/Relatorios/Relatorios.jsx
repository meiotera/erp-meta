import React, { useContext, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { UsersContext } from '../../Contexts/UsersContext';

import styles from './Relatorios.module.css';
import Loading from '../Loading/Loading';

const Relatorios = () => {
  const { fetchFinanceiro } = useContext(UsersContext);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const carregarDados = async () => {
    setLoading(true);

    try {
      const resultado = await fetchFinanceiro(dataInicial, dataFinal);

      const dadosTransformados = resultado.realizado.map((item) => ({
        name: item.nome,
        value: item.valorTotal,
        Atendimentos: item.quantidade,
      }));

      setDados(dadosTransformados);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const cores = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="date"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          placeholder="Data Inicial"
        />
        <input
          type="date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          placeholder="Data Final"
        />
        <button
          onClick={carregarDados}
          disabled={loading || !dataInicial || !dataFinal}
        >
          {loading ? 'Carregando...' : 'Buscar Dados'}
        </button>
      </div>
      {loading && <Loading />}
      {dados.length > 0 ? (
        <>
          <div className={styles.container}>
            <PieChart className={styles.pie} width={400} height={400}>
              <Pie
                data={dados}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {dados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={cores[index % cores.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            <ResponsiveContainer
              className={styles.barrras}
              width="100%"
              height={400}
            >
              <BarChart
                data={dados}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Atendimentos" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.totalAtendimentos}>
            <div>
              <span>Quantidade de atendimentos realizados no período: </span>
              {dados.reduce((total, item) => total + item.Atendimentos, 0)}
            </div>

            <div>
              <span>
                Valor total de atendimentos realizados no período: R${' '}
              </span>
              {dados.reduce((value, item) => value + item.value, 0).toFixed(2)}
            </div>
          </div>
        </>
      ) : (
        <p>Informe o perído desejado</p>
      )}
    </div>
  );
};

export default Relatorios;
