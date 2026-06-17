import styles from "./CategoryOptions.module.scss";

type CategoryColorProps = {
  categoryColor: string;
};

const CategoryColor = (props: CategoryColorProps) => {
  return (
    <div className={styles.categoryColor}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: props.categoryColor,
          display: "inline-block",
        }}
      />
    </div>
  );
};

export default CategoryColor;
