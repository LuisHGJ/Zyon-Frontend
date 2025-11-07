"use client";

import { useEffect, useState } from "react";
import styles from "./perfil.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id"); // pega o ID do usuário logado

        if (!userId) throw new Error("Usuário não está logado");

        const res = await fetch(`http://localhost:8080/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao carregar perfil");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p className={styles.loading}>Carregando perfil...</p>;

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
          <p><strong>Email:</strong> {user.email}</p>
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
    </div>
  );
}
