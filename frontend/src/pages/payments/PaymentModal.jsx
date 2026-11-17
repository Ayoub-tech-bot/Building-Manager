import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { CreditCard, DollarSign, Calendar, Hash, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Virement bancaire' },
  { value: 'CARD', label: 'Carte bancaire (TPE / En ligne)' },
  { value: 'CASH', label: 'Espèces (Reçu manuel)' },
  { value: 'OTHER', label: 'Chèque / Autre' },
];

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  feesList = [],
  preselectedFee = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    feeId: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: new Date().toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (preselectedFee) {
      const remaining = preselectedFee.outstandingBalance ?? preselectedFee.amount;
      setFormData({
        feeId: preselectedFee.id.toString(),
        amount: remaining.toString(),
        paymentMethod: 'BANK_TRANSFER',
        paymentDate: new Date().toISOString().slice(0, 16),
      });
    } else if (feesList.length > 0) {
      const defaultFee = feesList[0];
      const remaining = defaultFee.outstandingBalance ?? defaultFee.amount;
      setFormData({
        feeId: defaultFee.id.toString(),
        amount: remaining.toString(),
        paymentMethod: 'BANK_TRANSFER',
        paymentDate: new Date().toISOString().slice(0, 16),
      });
    }
    setErrors({});
  }, [preselectedFee, feesList, isOpen]);

  const selectedFee =
    feesList.find((f) => f.id.toString() === formData.feeId.toString()) ||
    preselectedFee;

  const validate = () => {
    const newErrors = {};
    if (!formData.feeId) {
      newErrors.feeId = 'Veuillez sélectionner un appel de charge';
    }
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Le montant doit être un nombre positif supérieur à 0';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Le mode de paiement est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      feeId: Number(formData.feeId),
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      apartmentId: selectedFee?.apartmentId,
      paymentDate: formData.paymentDate ? `${formData.paymentDate}:00` : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enregistrer un paiement"
      subtitle="Saisie du règlement et affectation automatique au solde de la charge."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fee Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Appel de charge à solder *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Hash size={15} />
            </div>
            <select
              value={formData.feeId}
              onChange={(e) => {
                const newFeeId = e.target.value;
                const found = feesList.find((f) => f.id.toString() === newFeeId);
                const remaining = found ? (found.outstandingBalance ?? found.amount) : '';
                setFormData({
                  ...formData,
                  feeId: newFeeId,
                  amount: remaining.toString(),
                });
              }}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.feeId
                  ? 'border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            >
              <option value="">-- Sélectionner la charge --</option>
              {feesList.map((fee) => (
                <option key={fee.id} value={fee.id}>
                  Lot {fee.apartmentUnit || `Apt #${fee.apartmentId}`} · {fee.period} (Reste : {formatCurrency(fee.outstandingBalance ?? fee.amount)})
                </option>
              ))}
            </select>
          </div>
          {errors.feeId && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.feeId}</p>
          )}
        </div>

        {/* Selected Fee Balance Recap */}
        {selectedFee && (
          <div className="p-3.5 rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-xs space-y-1">
            <div className="flex items-center justify-between text-[#5E6B60]">
              <span>Charge totale ({selectedFee.period}) :</span>
              <span className="font-semibold text-[#18201B]">
                {formatCurrency(selectedFee.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5E6B60]">
              <span>Reste dû actuellement :</span>
              <span className="font-bold text-[#BA372A]">
                {formatCurrency(selectedFee.outstandingBalance ?? selectedFee.amount)}
              </span>
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Montant réglé (DH) *
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

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Moyen de paiement *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <CreditCard size={15} />
            </div>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Date & Time */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Date et heure du versement
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Calendar size={15} />
            </div>
            <input
              type="datetime-local"
              value={formData.paymentDate}
              onChange={(e) =>
                setFormData({ ...formData, paymentDate: e.target.value })
              }
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            />
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
            className="px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 size={15} />
            <span>{isLoading ? 'Enregistrement...' : 'Valider le paiement'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

