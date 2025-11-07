import { useState, useEffect } from "react";
import styles from "./sideBarTasks.module.css";
import { getTasks, deleteTask, updateTask, createTask } from "@/services/apiTasks";

import menuIcon from "/public/icones/menuIcon.png";

import Image from "next/image";

export default function SidebarTasks() {
  const [tasks, setTasks] = useState([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const [modalNovaTask, setModalNovaTask] = useState(false);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [taskSelecionada, setTaskSelecionada] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});

  const userId = Number(localStorage.getItem("id"));

  const [novaTask, setNovaTask] = useState({
    nome: "",
    descricao: "",
    dificuldade: 1,
    prioridade: 1,
    cicloTempo: 1,
    dataAgendada: "",
    usuarioID: userId
  });

  useEffect(() => {
    getTasks().then(data => setTasks(data)).catch(console.error);
  }, []);

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
  
    // Converte a data para objeto Date e soma 1 dia
    const data = new Date(novaTask.dataAgendada);
    data.setDate(data.getDate() + 1);
  
    const taskAjustada = {
      ...novaTask,
      usuarioID: userId,
      dataAgendada: data.toISOString().split("T")[0], // volta para formato yyyy-mm-dd
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
            onClick={() => setSidebarAberta(!sidebarAberta)}
        />

      <div className={`${styles.sidebar} ${sidebarAberta ? styles.aberta : ""}`}>
        <h2 className={styles.title}>Tasks</h2>
        <button onClick={() => setModalNovaTask(true)}>Criar Task</button>

        <ul className={styles.taskList}>
          {tasks.map(task => (
            <li key={task.id}>
              <span>{task.nome} - {task.dataAgendada}</span>
              <div className={styles.botoes}>
                <button onClick={() => handleEditClick(task)}>Editar</button>
                <button onClick={() => handleDelete(task.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
            <button onClick={handleCriarTask}>Criar</button>
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
            <button onClick={handleConfirmEdit}>Salvar</button>
            <button onClick={() => setModalEdicao(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
