import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { Building2, Layers, MapPin } from 'lucide-react';

export default function BuildingModal({
  isOpen,
  onClose,
  onSubmit,
  buildingToEdit = null,
  activeResidenceId = 1,
  activeResidenceName = 'Résidence Les Oliviers',
  isLoading = false,
}) {
  const isEditing = Boolean(buildingToEdit);

  const [formData, setFormData] = useState({
    name: '',
    floorsCount: 4,
    residenceId: activeResidenceId,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (buildingToEdit) {
      setFormData({
        name: buildingToEdit.name || '',
        floorsCount: buildingToEdit.floorsCount || 4,
        residenceId: buildingToEdit.residenceId || activeResidenceId,
      });
    } else {
      setFormData({
        name: '',
        floorsCount: 4,
        residenceId: activeResidenceId,
      });
    }
    setErrors({});
  }, [buildingToEdit, activeResidenceId, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'immeuble est requis (ex: Bâtiment A, Tour Sud)";
    }
    const floors = parseInt(formData.floorsCount, 10);
    if (isNaN(floors) || floors < 1) {
      newErrors.floorsCount = "Le nombre d'étages doit être d'au moins 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      floorsCount: parseInt(formData.floorsCount, 10),
      residenceId: Number(formData.residenceId),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier l'immeuble" : "Ajouter un immeuble / bâtiment"}
      subtitle="Définissez l'identifiant du bâtiment et sa volumétrie en étages."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Building Name */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Nom ou désignation de l'immeuble *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Building2 size={15} />
            </div>
            <input
              type="text"
              placeholder="Ex: Bâtiment A, Bloc B, Pavillon Ouest..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.name
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.name}</p>
          )}
        </div>

        {/* Floors Count */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Nombre d'étages (R + N) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Layers size={15} />
            </div>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="Ex: 4"
              value={formData.floorsCount}
              onChange={(e) =>
                setFormData({ ...formData, floorsCount: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.floorsCount
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.floorsCount && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.floorsCount}</p>
          )}
          <span className="text-[11px] text-[#788579] mt-1 block">
            Permet de valider la hauteur maximale lors de la création des appartements.
          </span>
        </div>

        {/* Residence context display */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Résidence de rattachement
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[#EAE7D8] bg-[#FAF9F5] text-xs text-[#525E54]">
            <MapPin size={15} className="text-[#7A877B]" />
            <span>{activeResidenceName} (ID: {activeResidenceId})</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE7D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DDD9C5] bg-white text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-colors disabled:opacity-50"
          >
            {isLoading
              ? 'Enregistrement...'
              : isEditing
              ? 'Mettre à jour'
              : "Créer l'immeuble"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
