import styles from "./controles.module.css";
import play from "/public/icones/play.png";
import pause from "/public/icones/pause.png";
import next from "/public/icones/next.png";
import restart from "/public/icones/restart.png";

import Image from "next/image";

export default function Controles({ rodando, setRodando, trocarFase, reiniciar }) {

    return (
      <div className={styles.botoesPomodoro}>

        <Image
          src={restart}
          alt="restart"
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={reiniciar}
        />

        <Image
          src={rodando ? pause : play}
          alt={rodando ? "Pause" : "Play"}
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={() => setRodando(!rodando)}
        />

        <Image
          src={next}
          alt="next"
          className={styles.btPlay}
          width={50}
          height={50}
          onClick={trocarFase}
        />
      </div>
    );
}