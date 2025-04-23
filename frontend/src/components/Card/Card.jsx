import { useState } from 'react';
import styles from './Card.module.css';

function Card({
  funcionario: { nome, profissao, descricao, foto, id },
  onClickEnabled,
  onClick,
}) {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const handleClick = () => {
    if (onClickEnabled && onClick) {
      onClick(id);
    } else {
      setMostrarDetalhes((prev) => !prev);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img
        src={foto || '../../src/assets/logo-oficial.png'}
        alt={`imagem de ${nome}`}
        className={styles.cardImage}
      />
      <h5 className={styles.cardNome}>{nome}</h5>

      <div
        className={`${styles.cardBody} ${mostrarDetalhes ? styles.show : ''}`}
      >
        <p>
          <strong>Especialidade:</strong> {profissao}
        </p>
        <p>
          <strong>Descrição:</strong> {descricao}
        </p>
      </div>
    </div>
  );
}

export default Card;
