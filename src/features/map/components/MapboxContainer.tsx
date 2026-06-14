"use client";

import { useState } from "react";
import MapboxMap from "@/shared/components/MapboxMap/components/MapboxMap";
import MapboxMapToolBar from "@/shared/components/MapboxMap/components/MapboxMapToolBar";
import Modal from "@/shared/components/Modal/Modal";

const MapboxContainer = () => {
  const [isAdding, setIsAdding] = useState(false);

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    if (!isAdding) return;

    setCoords({ lat, lng });
    setIsModalOpen(true);
    setIsAdding(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCoords(null);
  };

  return (
    <>
      <MapboxMap isAdding={isAdding} onMapClick={handleMapClick} />

      <MapboxMapToolBar
        isAddingIncident={isAdding}
        onToggleAddIncident={() => setIsAdding((prev) => !prev)}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>New Incident</h2>
      </Modal>
    </>
  );
};

export default MapboxContainer;
