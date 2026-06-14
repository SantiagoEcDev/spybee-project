import Sidebar from "@/shared/components/Sidebar/Sidebar";
import Breadcrumb from "@/shared/components/Breadcrumb/Breadcrumb";
import styles from "./layout.module.scss";

const FullWidthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <Breadcrumb />
      </div>

      <div className={styles.container}>
        <Sidebar />

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default FullWidthLayout;
