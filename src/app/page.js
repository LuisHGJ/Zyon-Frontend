"use client"

import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import { useRef } from "react";

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

  // Som ambiente
  const [somEscolhido, setSomEscolhido] = useState("");
  const audioRef = useRef(null);

  // Lista de sons disponíveis
  const sonsDisponiveis = [
    { nome: "Chuva", caminho: "/sons/rain.mp3" },
    { nome: "Passáros", caminho: "/sons/birds.mp3" },
    { nome: "Noite", caminho: "/sons/night-ambience.mp3" },
    { nome: "Rua", caminho: "/sons/street-ambience-traffic.mp3" },
    { nome: "Floresta", caminho: "/sons/forest-ambience.mp3" },
  ]

  // Ciclo completo
  const fasesDoCiclo = ["Foco", "Pausa curta", "Foco", "Pausa curta", "Foco", "Pausa longa"];

  function tempoDaFase(fase) {
    if (fase === "Foco") return tempoFoco;
    else if (fase === "Pausa curta") return tempoPausaCurta;
    else if (fase === "Pausa longa") return tempoPausaLonga;
    return 0;
  }

  function formatarTempo(segundos) {
    const m = Math.floor(segundos / 60)
    const s = segundos % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

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

  // Atualiza automaticamente o tempo quando muda a fase ou os tempos
  useEffect(() => {
    setTempoRestante(tempoDaFase(fase));
  }, [tempoFoco, tempoPausaCurta, tempoPausaLonga, fase]);

  // Contagem regressiva
  useEffect(() => {
    if (!rodando) return;

    const intervalo = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [rodando]);

  // Trocar de fase quando o tempo acabar
  useEffect(() => {
    if (tempoRestante < 0) {
      trocarFase();
    }
  }, [tempoRestante]);

  //Controle do som ambiente
  useEffect(() => {
    if (!somEscolhido) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      return;
    }

    const newSrc = new URL(somEscolhido, window.location.href).href;

    if (!audioRef.current || audioRef.current.src !== newSrc) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current = new Audio(newSrc);
        audioRef.current.loop = true;
    }

    if (rodando) {
      audioRef.current.play().catch(err => 
        console.warn("Erro ao tocar o áudio:", err)
      );
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [somEscolhido, rodando]);

  
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

      <div className={styles.seletorSom}>
        <label>
          Som ambiente:
          <select 
            value={somEscolhido}
            onChange={(e) => setSomEscolhido(e.target.value)}
          >
            <option value="">Nenhum</option>
            {sonsDisponiveis.map((som) => (
              <option key={som.caminho} value={som.caminho}>{som.nome}</option>
            ))}
          </select>
        </label>
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
