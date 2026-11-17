import React from 'react';
import Modal from '../../components/common/Modal';
import { Mail, Phone, Building, Home, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function OwnerDetailsModal({
  isOpen,
  onClose,
  owner,
  apartments = [],
  onAssignApartment,
}) {
  if (!owner) return null;

  const initials = owner.username
    ? owner.username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'PR';

  const totalOwnedArea = apartments.reduce(
    (sum, a) => sum + (Number(a.sizeM2) || 0),
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fiche Copropriétaire"
      subtitle="Coordonnées, lots rattachés et état des droits de vote"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Profile Card */}
        <div className="p-4 rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-sm tracking-wider shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-[#18201B] truncate">
                {owner.username}
              </h4>
              <span className="px-2 py-0.5 rounded-full border border-[#D5D1BD] bg-white text-[#3C473E] font-medium text-[10px]">
                Copropriétaire
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F7B70] mt-1">
              <a
                href={`mailto:${owner.email}`}
                className="flex items-center gap-1 hover:text-[#1E392A] hover:underline"
              >
                <Mail size={13} />
                <span>{owner.email}</span>
              </a>
              {owner.phoneNumber && (
                <a
                  href={`tel:${owner.phoneNumber}`}
                  className="flex items-center gap-1 hover:text-[#1E392A] hover:underline"
                >
                  <Phone size={13} />
                  <span>{owner.phoneNumber}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Owned Lots Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#79857A]">
              Lots & Appartements possédés ({apartments.length})
            </span>
            <span className="text-xs font-semibold text-[#18201B]">
              Total surface : {totalOwnedArea} m²
            </span>
          </div>

          {apartments.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-[#DDD9C5] text-center text-xs text-[#7F8B80]">
              Aucun appartement n'est actuellement rattaché à ce compte.
            </div>
          ) : (
            <div className="space-y-2">
              {apartments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-xl border border-[#EAE7D8] bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded border border-[#DDD9C5] bg-[#F7F6F1] font-bold text-[#18201B]">
                      {apt.unitNumber}
                    </span>
                    <div>
                      <div className="font-semibold text-[#18201B]">
                        Appartement {apt.unitNumber}
                      </div>
                      <div className="text-[11px] text-[#717E73]">
                        {apt.sizeM2} m² · Résidence Les Oliviers
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-[#1E392A] bg-[#E8F2EC] px-2 py-0.5 rounded">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE7D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DDD9C5] bg-white text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
