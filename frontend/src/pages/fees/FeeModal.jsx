import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { Receipt, Calendar, Hash, DollarSign, Tag } from 'lucide-react';

const FEE_TYPES = [
  { value: 'MONTHLY_CHARGE', label: 'Charge mensuelle de copropriété' },
  { value: 'SPECIAL_ASSESSMENT', label: 'Appel de fonds exceptionnel / Travaux' },
  { value: 'MAINTENANCE', label: 'Frais de maintenance / Réparation' },
  { value: 'OTHER', label: 'Autre charge' },
];

const FEE_STATUSES = [
  { value: 'UNPAID', label: 'En retard / Impayé' },
  { value: 'IN_PROGRESS', label: 'Paiement partiel en cours' },
  { value: 'PAID', label: 'Réglé intégralement' },
  { value: 'CANCELLED', label: 'Annulé' },
];

export default function FeeModal({
  isOpen,
  onClose,
  onSubmit,
  feeToEdit = null,
  apartmentsList = [],
  isLoading = false,
}) {
  const isEditing = Boolean(feeToEdit);

  const [formData, setFormData] = useState({
    apartmentId: '',
    period: new Date().toISOString().slice(0, 7), // "YYYY-MM"
    amount: '',
    type: 'MONTHLY_CHARGE',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15))
      .toISOString()
      .split('T')[0],
    status: 'UNPAID',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (feeToEdit) {
      setFormData({
        apartmentId: feeToEdit.apartmentId || '',
        period: feeToEdit.period || new Date().toISOString().slice(0, 7),
        amount: feeToEdit.amount || '',
        type: feeToEdit.type || 'MONTHLY_CHARGE',
        dueDate: feeToEdit.dueDate || '',
        status: feeToEdit.status || 'UNPAID',
      });
    } else {
      setFormData({
        apartmentId: apartmentsList.length > 0 ? apartmentsList[0].id : '',
        period: new Date().toISOString().slice(0, 7),
        amount: '600',
        type: 'MONTHLY_CHARGE',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15))
          .toISOString()
          .split('T')[0],
        status: 'UNPAID',
      });
    }
    setErrors({});
  }, [feeToEdit, apartmentsList, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.apartmentId) {
      newErrors.apartmentId = 'Veuillez sélectionner un appartement';
    }
    if (!formData.period || !/^\d{4}-\d{2}$/.test(formData.period)) {
      newErrors.period = 'La période doit être au format AAAA-MM (ex: 2026-10)';
    }
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Le montant doit être un nombre positif supérieur à 0';
    }
    if (!formData.type) {
      newErrors.type = 'Le type de charge est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      apartmentId: Number(formData.apartmentId),
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier la charge' : 'Émettre un appel de charge'}
      subtitle="Affectez la charge à un lot et définissez le montant et l'échéance."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Apartment Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Appartement / Lot concerné *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Hash size={15} />
            </div>
            <select
              value={formData.apartmentId}
              onChange={(e) =>
                setFormData({ ...formData, apartmentId: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.apartmentId
                  ? 'border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            >
              <option value="">-- Sélectionner l'appartement --</option>
              {apartmentsList.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  Lot {apt.unitNumber} ({apt.sizeM2} m²
                  {apt.currentOwner ? ` · ${apt.currentOwner.username}` : ' · Vacant'})
                </option>
              ))}
            </select>
          </div>
          {errors.apartmentId && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.apartmentId}</p>
          )}
        </div>

        {/* Period (YearMonth) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Période (Mois) *
            </label>
            <div className="relative">
              <input
                type="month"
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                  errors.period
                    ? 'border-[#BA372A] focus:ring-[#BA372A]'
                    : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
                }`}
              />
            </div>
            {errors.period && (
              <p className="text-[11px] text-[#BA372A] mt-1">{errors.period}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Date d'échéance
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            />
          </div>
        </div>

        {/* Amount in DH */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Montant de la charge (DH) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <DollarSign size={15} />
            </div>
            <input
              type="number"
              step="1"
              min="1"
              placeholder="Ex: 600"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.amount
                  ? 'border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Charge Type */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Type de charge *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
          >
            {FEE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        {isEditing && (
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Statut de la charge
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            >
              {FEE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

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
              ? 'Traitement...'
              : isEditing
              ? 'Mettre à jour'
              : 'Émettre la charge'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
