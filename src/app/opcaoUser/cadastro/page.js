"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";

export default function Cadastro() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    nivel: 1,
    xp: 0,
    titulo: "Cadete",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("Senhas não coincidem!");
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      nivel: form.nivel,
      xp: form.xp,
      titulo: form.titulo,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const data = await res.json();

      localStorage.setItem("userId", data.id);

      router.push("/pagamento");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cadastro</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Senha:
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Confirmar Senha:
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className={styles.button}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
