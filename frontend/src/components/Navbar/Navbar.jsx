import { NavLink } from "react-router-dom"

import styles from './Navbar.module.css'

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navbarNav}>
                <li className={styles.navItem}>
                    <NavLink to={'/'} className={styles.navLink} >
                        Home
                    </NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to={'/agendamento'} className={styles.navLink} >
                        Agendamento
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
