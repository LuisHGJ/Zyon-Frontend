"use client";

import { useEffect, useState } from "react";
import styles from "./ranking.module.css";

export default function RankingModal({ aberto, fecharModal }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!aberto) return; // só busca se o modal estiver aberto

    async function fetchRanking() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/ranking`);
        if (!res.ok) throw new Error("Erro ao buscar ranking");
        const data = await res.json();
        setRanking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className={styles.modalFundo}>
      <div className={styles.modalConteudo}>
        <h4 className={styles.rankingTitle}>Ranking Geral</h4>
        {loading ? (
          <p>Carregando ranking...</p>
        ) : (
          <table className={styles.rankingTable}>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Nome</th>
                <th>Nível</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((user, index) => (
                <tr key={user.id} className={index === 0 ? styles.top1 : ""}>
                  <td>{index + 1}</td>
                  <td>{user.nome}</td>
                  <td>{user.nivel}</td>
                  <td>{user.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className={styles.fecharButton} onClick={fecharModal}>
          Fechar
        </button>
      </div>
    </div>
  );
}
