import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { UserCheck, ArrowRightLeft, Calendar, User } from 'lucide-react';

export default function AssignOwnerModal({
  isOpen,
  onClose,
  apartment,
  currentOwner,
  ownersList = [],
  onSubmit,
  isLoading = false,
}) {
  const isTransfer = Boolean(currentOwner);

  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [transferDate, setTransferDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedOwnerId('');
    setTransferDate(new Date().toISOString().split('T')[0]);
    setError('');
  }, [apartment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOwnerId) {
      setError('Veuillez sélectionner un copropriétaire');
      return;
    }

    if (currentOwner && selectedOwnerId === currentOwner.id) {
      setError('Le nouveau propriétaire doit être différent du propriétaire actuel');
      return;
    }

    onSubmit({
      apartmentId: apartment.id,
      ownerId: selectedOwnerId,
      transferDate: isTransfer ? transferDate : undefined,
      isTransfer,
    });
  };

  if (!apartment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isTransfer
          ? `Transférer la propriété de l'appartement ${apartment.unitNumber}`
          : `Assigner un propriétaire à l'appartement ${apartment.unitNumber}`
      }
      subtitle={`Lot de ${apartment.sizeM2} m² · Résidence Les Oliviers`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Owner Info Box */}
        {isTransfer ? (
          <div className="p-3.5 rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-xs">
            <span className="text-[10px] font-bold text-[#79857A] tracking-wider uppercase block mb-1">
              Propriétaire actuel
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs">
                {currentOwner.username ? currentOwner.username.substring(0, 2).toUpperCase() : 'PR'}
              </div>
              <div>
                <div className="font-semibold text-[#18201B]">
                  {currentOwner.username}
                </div>
                <div className="text-[11px] text-[#6E7B70]">
                  {currentOwner.email}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-[#EAE7D8] bg-[#FDFDFC] text-xs text-[#5D6B5F]">
            Cet appartement est actuellement vacant. Assignez son premier propriétaire officiel.
          </div>
        )}

        {/* New Owner Select */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            {isTransfer ? 'Nouveau propriétaire *' : 'Sélectionner le copropriétaire *'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <User size={15} />
            </div>
            <select
              value={selectedOwnerId}
              onChange={(e) => {
                setSelectedOwnerId(e.target.value);
                setError('');
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            >
              <option value="">-- Choisir dans la liste des propriétaires --</option>
              {ownersList.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.username} ({owner.email})
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-[11px] text-[#BA372A] mt-1">{error}</p>}
        </div>

        {/* Transfer Date (if transferring) */}
        {isTransfer && (
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Date d'effet du transfert
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
                <Calendar size={15} />
              </div>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
              />
            </div>
            <p className="text-[11px] text-[#788579] mt-1">
              L'historique des charges et paiements passés reste rattaché au compte de l'ancien propriétaire.
            </p>
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
            className="px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isTransfer ? (
              <>
                <ArrowRightLeft size={14} />
                <span>Confirmer le transfert</span>
              </>
            ) : (
              <>
                <UserCheck size={14} />
                <span>Assigner</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
