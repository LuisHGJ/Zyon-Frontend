"use client";

import { useEffect, useState } from "react";
import styles from "./perfil.module.css";
import Link from "next/link";

export default function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/users/1"); // substituir 1 pelo ID do usuário logado
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Perfil do Usuário</h1>
        <Link
          className={styles.voltarButton} 
          href="/"
        >
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
          {/* <button className={styles.button}>Editar Perfil</button> */}
        </div>
        <div className={styles.extraSpace}>

        </div>
      </main>
    </div>
  );
}
