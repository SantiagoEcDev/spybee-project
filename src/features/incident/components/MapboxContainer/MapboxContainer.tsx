"use client";

import { useEffect, useState } from "react";
import MapboxMap from "@/shared/components/MapboxMap/MapboxMap";
import MapboxMapToolBar from "@/features/incident/components/MapBoxToolbar/MapboxMapToolBar";
import Modal from "@/shared/components/Modal/Modal";
import { useIncidentStore } from "@/features/incident/stores/incidentStore";
import IncidentForm from "@/features/incident/components/IncidentForm/IncidentForm";


const MapboxContainer = () => {
  const [isAdding, setIsAdding] = useState(false);

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { incidents, fetchIncidents } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

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
      <MapboxMap
        isAdding={isAdding}
        onMapClick={handleMapClick}
        incidents={incidents}

      />

      <MapboxMapToolBar
        isAddingIncident={isAdding}
        onToggleAddIncident={() => setIsAdding((prev) => !prev)}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <IncidentForm
          onClose={handleCloseModal}
          incidents={incidents}
          coordinates={coords}
        />
      </Modal>
    </>
  );
};

export default MapboxContainer;
