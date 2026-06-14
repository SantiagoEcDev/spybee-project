"use client";

import {
  IoAddOutline,
  IoLocationOutline,
  IoGitNetworkOutline,
  IoShapesOutline,
  IoResizeOutline,
  IoLayersOutline,
  IoSearchOutline,
  IoSettingsOutline,
} from "react-icons/io5";

import styles from "../styles/MapboxMapToolBar.module.scss";

interface MapboxMapToolBarProps {
  isAddingIncident: boolean;
  onToggleAddIncident: () => void;
}

const MapboxMapToolBar = ({
  isAddingIncident,
  onToggleAddIncident,
}: MapboxMapToolBarProps) => {
  const tools = [
    {
      id: "incident",
      icon: IoAddOutline,
      label: "Agregar incidente",
      onClick: onToggleAddIncident,
      isActive: isAddingIncident,
      isDisabled: false,
    },
    {
      id: "marker",
      icon: IoLocationOutline,
      label: "Agregar marcador",
      isDisabled: true,
    },
    {
      id: "route",
      icon: IoGitNetworkOutline,
      label: "Trazar ruta",
      isDisabled: true,
    },
    {
      id: "polygon",
      icon: IoShapesOutline,
      label: "Dibujar polígono",
      isDisabled: true,
    },
    {
      id: "measure",
      icon: IoResizeOutline,
      label: "Medir distancia",
      isDisabled: true,
    },
    {
      id: "layers",
      icon: IoLayersOutline,
      label: "Capas",
      isDisabled: true,
    },
    {
      id: "search",
      icon: IoSearchOutline,
      label: "Buscar ubicación",
      isDisabled: true,
    },
    {
      id: "settings",
      icon: IoSettingsOutline,
      label: "Configuración",
      isDisabled: true,
    },
  ];

  return (
    <aside className={styles.toolbar}>
      {tools.map(
        ({ id, icon: Icon, label, onClick, isActive, isDisabled }, index) => (
          <div key={id} className={styles.toolContainer}>
            {index === 4 && <div className={styles.separator} />}

            <button
              type="button"
              className={`${styles.button} ${isActive ? styles.active : ""}`}
              onClick={onClick}
              disabled={isDisabled}
              aria-label={label}
              title={label}
            >
              <Icon />
            </button>
          </div>
        ),
      )}
    </aside>
  );
};

export default MapboxMapToolBar;
