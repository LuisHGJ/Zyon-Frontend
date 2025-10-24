"use client";

import React from "react";
import styles from "./opcaoUser.module.css";

export default function OpcaoUser() {
    return (
        <div className={styles.containerUser}>
            <div className={styles.card}>
                <h1 className={styles.title}>Escolha uma opção</h1>
                <div className={styles.buttonContainer}>
                    <button onClick={() => window.location.href = '/opcaoUser/login'} className={styles.login}>Login</button>
                    <button onClick={() => window.location.href = '/opcaoUser/cadastro'} className={styles.cadastro}>Cadastro</button>
                </div>
            </div>
        </div>
    )
}