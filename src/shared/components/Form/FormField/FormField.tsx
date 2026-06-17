import styles from "./FormField.module.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

export default function FormField({
  label,
  children,
  error,
  required = false,
}: FormFieldProps) {
  return (
    <div className={styles.formField}>
      <label className={required ? styles.required : ""}>{label}</label>

      {children}

      <ErrorMessage message={error} />
    </div>
  );
}
