import styles from './Card.module.css';

function Card({
  funcionario: { nome, profissao, descricao, foto, id },
  onClickEnabled,
  onClick,
}) {
  const handleClick = () => {
    if (onClickEnabled && onClick) {
      onClick(id); // Passa o ID do profissional para a função onClick
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
