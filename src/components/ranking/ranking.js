"use client";
import { useEffect, useState } from "react";
import styles from "./ranking.module.css";

export default function RankingGeral() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch("http://localhost:8080/users/ranking");
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
  }, []);

  if (loading) return <p>Carregando ranking...</p>;

  return (
    <div className={styles.rankingContainer}>
      <h4 className={styles.rankingTitle}>Ranking Geral</h4>
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
    </div>
  );
}
