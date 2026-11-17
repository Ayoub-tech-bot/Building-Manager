import React from 'react';
import { cn } from '../../utils/formatters';

const BADGE_VARIANTS = {
  // Late / Unpaid
  late: 'bg-[#FBEBE8] text-[#BA372A] border border-[#F5CBC4]',
  unpaid: 'bg-[#FBEBE8] text-[#BA372A] border border-[#F5CBC4]',
  UNPAID: 'bg-[#FBEBE8] text-[#BA372A] border border-[#F5CBC4]',

  // Partial / In progress fee
  partial: 'bg-[#FBF1E6] text-[#9E621E] border border-[#F5DFBF]',
  in_progress: 'bg-[#FBF1E6] text-[#9E621E] border border-[#F5DFBF]',
  IN_PROGRESS: 'bg-[#FBF1E6] text-[#9E621E] border border-[#F5DFBF]',

  // Paid / Settled
  paid: 'bg-[#E8F2EC] text-[#1F6B43] border border-[#C6E2D1]',
  PAID: 'bg-[#E8F2EC] text-[#1F6B43] border border-[#C6E2D1]',
  regle: 'bg-[#E8F2EC] text-[#1F6B43] border border-[#C6E2D1]',

  // Service ticket / Intervention status
  ongoing: 'bg-[#EAF2F1] text-[#256660] border border-[#C4E1DE]',
  EN_COURS: 'bg-[#EAF2F1] text-[#256660] border border-[#C4E1DE]',

  // Authorization / Pending review
  pending: 'bg-[#F8EFE4] text-[#8A5F26] border border-[#EEDEC8]',
  TO_EXAMINE: 'bg-[#F8EFE4] text-[#8A5F26] border border-[#EEDEC8]',

  // Default neutral
  neutral: 'bg-[#EFEFEA] text-[#555C56] border border-[#DFDFD6]',
};

const DEFAULT_LABELS = {
  late: 'En retard',
  unpaid: 'En retard',
  UNPAID: 'En retard',
  partial: 'Partiel',
  in_progress: 'Partiel',
  IN_PROGRESS: 'Partiel',
  paid: 'Réglé',
  PAID: 'Réglé',
  regle: 'Réglé',
  ongoing: 'En cours',
  EN_COURS: 'En cours',
  pending: 'À examiner',
  TO_EXAMINE: 'À examiner',
};

export default function StatusBadge({ status, label, className = '' }) {
  const variantClass = BADGE_VARIANTS[status] || BADGE_VARIANTS.neutral;
  const displayLabel = label || DEFAULT_LABELS[status] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide',
        variantClass,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

