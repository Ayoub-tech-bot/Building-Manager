import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { Receipt, Calendar, DollarSign, Layers } from 'lucide-react';

export default function GenerateFeesModal({
  isOpen,
  onClose,
  apartmentsList = [],
  onSubmit,
  isLoading = false,
}) {
  const [period, setPeriod] = useState(() => {
    return new Date().toISOString().slice(0, 7); // "YYYY-MM"
  });
  const [calculationMode, setCalculationMode] = useState('FIXED'); // 'FIXED' or 'SURFACE'
  const [fixedAmount, setFixedAmount] = useState('600');
  const [ratePerM2, setRatePerM2] = useState('7'); // 7 DH/m²
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare array of fees for each apartment
    const generatedFees = apartmentsList.map((apt) => {
      let amount = parseFloat(fixedAmount) || 600;
      if (calculationMode === 'SURFACE') {
        const rate = parseFloat(ratePerM2) || 7;
        amount = Math.round((Number(apt.sizeM2) || 80) * rate);
      }

      return {
        apartmentId: apt.id,
        period,
        amount,
        type: 'MONTHLY_CHARGE',
        dueDate,
        status: 'UNPAID',
      };
    });

    onSubmit(generatedFees, period);
  };

  const sampleApartment = apartmentsList[0] || { unitNumber: 'A-12', sizeM2: 86 };
  const estimatedAmount =
    calculationMode === 'FIXED'
      ? parseFloat(fixedAmount) || 0
      : Math.round((Number(sampleApartment.sizeM2) || 80) * (parseFloat(ratePerM2) || 7));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Générer les charges mensuelles"
      subtitle={`Émission automatique pour les ${apartmentsList.length} lots de la résidence.`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Period */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Période d'appel de charges (Mois) *
          </label>
          <div className="relative">
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            />
          </div>
        </div>

        {/* Calculation Mode */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Méthode de calcul
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCalculationMode('FIXED')}
              className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                calculationMode === 'FIXED'
                  ? 'border-[#1E392A] bg-[#E8F2EC] text-[#1E392A] font-semibold'
                  : 'border-[#DDD9C5] bg-white text-[#525E54] hover:bg-[#FAF9F5]'
              }`}
            >
              Forfait fixe par lot
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('SURFACE')}
              className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                calculationMode === 'SURFACE'
                  ? 'border-[#1E392A] bg-[#E8F2EC] text-[#1E392A] font-semibold'
                  : 'border-[#DDD9C5] bg-white text-[#525E54] hover:bg-[#FAF9F5]'
              }`}
            >
              Au prorata de surface (m²)
            </button>
          </div>
        </div>

        {/* Amount Input based on mode */}
        {calculationMode === 'FIXED' ? (
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Montant forfaitaire par appartement (DH)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
                <DollarSign size={15} />
              </div>
              <input
                type="number"
                step="1"
                min="1"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Tarif par m² (DH / m²)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
                <DollarSign size={15} />
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={ratePerM2}
                onChange={(e) => setRatePerM2(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
              />
            </div>
          </div>
        )}

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Date limite de paiement
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
          />
        </div>

        {/* Summary Box */}
        <div className="p-3.5 rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-xs">
          <div className="flex items-center justify-between text-[#556257]">
            <span>Lots impactés :</span>
            <span className="font-semibold text-[#18201B]">{apartmentsList.length} appartements</span>
          </div>
          <div className="flex items-center justify-between text-[#556257] mt-1.5">
            <span>Exemple (Lot {sampleApartment.unitNumber}) :</span>
            <span className="font-bold text-[#1E392A]">{estimatedAmount} DH</span>
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
            {isLoading ? 'Génération en cours...' : `Générer pour ${apartmentsList.length} lots`}
          </button>
        </div>
      </form>
    </Modal>
  );
}

