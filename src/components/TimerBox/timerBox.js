import { useState, useEffect, useRef } from "react";

import Controles from "../controles/controles";
import styles from "./timerBox.module.css";

export default function TimerBox({
  tempoFoco,
  tempoPausaCurta,
  tempoPausaLonga,
  ciclosTotal
}) {

  const [faseIndex, setFaseIndex] = useState(0);
  const [cicloAtual, setCicloAtual] = useState(1);
  const [fase, setFase] = useState("Foco");
  const [tempoRestante, setTempoRestante] = useState(25 * 60);
  const [rodando, setRodando] = useState(false);
  const [modalCiclosConcluidos, setModalCiclosConcluidos] = useState(false);

  const fasesDoCiclo = ["Foco", "Pausa curta", "Foco", "Pausa curta", "Foco", "Pausa longa"];

  const audioRef = useRef(null);
  
  const tocarSom = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sons/botao.mp3"); 
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => console.warn("Erro ao tocar som:", err));
  };

  function tempoDaFase(fase) {
    if (fase === "Foco") return tempoFoco;
    if (fase === "Pausa curta") return tempoPausaCurta;
    if (fase === "Pausa longa") return tempoPausaLonga;
    return 0;
  }

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function trocarFase() {
    const proximaFaseIndex = faseIndex + 1;

    if (proximaFaseIndex < fasesDoCiclo.length) {
      setFaseIndex(proximaFaseIndex);
      setFase(fasesDoCiclo[proximaFaseIndex]);
      setTempoRestante(tempoDaFase(fasesDoCiclo[proximaFaseIndex]));
      tocarSom();
    } else {
      const proximoCiclo = cicloAtual + 1;
      if (proximoCiclo > ciclosTotal) {
        setRodando(false);
        setModalCiclosConcluidos(true);
        setCicloAtual(1);
        setFaseIndex(0);
        setFase(fasesDoCiclo[0]);
        setTempoRestante(tempoDaFase(fasesDoCiclo[0]));
        tocarSom();
      } else {
        setCicloAtual(proximoCiclo);
        setFaseIndex(0);
        setFase(fasesDoCiclo[0]);
        setTempoRestante(tempoDaFase(fasesDoCiclo[0]));
        tocarSom();
      }
    }
  }

  const reiniciar = () => {
    setRodando(false);
    setCicloAtual(1);
    setFaseIndex(0);
    setFase(fasesDoCiclo[0]);
    setTempoRestante(tempoDaFase(fasesDoCiclo[0]));
    tocarSom();
  };

  useEffect(() => {
    setTempoRestante(tempoDaFase(fase));
  }, [tempoFoco, tempoPausaCurta, tempoPausaLonga, fase]);

  useEffect(() => {
    if (!rodando) return;
    const intervalo = setInterval(() => setTempoRestante(prev => prev - 1), 1000);
    return () => clearInterval(intervalo);
  }, [rodando]);

  useEffect(() => {
    if (tempoRestante < 0) trocarFase();
  }, [tempoRestante]);

  return (
    <div className={styles.main}>
      <div className={styles.timerBox}>
        <div className={styles.ciclo}><p>Ciclo: {cicloAtual}/{ciclosTotal}</p></div>
        <div className={styles.tempo}><p>{formatarTempo(tempoRestante)}</p></div>
        <div className={styles.fase}><p>Fase atual: {fase}</p></div>

        {modalCiclosConcluidos && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Parabéns! Você concluiu todos os ciclos!</h2>
            <button onClick={() => setModalCiclosConcluidos(false)}>Fechar</button>
          </div>
        </div>
        )}
      
        <Controles
          rodando={rodando}
          setRodando={() => { setRodando(!rodando); tocarSom(); }}          
          trocarFase={trocarFase}
          reiniciar={reiniciar}
        />
      </div>
    </div>
  );
}
