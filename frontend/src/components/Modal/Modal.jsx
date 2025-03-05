import styles from './Modal.module.css'

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    }
    return (
        <div className={`${styles.modalOverlay}`} onClick={onClose}>
            <div className={`${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    )
}


export default Modal
