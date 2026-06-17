import styles from "./Form.module.scss";

interface FormProps {
  title: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
}

const Form = ({ title, children, onSubmit }: FormProps) => {
  return (
    <div className={styles.form}>
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>{children}</form>
    </div>
  );
};

export default Form;
