"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CustomDatePicker.module.scss";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function CustomDatePicker({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      placeholderText={placeholder}
      className={styles.input}
      dateFormat="yyyy-MM-dd"
    />
  );
}
