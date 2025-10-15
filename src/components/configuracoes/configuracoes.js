import styles from "./configuracoes.module.css";
import configsIcon from "/public/icones/configsIcon.png";
import somIcon from "/public/icones/somIcon.png";
import userIcon from "/public/icones/userIcon.png";
import addUserIcon from "/public/icones/addUserIcon.png";
import calendarioIcon from "/public/icones/calendarioIcon.png";

import Calendario from "@/components/calendario/calendario";

import Image from "next/image";
import { useState, useRef } from "react";

export default function Configuracoes({
  tempoFoco, setTempoFoco,
  tempoPausaCurta, setTempoPausaCurta,
  tempoPausaLonga, setTempoPausaLonga,
  ciclosTotal, setCiclosTotal,
}) {
  const [somEscolhido, setSomEscolhido] = useState("");

  const [modalAbertoConfig, setModalAbertoConfig] = useState(false);
  const [modalAbertoSons, setModalAbertoSons] = useState(false);
  const [modalAbertoCalendario, setModalAbertoCalendario] = useState(false);

  const audioRef = useRef(null);

  const sonsDisponiveis = [
    { nome: "Chuva", caminho: "/sons/rain.mp3" },
    { nome: "Pássaros", caminho: "/sons/birds.mp3" },
    { nome: "Noite", caminho: "/sons/night-ambience.mp3" },
    { nome: "Rua", caminho: "/sons/street-ambience-traffic.mp3" },
    { nome: "Floresta", caminho: "/sons/forest-ambience.mp3" },
  ];

  function handleTestarSom() {
    if (!somEscolhido) return alert("Escolha um som primeiro.");

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(somEscolhido);
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(err => {
      console.warn("Erro ao tocar som:", err);
      alert("O navegador bloqueou a reprodução automática. Clique novamente para permitir.");
    });

    audioRef.current = audio;
  }

  function handlePararSom() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.botoesPomodoro}>
        <Image
          src={configsIcon}
          alt="configsIcon"
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={() => setModalAbertoConfig(true)}
        />

        <Image
          src={somIcon}
          alt="somIcon"
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={() => setModalAbertoSons(true)}
        />

        <Image
          src={calendarioIcon}
          alt="calendarioIcon"
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={() => setModalAbertoCalendario(true)}
        />

        <Image
          src={userIcon}
          alt="userIcon"
          className={styles.btPlay}
          width={50}
          height={50}
        />

        <Image
          src={addUserIcon}
          alt="addUserIcon"
          className={styles.btPlay}
          width={50}
          height={50}
        />
      </div>

      {modalAbertoConfig && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <h2>Configurações do Pomodoro</h2>

            <label>
              Foco (min):
              <input
                type="number"
                value={tempoFoco / 60}
                onChange={(e) => setTempoFoco(Number(e.target.value) * 60)}
              />
            </label>

            <label>
              Pausa Curta (min):
              <input
                type="number"
                value={tempoPausaCurta / 60}
                onChange={(e) => setTempoPausaCurta(Number(e.target.value) * 60)}
              />
            </label>

            <label>
              Pausa Longa (min):
              <input
                type="number"
                value={tempoPausaLonga / 60}
                onChange={(e) => setTempoPausaLonga(Number(e.target.value) * 60)}
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

            <button onClick={() => setModalAbertoConfig(false)}>Fechar</button>
          </div>
        </div>
      )}

      {modalAbertoSons && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>
            <div className={styles.seletorSom}>
              <label>
                Som ambiente:
                <select
                  value={somEscolhido}
                  onChange={(e) => setSomEscolhido(e.target.value)}
                >
                  <option value="">Nenhum</option>
                  {sonsDisponiveis.map((som) => (
                    <option key={som.caminho} value={som.caminho}>
                      {som.nome}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <button onClick={handleTestarSom}>Tocar</button>
                <button onClick={handlePararSom}>Parar</button>
                <button onClick={() => setModalAbertoSons(false)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAbertoCalendario && (
        <div className={styles.modalFundo}>
          <div className={styles.modalConteudo}>

            <Calendario/>

            <button onClick={() => setModalAbertoCalendario(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
