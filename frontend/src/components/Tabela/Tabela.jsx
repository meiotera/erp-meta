import React from 'react';
import PropTypes from 'prop-types';

const Tabela = ({ colunas, dados }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {colunas.map((coluna, index) => (
              <th key={index}>{coluna.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              {colunas.map((coluna, colIndex) => (
                <td key={colIndex}>{item[coluna.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Tabela.propTypes = {
  colunas: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    }),
  ).isRequired,
  dados: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Tabela;
