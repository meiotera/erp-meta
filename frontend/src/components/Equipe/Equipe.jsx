import React, { useContext } from 'react';
import { UsersContext } from '../../Contexts/UsersContext';
import Card from '../Card/Card';
import Loading from '../Loading/Loading';

function Equipe({ onClickEnabled, onClick }) {
  const { funcionarios, loading } = useContext(UsersContext);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div className="container mt-4">
      <div className="card-group d-flex justify-content-around flex-wrap">
        {funcionarios &&
          funcionarios.funcionarios &&
          funcionarios.funcionarios.map((funcionario) => (
            <Card
              key={funcionario.id}
              funcionario={funcionario}
              onClickEnabled={onClickEnabled}
              onClick={onClick}
            />
          ))}
      </div>
    </div>
  );
}

export default Equipe;
