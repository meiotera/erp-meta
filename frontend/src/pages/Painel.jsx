import React, { useContext } from 'react';
import { LoginContext } from '../Contexts/LoginContext';
import Section from '../components/Section/Section';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './Painel.module.css';

const Painel = () => {
  const { funcionario } = useContext(LoginContext);

  const funcionarioId = funcionario?.id || funcionario?.funcionario?.id;
  const role = funcionario?.role || funcionario?.funcionario?.role;

  return (
    <Section className={styles.painel} headingH2="Painel administrativo">
      <nav className={styles.menuNav}>
        <ul>
          <li>
            <NavLink to={'perfil'}>Perfil</NavLink>
          </li>
          {role === 'admin' && (
            <li>
              <NavLink to={'usuarios'}>Cadastrar usuário</NavLink>
            </li>
          )}
          <li>
            <NavLink to={'relatorios'}>Relatórios</NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.pagina}>
        <Outlet />
      </div>
    </Section>
  );
};

export default Painel;
