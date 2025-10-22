import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import styles from "./calendario.module.css";
import { getTasks, deleteTask, updateTask, createTask } from "@/services/apiTasks";

export default function Calendario() {
  const [tasks, setTasks] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [modalNovaTask, setModalNovaTask] = useState(false);

  const [taskSelecionada, setTaskSelecionada] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});

  const [novaTask, setNovaTask] = useState({
    nome: "",
    descricao: "",
    dificuldade: 1,
    prioridade: 1,
    cicloTempo: 1,
    dataAgendada: "",
    usuarioID: 1,
  });

  useEffect(() => {
    getTasks().then(data => setTasks(data)).catch(err => console.error(err));
  }, []);

  const handleEventClick = (info) => {
    const task = tasks.find(t => t.dataAgendada === info.event.startStr && t.nome === info.event.title);
    if (!task) return;
    setTaskSelecionada(task);
    setModalAberto(true);
  };

  const handleDateClick = (info) => {
    const date = new Date(info.date);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset); 
    date.setDate(date.getDate() + 1); 
  
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dataFormatada = `${yyyy}-${mm}-${dd}`;
  
    setNovaTask(prev => ({ ...prev, dataAgendada: dataFormatada }));
    setModalNovaTask(true);
  };


  const handleDelete = async () => {
    if (!taskSelecionada) return;
    await deleteTask(taskSelecionada.id);
    setTasks(prev => prev.filter(t => t.id !== taskSelecionada.id));
    setModalAberto(false);
  };

  const handleEdit = () => {
    if (!taskSelecionada) return;
    setFormEdicao({ ...taskSelecionada });
    setModalEdicao(true);
  };

  const handleConfirmEdit = async () => {
    if (!formEdicao.nome || !formEdicao.dificuldade || !formEdicao.dataAgendada) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
  
    await updateTask(formEdicao.id, formEdicao);
    setTasks(prev => prev.map(t => t.id === formEdicao.id ? formEdicao : t));
    setTaskSelecionada(formEdicao);
    setModalEdicao(false);
    setModalAberto(false);
  };
  
  const handleCriarTask = async () => {
    if (!novaTask.nome || !novaTask.dificuldade || !novaTask.dataAgendada) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
  
    try {
      const taskCriada = await createTask(novaTask);
      setTasks(prev => [...prev, taskCriada]);
      setModalNovaTask(false);
  
      setNovaTask({
        nome: "",
        descricao: "",
        dificuldade: 1,
        prioridade: 1,
        cicloTempo: 1,
        dataAgendada: "",
        usuarioID: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao criar task");
    }
  };

  return (
    <div className={styles.calendarioContainer}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={tasks.map(t => ({ title: t.nome, date: t.dataAgendada }))}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />

      {modalAberto && taskSelecionada && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>{taskSelecionada.nome}</h2>
            <p>Descrição: {taskSelecionada.descricao}</p>
            <p>Dificuldade: {taskSelecionada.dificuldade}</p>
            <p>Prioridade: {taskSelecionada.prioridade}</p>
            <p>Recompensa XP: {taskSelecionada.recompensa_xp || taskSelecionada.recompensaXP}</p>
            <p>Data: {taskSelecionada.dataAgendada}</p>
            <div className={styles.botoesModal}>
              <button onClick={handleEdit}>Editar</button>
              <button onClick={handleDelete}>Excluir</button>
              <button onClick={() => setModalAberto(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {modalEdicao && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Editar Task</h2>
            <label>
              Nome *:
              <input
                type="text"
                value={formEdicao.nome}
                onChange={(e) => setFormEdicao(prev => ({ ...prev, nome: e.target.value }))}
              />
            </label>
            <label>
              Descrição:
              <textarea
                value={formEdicao.descricao}
                onChange={(e) => setFormEdicao(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </label>
            <label>
              Dificuldade *:
              <input
                type="number"
                min="1"
                max="5"
                value={formEdicao.dificuldade}
                onChange={(e) => setFormEdicao(prev => ({ ...prev, dificuldade: e.target.value }))}
              />
            </label>
            <label>
              Prioridade:
              <input
                type="number"
                min="1"
                max="5"
                value={formEdicao.prioridade}
                onChange={(e) => setFormEdicao(prev => ({ ...prev, prioridade: e.target.value }))}
              />
            </label>
            <label>
              Data *:
              <input
                type="date"
                value={formEdicao.dataAgendada}
                onChange={(e) => setFormEdicao(prev => ({ ...prev, dataAgendada: e.target.value }))}
              />
            </label>
            <div className={styles.botoesModal}>
              <button onClick={handleConfirmEdit}>Salvar</button>
              <button onClick={() => setModalEdicao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalNovaTask && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Criar Task para {novaTask.dataAgendada}</h2>
            <label>
              Nome *:
              <input
                type="text"
                value={novaTask.nome}
                onChange={e => setNovaTask(prev => ({ ...prev, nome: e.target.value }))}
              />
            </label>
            <label>
              Descrição:
              <textarea
                value={novaTask.descricao}
                onChange={e => setNovaTask(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </label>
            <label>
              Dificuldade *:
              <input
                type="number"
                min="1"
                max="5"
                value={novaTask.dificuldade}
                onChange={e => setNovaTask(prev => ({ ...prev, dificuldade: e.target.value }))}
              />
            </label>
            <label>
              Prioridade:
              <input
                type="number"
                min="1"
                max="5"
                value={novaTask.prioridade}
                onChange={e => setNovaTask(prev => ({ ...prev, prioridade: e.target.value }))}
              />
            </label>
            <label>
              Ciclo Tempo:
              <input
                type="number"
                min="1"
                value={novaTask.cicloTempo}
                onChange={e => setNovaTask(prev => ({ ...prev, cicloTempo: e.target.value }))}
              />
            </label>
            <div className={styles.botoesModal}>
              <button onClick={handleCriarTask}>Criar</button>
              <button onClick={() => setModalNovaTask(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
