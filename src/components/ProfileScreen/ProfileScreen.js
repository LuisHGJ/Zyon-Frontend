"use client";

import { useEffect, useState } from "react";
import styles from "./ProfileScreen.module.css";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from '@/app/hooks/useAuth';
import LoginPromptModal from "@/components/LoginPromptModal/LoginPromptModal";

export default function PerfilScreen({ targetId }) { 
    const { isAuthenticated, isLoading } = useAuth(); 
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
    const [selfUserId, setSelfUserId] = useState(null); 
    
    useEffect(() => {
        if (isAuthenticated) {
            setSelfUserId(localStorage.getItem("id"));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isLoading || (isAuthenticated && !targetId && !selfUserId)) {
            return;
        }

        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }

        const fetchUser = async () => {
            const userIdToFetch = targetId || selfUserId;
            const token = localStorage.getItem("token");

            if (!userIdToFetch || !token) {
                 return; 
            }
            
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userIdToFetch}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
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
                setUser(data);
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };

        if (isAuthenticated && (targetId || selfUserId)) {
            fetchUser();
        }
        
    }, [isAuthenticated, isLoading, targetId, selfUserId]); 

    if (isLoading || (isAuthenticated && !user && !targetId && !selfUserId)) {
        return <p className={styles.loading}>Carregando perfil...</p>;
    }

    if (!isAuthenticated) {
        return (
            <LoginPromptModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        );
    }
    
    if (!user) {
        return <p className={styles.loading}>Usuário não encontrado ou erro de carregamento.</p>;
    }

    const niveis = {
        1: "/estacoes/nivel1.gif",
        2: "/estacoes/nivel2.gif",
        3: "/estacoes/nivel3.gif",
    };

    const estacaoNivel = niveis[user.nivel] || "/estacoes/default.gif";

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Perfil do Usuário</h1>
                <Link className={styles.voltarButton} href="/">
                    Voltar
                </Link>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2>{user.nome}</h2>
                    <p><strong>Nível:</strong> {user.nivel}</p>
                    <p><strong>XP:</strong> {user.xp}</p>
                    <p><strong>Título:</strong> {user.titulo}</p>
                </div>

                <div className={styles.extraSpace}></div>

                <div>
                    <Image 
                        src={estacaoNivel}
                        width={335}
                        height={335}
                        alt="Estação espacial"
                        className={styles.estacao}
                    />
                </div>
            </main>
            <LoginPromptModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </div>
    );
}