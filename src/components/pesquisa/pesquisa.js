"use client";

import { use, useState } from "react";
import styles from "./pesquisa.module.css";

export default function PesquisaUsuario(props) {
    const [email, setEmail] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSearch = async () => {
        setErro("");
        setUsuario(null);

        if (!email.trim()) {
            setErro("Por favor, insira um email válido.");
            return;
        }
        setCarregando(true);

        try {
            const response = await fetch(`http://localhost:8080/users/email?email=${email}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar usuário.");
            }

            const data = await response.json();
            setUsuario(data);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };


    return (
        <div className={styles.modalFundo}>
            <div className={styles.modalConteudo}>
                <h2 className={styles.titulo}>Pesquisar Usuário</h2>
                <div className={styles.pesquisaContainer}>
                    <input
                        type="text"
                        placeholder="Digite o email do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputPesquisa}
                    />
                    <button
                        onClick={handleSearch}
                        className={styles.botaoPesquisa}
                        disabled={carregando}
                    >
                        {carregando ? "Pesquisando..." : "Pesquisar"}
                    </button>
                </div>

                {erro && <p className={styles.erroPesquisa}>{erro}</p>}

                {usuario && (
                <div className={styles.resultadoPesquisa}>
                    <h3>Usuário Encontrado</h3>
                    <p><strong>Nome:</strong> {usuario.nome}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                </div>
                )}

                <button onClick={() => props.onClose()} className={styles.botaoFechar}>
                    Fechar
                </button>
            </div>
        </div>
    );
}