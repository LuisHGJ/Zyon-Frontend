"use client";

import { useRouter } from 'next/navigation';
import styles from './LoginPromptModal.module.css';

export default function LoginPromptModal({ isOpen, onClose }) {
    const router = useRouter();

    if (!isOpen) return null;

    const modalClass = isOpen ? `${styles.overlay} ${styles.visible}` : styles.overlay;

    const handleLoginRedirect = () => {
        onClose(); 
        router.push('/opcaoUser/login'); 
    };

    const handleHomeRedirect = () => {
        onClose(); 
        router.push('/'); 
    };

    return (
        <div className={modalClass}> 
            <div className={styles.modal}>
                <h2>Acesso Restrito</h2>
                <p>Você precisa fazer login para acessar esta funcionalidade.</p>
                <button onClick={handleLoginRedirect} className={styles.button}>
                    Fazer Login
                </button>
                <button onClick={handleHomeRedirect} className={styles.cancelButton}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}