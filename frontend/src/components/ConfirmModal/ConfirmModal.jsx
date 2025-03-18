import React from 'react';
import Button from '../Button/Button';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <Button className="btn-secondary" action={onClose}>
            Cancelar
          </Button>
          <Button className="btn-primary" action={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
