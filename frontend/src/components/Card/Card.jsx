import styles from './Card.module.css';
import { useContext } from 'react';
import { UsersContext } from "../../Contexts/UsersContext";

function Card({ funcionario: { nome, profissao, descricao, foto, id }, onClickEnabled }) {
  const { fetchAgenda } = useContext(UsersContext);

  const handleClick = () => {
    if (onClickEnabled) {
      fetchAgenda(id);
    }
  };

  return (
    <div className={`p-2 m-2 ${styles.cardPersonal}`} onClick={handleClick}>
      <div className="card-body text-center">
        <h5 className="card-title">{nome}</h5>
        <p className="card-text">{descricao}</p>
      </div>
    </div>
  );
}

export default Card;