import { useState, useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 200); // Tempo para fade-out antes de desmontar
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.show : ''}`}
      onClick={onClose}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
