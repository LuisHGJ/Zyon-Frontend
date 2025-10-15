"use client"

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

    </div>
  );
}
