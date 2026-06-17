import styles from "./ErrorMessage.module.scss";

type ErrorMessageProps = {
  message: string | undefined;
};

const ErrorMessage = (props: ErrorMessageProps) => {
  return <div className={styles.errorMessage}>{props.message}</div>;
};

export default ErrorMessage;
