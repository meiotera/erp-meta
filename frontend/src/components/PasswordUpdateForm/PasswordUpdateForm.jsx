import React, { useState } from 'react';
import styles from './PasswordUpdateForm.module.css';
import Message from '../Message/Message';
import Loading from '../Loading/Loading';

const PasswordUpdateForm = ({ onSubmit, isLoading, message, setMessage }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (setMessage) setMessage(null);

    if (!currentPassword || !password || !confirmPassword) {
      setLocalError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (password.length < 6) {
      setLocalError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const success = await onSubmit({
      currentPassword,
      password,
      confirm_password: confirmPassword,
    });

    if (success) {
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (localError) setLocalError('');
    if (message && setMessage) setMessage(null);
  };

  return (
    <form onSubmit={handleInternalSubmit} className={styles.form}>
      {message && <Message type={message.type} text={message.text} />}
      {localError && <Message type="error" text={localError} />}

      <div className={styles.inputGroup}>
        <label htmlFor="currentPassword">Senha Atual</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={handleInputChange(setCurrentPassword)}
          required
          className={styles.input}
          autoComplete="current-password"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="newPassword">Nova Senha</label>
        <input
          type="password"
          id="newPassword"
          value={password}
          onChange={handleInputChange(setPassword)}
          required
          minLength="6"
          className={styles.input}
          autoComplete="new-password"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleInputChange(setConfirmPassword)}
          required
          minLength="6"
          className={styles.input}
          autoComplete="new-password"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <button type="submit" className={styles.button}>
          Atualizar Senha
        </button>
      )}
    </form>
  );
};

export default PasswordUpdateForm;
