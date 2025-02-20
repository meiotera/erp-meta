import styles from './Card.module.css'

function Card({ funcionario: { nome, profissao, descricao, foto } }) {
  return (
    <div className={`p-2 m-2 ${styles.cardPersonal}`}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body text-center">

        <h5 className="card-title">{nome}</h5>
        <p className="card-text">{descricao}</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  );
}

export default Card;