import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { Building, Hash, Maximize2 } from 'lucide-react';

export default function ApartmentModal({
  isOpen,
  onClose,
  onSubmit,
  apartmentToEdit = null,
  activeResidenceId = 1,
  isLoading = false,
}) {
  const isEditing = Boolean(apartmentToEdit);

  const [formData, setFormData] = useState({
    unitNumber: '',
    sizeM2: '',
    residenceId: activeResidenceId,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (apartmentToEdit) {
      setFormData({
        unitNumber: apartmentToEdit.unitNumber || '',
        sizeM2: apartmentToEdit.sizeM2 || '',
        residenceId: apartmentToEdit.residenceId || activeResidenceId,
      });
    } else {
      setFormData({
        unitNumber: '',
        sizeM2: '',
        residenceId: activeResidenceId,
      });
    }
    setErrors({});
  }, [apartmentToEdit, activeResidenceId, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.unitNumber.trim()) {
      newErrors.unitNumber = "Le numéro d'appartement est requis (ex: A-12)";
    }
    const size = parseFloat(formData.sizeM2);
    if (!formData.sizeM2 || isNaN(size) || size <= 0) {
      newErrors.sizeM2 = 'La surface doit être un nombre positif supérieur à 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      unitNumber: formData.unitNumber.trim(),
      sizeM2: parseFloat(formData.sizeM2),
      residenceId: Number(formData.residenceId),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier l\'appartement' : 'Ajouter un appartement'}
      subtitle="Renseignez le numéro de lot et sa surface privative en m²."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unit Number */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Numéro d'appartement / Lot *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Hash size={15} />
            </div>
            <input
              type="text"
              placeholder="Ex: A-12, B-04..."
              value={formData.unitNumber}
              onChange={(e) =>
                setFormData({ ...formData, unitNumber: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.unitNumber
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.unitNumber && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.unitNumber}</p>
          )}
        </div>

        {/* Size M2 */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Surface privative (m²) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Maximize2 size={15} />
            </div>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="Ex: 86.5"
              value={formData.sizeM2}
              onChange={(e) =>
                setFormData({ ...formData, sizeM2: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.sizeM2
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.sizeM2 && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.sizeM2}</p>
          )}
        </div>

        {/* Residence ID (Hidden / Display Only) */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Résidence de rattachement
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[#EAE7D8] bg-[#FAF9F5] text-xs text-[#525E54]">
            <Building size={15} className="text-[#7A877B]" />
            <span>Résidence Les Oliviers (ID: {activeResidenceId})</span>
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
              : 'Créer l\'appartement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
