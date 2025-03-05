import React, { useContext } from 'react';
import { UsersContext } from "../../Contexts/UsersContext";
import Card from '../Card/Card';
import Loading from '../Loading/Loading';

function Equipe({ onClickEnabled }) {
  const { funcionarios } = useContext(UsersContext);

  return (
    <div className="container mt-4">
      <div className="card-group d-flex justify-content-around flex-wrap">
        {funcionarios.map((funcionario) => (
          <Card key={funcionario.id} funcionario={funcionario} onClickEnabled={onClickEnabled} />
        ))}
      </div>
    </div>
  );
}

export default Equipe;