"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./ProfileScreen.module.css";

const useAuth = () => {
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem("token") != null;
    const isLoading = false; 
    return { isAuthenticated, isLoading };
};

const LoginPromptModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>Autenticação Necessária</h3>
                <p className={styles.modalText}>Por favor, faça login para ver este perfil.</p>
                <button className={styles.modalButton} onClick={onClose}>
                    Entendido
                </button>
            </div>
        </div>
    );
};
// -----------------------------------------------------------

export default function PerfilScreen({ targetId }) {
    const { isAuthenticated, isLoading } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selfUserId, setSelfUserId] = useState(null);

    useEffect(() => {
        if (isAuthenticated && typeof window !== 'undefined') {
            setSelfUserId(localStorage.getItem("id"));
        }
    }, [isAuthenticated]);

    const fetchUser = useCallback(async (userIdToFetch) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        if (!userIdToFetch || !token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userIdToFetch}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                if (userIdToFetch === selfUserId) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("id");
                    setIsLoginModalOpen(true);
                }
                throw new Error("Sessão expirada ou usuário não encontrado.");
            }

            const data = await res.json();
            console.log(data); 
            console.log("estacaoImagem recebida:", data.estacaoImagem);
            setUser(data);
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
            setUser(null);
        }
    }, [selfUserId]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }

        const userIdToFetch = targetId || selfUserId;
        if (userIdToFetch) fetchUser(userIdToFetch);

    }, [isAuthenticated, isLoading, targetId, selfUserId, fetchUser]);

    if (isLoading || (isAuthenticated && !user && !targetId && !selfUserId)) {
        return <p className={styles.loading}>Carregando perfil...</p>;
    }

    if (!isAuthenticated) {
        return <LoginPromptModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />;
    }

    if (!user) {
        return <p className={styles.loading}>Usuário não encontrado ou erro de carregamento.</p>;
    }

    const estacaoImageName = user.estacaoImagem;
    const estacaoPath = `/estacoes/${estacaoImageName}`;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Perfil do Usuário</h1>
                <a href="/" className={styles.voltarButton}>Voltar</a>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2>{user.nome}</h2>
                    <p><strong>Nível:</strong> {user.nivel}</p>
                    <p><strong>XP:</strong> {user.xp}</p>
                    <p><strong>Título:</strong> {user.titulo}</p>
                </div>

                <div className={styles.extraSpace}></div>

                <img
                    src={estacaoPath}
                    width={335}
                    height={335}
                    alt={`Estação do ${user.titulo}`}
                    className={styles.estacao}
                />
            </main>

            <LoginPromptModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}
