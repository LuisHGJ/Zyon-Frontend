"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        senha: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            email: form.email,
            senha: form.senha,
        };
    
        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (!res.ok) {
                throw new Error("Credenciais inválidas");
            }
    
            const data = await res.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("id", data.id);

            // Verifica se o usuário pagou
            if (data.paid === false) {
                alert("Pagamento pendente! Complete o checkout.");
                router.push("/pagamento");
            } else {
                router.push("/"); // acesso normal
            }
    
        } catch (err) {
            console.error(err);
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Login</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Email:
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
                    </label>
                    <button type="submit" className={styles.button}>Entrar</button>
                </form>

                <button
                    onClick={() => router.push("/opcaoUser/cadastro")}
                    className={styles.registerButton}
                >
                    Cadastrar-se
                </button>
            </div>
        </div>
    );
}