"use client";

import { loadStripe } from "@stripe/stripe-js";
import styles from "./pagamento.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Pagamento() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  async function handleCheckout() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagamento/checkout?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao criar sessão de pagamento");
      }

      const data = await res.json();
      window.location.href = data.url; // Redireciona para o checkout da Stripe
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao criar sessão de pagamento");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bem vindo ao Zyon! Para continuar, pague a assinatura vitalícia clicando no botão abaixo</h1>
        <button onClick={handleCheckout} className={styles.button}>
          Acessar página de pagamento
        </button>
      </div>
    </div>
  );
}
