"use client"

import { getTasks, createTask, updateTask, deleteTask } from "@/services/api";
import styles from "./page.module.css";

import { useEffect, useState } from "react";
import TimerBox from "@/components/TimerBox/timerBox";
import Configuracoes from "@/components/configuracoes/configuracoes";

export default function Home() {
  
  const [tempoFoco, setTempoFoco] = useState(25 * 60);
  const [tempoPausaCurta, setTempoPausaCurta] = useState(5 * 60);
  const [tempoPausaLonga, setTempoPausaLonga] = useState(15 * 60);
  const [ciclosTotal, setCiclosTotal] = useState(2);
  const [rodando, setRodando] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  async function handleAdd() {
    const newTask = {
      "usuarioID": 1,
      "cicloTempo": 1,
      "nome": "teste",
      "descricao": "teste de task",
      "prioridade": 3,
      "dificuldade": 4,
      "energia": 200,
      "xp": 500,
      "realizado": false
    };
    const savedTask = await createTask(newTask);
    setTasks(prev => [...prev, savedTask]);
  };

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  }
  
  return (
    <div className={styles.home}>

    <TimerBox
      tempoFoco={tempoFoco}
      tempoPausaCurta={tempoPausaCurta}
      tempoPausaLonga={tempoPausaLonga}
      ciclosTotal={ciclosTotal}
      rodando={rodando}
      setRodando={setRodando}
    />      

    <Configuracoes
      tempoFoco={tempoFoco}
      setTempoFoco={setTempoFoco}
      tempoPausaCurta={tempoPausaCurta}
      setTempoPausaCurta={setTempoPausaCurta}
      tempoPausaLonga={tempoPausaLonga}
      setTempoPausaLonga={setTempoPausaLonga}
      ciclosTotal={ciclosTotal}
      setCiclosTotal={setCiclosTotal}
      rodando={rodando}
    />

    <button onClick={() => setModalAberto(true)}>adicionar</button>

    <ul>
      {tasks.map(t => (
        <li key={t.id}>
          {t.nome}
          <button onClick={() => handleDelete(t.id)}>x</button>
        </li>
      ))}
    </ul>

    </div>
  );
}
