"use client";

import styles from "./styles/Input.module.scss"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={styles.input} {...props} />
    </div>
  );
};

export default Input;
