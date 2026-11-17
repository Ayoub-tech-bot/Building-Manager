import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to Moroccan Dirham (DH)
 * @param {number|string} amount
 * @returns {string} e.g. "21 900 DH"
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '0 DH';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 DH';
  
  // Format with French space grouping
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);

  return `${formatted} DH`;
}

/**
 * Format YearMonth string ("2026-10") or Date to French Month Year ("Octobre 2026")
 */
export function formatPeriod(period) {
  if (!period) return '';
  try {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  } catch {
    return period;
  }
}

/**
 * Format date string ("2026-10-15") to "15 oct." or full "15 octobre 2026"
 */
export function formatDate(dateString, { full = false } = {}) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (full) {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

