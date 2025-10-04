"use client"

import styles from "./page.module.css";
import { use, useEffect, useState } from "react";

export default function Home() {

  const [fase, setFase] = useState("Foco");
  const [tempoRestante, setTempoRestante] = useState(25 * 60);
  const [ciclos, setCiclos] = useState(0);
  const [rodando, setRodando] = useState(false);

  const [tempoFoco, setTempoFoco] = useState(25 * 60);
  const [tempoPausaCurta, setTempoPausaCurta] = useState(5 * 60);
  const [tempoPausaLonga, setTempoPausaLonga] = useState(15 * 60);

  const [modalAberto, setModalAberto] = useState(false)

  const [somEscolhido, setSomEscolhido] = useState("");

  function tocarSom(){
    const audio = new Audio("/sons/Pop.mp3");
    audio.play();
  }

  function trocarFase() {
    tocarSom();

    if (fase === "Foco") {
      if (ciclos === 3) {
        setFase("Pausa longa")
        setTempoRestante(tempoPausaLonga)
        setCiclos(0)
      }
      else {
        setFase("Pausa curta")
        setTempoRestante(tempoPausaCurta)
        setCiclos(ciclos + 1)
      }
    }
    else if (fase === "Pausa curta") {
      setFase("Foco")
      setTempoRestante(tempoFoco)
    }
    else if (fase === "Pausa longa") {
      setFase("Foco")
      setTempoRestante(tempoFoco)
    }
  
  }

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60)
    const s = segundos % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    let intervalo

    if (rodando) {
      intervalo = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev > 0){
            return prev - 1;
          } else {
            trocarFase();
            return prev;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalo)
  }, [rodando, fase]);

  // Mudanças automáticas de fase
  useEffect(() => {
    if (tempoRestante === 0) {
      trocarFase()
    }
  }, [tempoRestante]);

  // Efeito para tocar som
  useEffect(() => {
    if (somEscolhido) {
      const audio = new Audio(somEscolhido);
      audio.loop = true; // Define o áudio para repetir
      audio.play();

      return () => audio.pause(); //Pausa o áudio ao trocar
    }
  }, [somEscolhido]);
  
  return (
    <div className={styles.home}>

      <div className={styles.timer}>
        <h1> {formatarTempo(tempoRestante)} </h1>
        <h2>Fase atual: {fase} </h2>
        <h2>Ciclos: {ciclos} </h2>
      </div>

      <div className={styles.botoes}>
        <button onClick={() => setRodando(true)}>Iniciar</button>
        <button onClick={() => setRodando(false)}>Pausar</button>
        <button onClick={() => {
          setRodando(false)
          setFase("Foco")
          setTempoRestante(25 * 60)
          setCiclos(0)  
        }}>Reiniciar</button>
        <button onClick={() => setModalAberto(true)}>Configurações</button>
        <button onClick={trocarFase}>Trocar Fase</button>
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

            <button onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}


    </div>
  );
}
