import styles from "./WelcomePage.module.scss";
import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.bee}>🐝</div>

        <h1 className={styles.title}>
          Bienvenido a <span>SpyBee</span>
        </h1>

        <p className={styles.subtitle}>
          Inteligencia, velocidad y precisión en cada movimiento.
        </p>

        <Link href="/dashboard" className={styles.linkButton}>
          Entrar al dashboard
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
