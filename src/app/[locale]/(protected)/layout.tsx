import Sidebar from "@/shared/components/Sidebar/Sidebar";
import styles from "./layout.module.scss";

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
