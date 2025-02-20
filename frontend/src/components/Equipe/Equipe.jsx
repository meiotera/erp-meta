// import { listarFuncionarios } from '../../api/funcionario';
// import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UsersContext } from "../../pages/Home";

import Card from '../Card/Card';
import Loading from '../Loading/Loading';

function Equipe() {

  const { funcionarios, loading } = useContext(UsersContext);

  return (
    <div className="container mt-4">
      {loading ? <Loading /> :
        <div className="card-group d-flex justify-content-around flex-wrap">
          {funcionarios.map((funcionario) => (
            <Card key={funcionario.id} funcionario={funcionario} />
          ))}
        </div>
      }
    </div>
  );
}

export default Equipe;