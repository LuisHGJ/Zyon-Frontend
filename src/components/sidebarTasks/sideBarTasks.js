"use client";

import { useState, useEffect } from "react";
import styles from "./sideBarTasks.module.css";
import { getTasks, deleteTask, updateTask, createTask } from "@/services/apiTasks";
import menuIcon from "/public/icones/menuIcon.png";
import Image from "next/image";

import { useAuth } from '@/app/hooks/useAuth';
import LoginPromptModal from "../LoginPromptModal/LoginPromptModal";

export default function SidebarTasks() {
    const { isAuthenticated, isLoading } = useAuth();
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

    // 1. O useEffect agora só busca dados se estiver autenticado e não abre o modal inicialmente.
    useEffect(() => {
        if (typeof window !== "undefined" && isAuthenticated) {
            const id = Number(localStorage.getItem("id"));
            setUserId(id);
            setNovaTask(prev => ({ ...prev, usuarioID: id }));

            // Só busca as tasks se o userId for válido (ou seja, se estiver logado)
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

    // 2. NOVA LÓGICA: Esta função checa o login ANTES de abrir a sidebar
    const handleToggleSidebar = () => {
        if (!isAuthenticated) {
            // Se não estiver logado, abre o modal, mas não abre a sidebar
            setIsLoginModalOpen(true);
        } else {
            // Se estiver logado, apenas alterna o estado da sidebar
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
            {/* O botão do menu está sempre visível e usa a nova lógica */}
            <Image
                src={menuIcon}
                alt="menuIcon"
                className={styles.toggleButton}
                width={30}
                height={30}
                onClick={handleToggleSidebar} // Usa a nova função
            />

            <div className={`${styles.sidebar} ${sidebarAberta ? styles.aberta : ""}`}>
                <h2 className={styles.title}>Tasks</h2>
                {/* O botão de Criar Task é protegido */}
                <button onClick={() => handleProtectedAction(() => setModalNovaTask(true))}>Criar Task</button>

                <ul className={styles.taskList}>
                    {/* A lista de tasks só será populada se isAuthenticated for true */}
                    {tasks.map(task => (
                        <li key={task.id}>
                            <span>{task.nome} - {task.dataAgendada}</span>
                            <div className={styles.botoes}>
                                {/* Botões de ação são protegidos */}
                                <button onClick={() => handleProtectedAction(handleEditClick, task)}>Editar</button>
                                <button onClick={() => handleProtectedAction(handleDelete, task.id)}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modais de Task (sempre protegidos por handleProtectedAction nos botões) */}
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
            {/* O Modal de Aviso de Login é sempre renderizado, mas fica invisível até ser ativado */}
            <LoginPromptModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </div>
    );
}