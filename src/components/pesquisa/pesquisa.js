"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./pesquisa.module.css";
import { useAuth } from '@/app/hooks/useAuth';
import LoginPromptModal from "../LoginPromptModal/LoginPromptModal";
import Link from "next/link"; // 👈 NOVA IMPORTAÇÃO AQUI

export default function PesquisaUsuario(props) {
    const { isAuthenticated, isLoading } = useAuth();

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [resultados, setResultados] = useState([]); 
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    
    // Estado para controlar a requisição de busca
    const [termoBusca, setTermoBusca] = useState("");

    // Função de debounce (atraso) para limitar a frequência das requisições
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    // Função para buscar na API, envolvida em useCallback para o debounce
    const executeSearch = useCallback(debounce(async (termo) => {
        if (!termo.trim()) {
            setResultados([]);
            setErro("");
            return;
        }

        if (!isAuthenticated) {
            setErro("Você precisa estar logado para realizar a busca dinâmica.");
            return;
        }

        setCarregando(true);
        setErro("");
        setResultados([]);

        try {
            // Requisição real para o endpoint de busca parcial que implementamos no backend
            const response = await fetch(`http://localhost:8080/users/search?nome=${termo}`);

            if (response.status === 404) {
                setResultados([]);
                setErro(`Nenhum usuário encontrado com o nome: "${termo}".`);
                return;
            }

            if (!response.ok) {
                throw new Error("Erro ao buscar usuários. Tente novamente.");
            }

            const data = await response.json();
            
            if (data.length === 0) {
                setErro(`Nenhum usuário encontrado com o nome: "${termo}".`);
            }
            
            setResultados(data);

        } catch (error) {
            setErro(error.message);
            setResultados([]);
        } finally {
            setCarregando(false);
        }
    }, 500), [isAuthenticated]); // O debounce é de 500ms (meio segundo)

    // Efeito para disparar a busca sempre que o nomeUsuario mudar
    useEffect(() => {
        executeSearch(nomeUsuario);
    }, [nomeUsuario, executeSearch]); // executeSearch é uma dependência estável (graças ao useCallback)


    // Tratamento de mudança de input
    const handleChange = (e) => {
        setNomeUsuario(e.target.value);
        // Limpa resultados e erros imediatamente para evitar confusão visual
        setResultados([]);
        setErro("");
    };

    if (isLoading) return null;

    if (!isAuthenticated) {
        return (
            <LoginPromptModal 
                isOpen={true} 
                onClose={() => props.onClose()} 
            />
        );
    }

    return (
        <div className={styles.modalFundo}>
            <div className={styles.modalConteudo}>
                <h2 className={styles.titulo}>Pesquisar usuário</h2>
                
                <div className={styles.pesquisaContainer}>
                    <input
                        type="text"
                        placeholder="Digite o nome do usuário para pesquisar..."
                        value={nomeUsuario}
                        onChange={handleChange}
                        className={styles.inputPesquisa}
                    />
                </div>
                
                {carregando && <p className={styles.carregando}>Buscando...</p>}
                
                {erro && <p className={styles.erroPesquisa}>{erro}</p>}

                {!carregando && nomeUsuario.trim() && resultados.length > 0 && (
                    <div className={styles.resultadosLista}>
                        <h3>Resultados da Busca:</h3>
                        {resultados.map((usuario) => (
                            <Link 
                                key={usuario.id} 
                                href={`/perfil/${usuario.id}`} 
                                className={styles.resultadoItemLink} 
                                onClick={props.onClose}
                            >
                                <div className={styles.resultadoItem}>
                                    <p><strong>Nome:</strong> {usuario.nome}</p>
                                </div>
                            </Link>
                        ))}
                        {resultados.length >= 10 && (
                             <p className={styles.nota}>Exibindo os primeiros {resultados.length} resultados.</p>
                        )}
                    </div>
                )}
                
                {!carregando && !erro && nomeUsuario.trim() && resultados.length === 0 && (
                     <p className={styles.nota}>Nenhum resultado encontrado. Continue digitando.</p>
                )}


                <button onClick={() => props.onClose()} className={styles.botaoFechar}>
                    Fechar
                </button>
            </div>
        </div>
    );
}
