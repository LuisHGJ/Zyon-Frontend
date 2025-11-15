"use client";

import { useState, useEffect } from "react";
import styles from "./sideBarTasks.module.css";
// Adicionando 'completeTask' ao import
import { getTasks, deleteTask, updateTask, createTask, completeTask } from "@/services/apiTasks";
import menuIcon from "/public/icones/menuIcon.png";
import Image from "next/image";

// AJUSTE: Importando o NOVO useAuth do Contexto
import { useAuth } from '@/app/contexts/AuthProfileContext';
import LoginPromptModal from "../LoginPromptModal/LoginPromptModal";

export default function SidebarTasks() {
    // AJUSTE: Desestruturando 'userProfile' e a nova função 'updateProfile'
    const { isAuthenticated, isLoading, userProfile, updateProfile } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [sidebarAberta, setSidebarAberta] = useState(false);
    const [modalNovaTask, setModalNovaTask] = useState(false);
    const [modalEdicao, setModalEdicao] = useState(false);
    const [taskSelecionada, setTaskSelecionada] = useState(null);
    const [formEdicao, setFormEdicao] = useState({});
    const [userId, setUserId] = useState(null);

    const [novaTask, setNovaTask] = useState({
        nome: "",
        descricao: "",
        dificuldade: 1,
        prioridade: 1,
        cicloTempo: 1,
        dataAgendada: "",
        usuarioID: null,
    });

    // 1. O useEffect só busca tasks se autenticado
    useEffect(() => {
        if (typeof window !== "undefined" && isAuthenticated) {
            const id = Number(localStorage.getItem("id"));
            setUserId(id);
            setNovaTask(prev => ({ ...prev, usuarioID: id }));

            getTasks()
                .then(data => setTasks(data))
                .catch(console.error);
        }
    }, [isAuthenticated]);

    // Função auxiliar que protege todas as ações
    const handleProtectedAction = (actionHandler, ...args) => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
        } else {
            actionHandler(...args);
        }
    };

    // NOVA FUNÇÃO: Lógica para concluir a task e receber XP
    const handleConcluirTask = async (id) => {
        const currentTask = tasks.find(t => t.id === id);
        if (currentTask && currentTask.concluido) return;

        try {
            // 1. Chama a API e recebe o objeto User atualizado (XP, Nível, etc.)
            const updatedUser = await completeTask(id);

            // 2. Marca a task como concluída localmente
            setTasks(prev => prev.map(t => 
                t.id === id ? { ...t, concluido: true } : t
            ));
            
            // 3. Atualiza o estado global do usuário via Contexto
            updateProfile(updatedUser); 
            console.log("Task concluída! Perfil do Usuário atualizado:", updatedUser);

        } catch (error) {
            console.error("Erro na conclusão da task:", error);
            // Substituímos alert() por uma mensagem mais segura (você pode trocar por um modal)
            alert(`Erro ao concluir a task: ${error.message}`); 
        }
    };

    // 2. LÓGICA: Checa o login ANTES de abrir a sidebar
    const handleToggleSidebar = () => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
        } else {
            setSidebarAberta(!sidebarAberta);
        }
    };

    // Funções de Ação (encapsuladas por handleProtectedAction no JSX)
    const handleDelete = async (id) => {
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleEditClick = (task) => {
        setTaskSelecionada(task);
        setFormEdicao({ ...task });
        setModalEdicao(true);
    };

    const handleConfirmEdit = async () => {
        await updateTask(formEdicao.id, formEdicao);
        setTasks(prev => prev.map(t => t.id === formEdicao.id ? formEdicao : t));
        setModalEdicao(false);
    };

    const handleCriarTask = async () => {
        if (!novaTask.nome || !novaTask.dataAgendada) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        const data = new Date(novaTask.dataAgendada);
        data.setDate(data.getDate() + 1);

        const taskAjustada = {
            ...novaTask,
            usuarioID: userId,
            dataAgendada: data.toISOString().split("T")[0],
        };

        const taskCriada = await createTask(taskAjustada);
        setTasks(prev => [...prev, taskCriada]);

        setNovaTask({
            nome: "",
            descricao: "",
            dificuldade: 1,
            prioridade: 1,
            cicloTempo: 1,
            dataAgendada: "",
            usuarioID: userId,
        });

        setModalNovaTask(false);
    };

    return (
        <div className={styles.main}>
            <Image
                src={menuIcon}
                alt="menuIcon"
                className={styles.toggleButton}
                width={30}
                height={30}
                onClick={handleToggleSidebar}
            />

            <div className={`${styles.sidebar} ${sidebarAberta ? styles.aberta : ""}`}>
                <h2 className={styles.title}>Tasks</h2>
                
                {/* NOVO: Exibição de Nível e XP do usuário */}
                {userProfile ? (
                    <div className={styles.profileSummary}>
                        <p>Nível: <strong>{userProfile.nivel}</strong> | XP: <strong>{userProfile.xp}</strong></p>
                    </div>
                ) : (
                    !isLoading && isAuthenticated && <p className={styles.loadingText}>A carregar perfil...</p>
                )}

                <button onClick={() => handleProtectedAction(() => setModalNovaTask(true))}>Criar Task</button>

                <ul className={styles.taskList}>
                    {tasks.map(task => (
                        // Adicionando classe 'concluida' para estilizar (ver CSS)
                        <li key={task.id} className={task.concluido ? styles.concluida : ''}>
                            <span className={task.concluido ? styles.concluidoText : ''}>
                                {task.nome} - {task.dataAgendada}
                            </span>
                            <div className={styles.botoes}>
                                {/* NOVO BOTÃO: Só aparece se a task NÃO estiver concluída */}
                                {!task.concluido && (
                                    <button 
                                        className={styles.concluirButton}
                                        onClick={() => handleProtectedAction(handleConcluirTask, task.id)}
                                    >
                                        Concluir (+XP)
                                    </button>
                                )}
                                
                                <button onClick={() => handleProtectedAction(handleEditClick, task)}>Editar</button>
                                <button onClick={() => handleProtectedAction(handleDelete, task.id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modais de Task */}
            {modalNovaTask && (
                <div className={styles.modalFundo}>
                    <div className={styles.modalConteudo}>
                        <h2 className={styles.title}>Criar Task</h2>
                        <label>
                            Nome:
                            <input type="text" value={novaTask.nome} onChange={e => setNovaTask(prev => ({ ...prev, nome: e.target.value }))} required />
                        </label>
                        <label>
                            Descrição:
                            <textarea value={novaTask.descricao} onChange={e => setNovaTask(prev => ({ ...prev, descricao: e.target.value }))} />
                        </label>
                        <label>
                            Data:
                            <input type="date" value={novaTask.dataAgendada} onChange={e => setNovaTask(prev => ({ ...prev, dataAgendada: e.target.value }))} required />
                        </label>
                        <button onClick={() => handleProtectedAction(handleCriarTask)}>Criar</button>
                        <button onClick={() => setModalNovaTask(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {modalEdicao && (
                <div className={styles.modalFundo}>
                    <div className={styles.modalConteudo}>
                        <h2 className={styles.title}>Editar Task</h2>
                        <label>
                            Nome:
                            <input type="text" value={formEdicao.nome} onChange={e => setFormEdicao(prev => ({ ...prev, nome: e.target.value }))} required />
                        </label>
                        <label>
                            Descrição:
                            <textarea value={formEdicao.descricao} onChange={e => setFormEdicao(prev => ({ ...prev, descricao: e.target.value }))} />
                        </label>
                        <label>
                            Data:
                            <input type="date" value={formEdicao.dataAgendada} onChange={e => setFormEdicao(prev => ({ ...prev, dataAgendada: e.target.value }))} required />
                        </label>
                        <button onClick={() => handleProtectedAction(handleConfirmEdit)}>Salvar</button>
                        <button onClick={() => setModalEdicao(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            
            <LoginPromptModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </div>
    );
}