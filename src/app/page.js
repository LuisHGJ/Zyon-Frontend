"use client"

import { useEffect, useState } from "react";

import styles from "./page.module.css";

import SidebarTasks from "@/components/sidebarTasks/sideBarTasks";
import TimerBox from "@/components/TimerBox/timerBox";
import Configuracoes from "@/components/configuracoes/configuracoes";
import Ranking from "@/components/ranking/ranking";

export default function Home() {
  
  const [tempoFoco, setTempoFoco] = useState(25 * 60);
  const [tempoPausaCurta, setTempoPausaCurta] = useState(5 * 60);
  const [tempoPausaLonga, setTempoPausaLonga] = useState(15 * 60);
  const [ciclosTotal, setCiclosTotal] = useState(2);
  const [rodando, setRodando] = useState(false);

  console.log("Token:", localStorage.getItem("token"));
  console.log("ID:", localStorage.getItem("id"));

  const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/opcaoUser/login";
    }

  return (
    <div className={styles.home}>
      <div className={styles.mainWrapper}>
        <div className={styles.leftColumn}>
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

          <SidebarTasks/>
          {/* <Ranking/> */}
        </div>
        <div className={styles.rightColumn}>
          <Ranking/>
        </div>
      </div>
    </div>
  );
}
