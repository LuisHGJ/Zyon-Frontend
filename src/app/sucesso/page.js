"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./sucesso.module.css";

export default function Sucesso() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const userId = searchParams.get("userId");

 useEffect(() => {
  if (userId) {
   fetch(`http://localhost:8080/users/markPaid/${userId}`, {
    method: "POST",
   })
   .then(res => res.json())
   .then(data => console.log("✅ Backend retornou:", data))
   .catch(err => console.error("Erro ao marcar como pago:", err));

      if (typeof window !== "undefined") {
          localStorage.removeItem("userId");
      }
  } else {
   console.warn("⚠️ Nenhum userId encontrado na URL.");
  }
 }, [userId]);

 return (
  <div className={styles.container}>
   <div className={styles.card}>
    <h1 className={styles.title}>Pagamento realizado com sucesso!</h1>
    <p>Obrigado por se cadastrar. Você já pode acessar todas as funcionalidades do site.</p>
        
    <button className={styles.button} onClick={() => router.push("/opcaoUser/login")}>
     Ir para a página de Login
    </button>
   </div>
  </div>
 );
}