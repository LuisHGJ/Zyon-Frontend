"use client"

import styles from "./page.module.css";
import { use, useEffect, useState } from "react";

export default function Home() {

  // Estados do Pomodoro
  const [faseIndex, setFaseIndex] = useState(0);
  const [cicloAtual, setCicloAtual] = useState(0);
  const [fase, setFase] = useState("Foco");
  const [tempoRestante, setTempoRestante] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);

  // Configurações do Pomodoro
  const [tempoFoco, setTempoFoco] = useState(25 * 60);
  const [tempoPausaCurta, setTempoPausaCurta] = useState(5 * 60);
  const [tempoPausaLonga, setTempoPausaLonga] = useState(15 * 60);

  // Ciclos
  const [ciclosTotal, setCiclosTotal ]= useState(2); 

  // Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCiclosConcluidos, setModalCiclosConcluidos] = useState(false);

  // Ciclo completo
  const fasesDoCiclo = ["Foco", "Pausa curta", "Foco", "Pausa curta", "Foco", "Pausa longa"];

  // ! CONTINUAR A PARTE DO SOM
  const [somEscolhido, setSomEscolhido] = useState("");

  function tocarSom(){
    const audio = new Audio("/sons/Pop.mp3");
    audio.play();
  }

  function trocarFase() {
    const proximaFaseIndex = faseIndex + 1;

    if (proximaFaseIndex < fasesDoCiclo.length) {
      setFaseIndex(proximaFaseIndex);
      setFase(fasesDoCiclo[proximaFaseIndex]);
      setTempoRestante(tempoDaFase(fasesDoCiclo[proximaFaseIndex]))
    } else {
      const proximoCiclo = cicloAtual + 1;
      if (proximoCiclo > ciclosTotal) {
        setRodando(false);
        setModalCiclosConcluidos(true);
        setFaseIndex(0);
        setCicloAtual(1);
        setFase(fasesDoCiclo[0]);
        setTempoRestante(tempoDaFase(fasesDoCiclo[0]));
      } else {
        setCicloAtual(proximoCiclo);
        setFaseIndex(0);
        setFase(fasesDoCiclo[0]);
        setTempoRestante(tempoDaFase(fasesDoCiclo[0]));
      }
    }
    tocarSom()
  }

  useEffect(() => {
    if (tempoRestante < 0) {
      trocarFase();
    }
  }, [tempoRestante]);

  useEffect(() => {
    setTempoRestante(tempoDaFase(fase));
}, [tempoFoco, tempoPausaCurta, tempoPausaLonga, fase]);

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60)
    const s = segundos % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!rodando) return;

    const intervalo = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [rodando]);

  function tempoDaFase(fase) {
    if (fase === "Foco") return tempoFoco;
    else if (fase === "Pausa curta") return tempoPausaCurta;
    else if (fase === "Pausa longa") return tempoPausaLonga;
    return 0;
  }

  // Efeito para tocar som
  useEffect(() => {
    if (somEscolhido) {
      const audio = new Audio(somEscolhido);
      audio.loop = true;
      audio.play();

      return () => audio.pause();
    }
  }, [somEscolhido]);
  
  return (
    <div className={styles.home}>

      <div className={styles.timer}>
        <h1> {formatarTempo(tempoRestante)} </h1>
        <h2>Fase atual: {fase} </h2>
        <h2>Ciclos: {cicloAtual} / {ciclosTotal} </h2>
      </div>

      <div className={styles.botoes}>
        <button onClick={() => {setRodando(true)}}>Iniciar</button>
        <button onClick={() => setRodando(false)}>Pausar</button>
        <button onClick={() => {
          setRodando(false)
          setCicloAtual(1)
          setFaseIndex(0)
          setFase(fasesDoCiclo[0])
          setTempoRestante(tempoDaFase(fasesDoCiclo[0]))
        }}>Reiniciar</button>
        <button onClick={() => setModalAberto(true)}>Configurações</button>
        <button onClick={() => trocarFase()}>Trocar Fase</button>
      </div>

      {modalAberto && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Configurações do Pomodoro</h2>

            <label>
              Foco (min):
              <input 
                type="number" 
                value={tempoFoco / 60} 
                onChange={(e) => setTempoFoco(e.target.value * 60)} 
              />
            </label>

            <label>
              Pausa Curta (min):
              <input 
                type="number" 
                value={tempoPausaCurta / 60} 
                onChange={(e) => setTempoPausaCurta(e.target.value * 60)} 
              />
            </label>

            <label>
              Pausa Longa (min):
              <input 
                type="number" 
                value={tempoPausaLonga / 60} 
                onChange={(e) => setTempoPausaLonga(e.target.value * 60)} 
              />
            </label>

            <label>
              Quantidade de ciclos:
              <input
                type="number"
                min="1"
                value={ciclosTotal}
                onChange={(e) => setCiclosTotal(Number(e.target.value))}
              />
            </label>
            <button onClick={() => {setModalAberto(false)}}>Fechar</button>
          </div>
        </div>
      )}
      {modalCiclosConcluidos && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Parabéns! Você concluiu todos os ciclos!</h2>
            <button onClick={() => setModalCiclosConcluidos(false)}>Fechar</button>
          </div>
        </div>
      )}

    </div>
  );
}
