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
    <div className={styles.card} onClick={handleClick}>
      <img
        src={foto ? foto : '../../src/assets/logo-oficial.png'}
        alt={`imagem de ${nome}`}
      />
      <div className={styles.cardBody}>
        <h5>{nome}</h5>
        <p>{profissao}</p>
        <p>{descricao}</p>
      </div>
    </div>
  );
}

export default Card;
