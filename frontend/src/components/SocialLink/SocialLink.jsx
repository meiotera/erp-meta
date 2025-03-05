import { useContext } from 'react';
import { UsersContext } from "../../Contexts/UsersContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './SocialLink.module.css';

import Loading from '../Loading/Loading';

function SocialLink() {
    const { funcionarios } = useContext(UsersContext);

    return (
        <div>
            {
                funcionarios
                    .filter((funcionario) => funcionario.instagram)
                    .map((funcionario) => (
                        <a
                            key={funcionario.id}
                            href={`https://www.instagram.com/${funcionario.instagram}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`m-2 ${styles.socialLink}`}
                        >
                            <FontAwesomeIcon icon={faInstagram} className={`me-2 ${styles.icon}`} />
                            {funcionario.instagram}
                        </a>
                    ))
            }
        </div >
    );
}

export default SocialLink;