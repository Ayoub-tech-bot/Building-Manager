import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  Download,
  Trash2,
  RefreshCw,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import PaymentModal from './PaymentModal';
import { paymentApi } from '../../api/paymentApi';
import { feeApi } from '../../api/feeApi';
import { apartmentApi } from '../../api/apartmentApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useDemoAuth } from '../../context/DemoAuthContext';

const INITIAL_DEMO_PAYMENTS = [
  {
    id: 1,
    feeId: 6,
    apartmentUnit: 'C-02',
    residentName: 'Amina Chraïbi',
    amount: 600,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: '2026-10-15T18:20:00',
    recordedBy: 'Saisi par Nora',
    period: '2026-10',
  },
  {
    id: 2,
    feeId: 7,
    apartmentUnit: 'B-07',
    residentName: 'Mehdi Amrani',
    amount: 600,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: '2026-10-14T11:45:00',
    recordedBy: 'Saisi par Nora',
    period: '2026-10',
  },
  {
    id: 3,
    feeId: 5,
    apartmentUnit: 'A-12',
    residentName: 'Karim El Amrani',
    amount: 300,
    paymentMethod: 'CARD',
    paymentDate: '2026-10-08T09:30:00',
    recordedBy: 'Saisi par Nora',
    period: '2026-10',
  },
  {
    id: 4,
    feeId: 8,
    apartmentUnit: 'A-12',
    residentName: 'Karim El Amrani',
    amount: 600,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: '2026-09-08T14:15:00',
    recordedBy: 'Saisi par Nora',
    period: '2026-09',
  },
  {
    id: 5,
    feeId: 9,
    apartmentUnit: 'A-12',
    residentName: 'Karim El Amrani',
    amount: 600,
    paymentMethod: 'CASH',
    paymentDate: '2026-08-10T16:00:00',
    recordedBy: 'Saisi par Nora',
    period: '2026-08',
  },
];

const METHOD_LABELS = {
  BANK_TRANSFER: 'Virement bancaire',
  CARD: 'Carte bancaire',
  CASH: 'Espèces (reçu)',
  OTHER: 'Chèque / Autre',
};

export default function PaymentsPage() {
  const { activeResidence } = useDemoAuth();

  const [payments, setPayments] = useState(INITIAL_DEMO_PAYMENTS);
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch payments and fees from backend
  const fetchPaymentsData = async () => {
    setIsLoading(true);
    try {
      const [paymentsData, feesData, aptsData] = await Promise.all([
        paymentApi.getAll(),
        feeApi.getAll(),
        apartmentApi.getAll(),
      ]);

      if (Array.isArray(feesData)) {
        setFees(feesData);
      }

      if (Array.isArray(paymentsData) && paymentsData.length > 0) {
        const enriched = paymentsData.map((p) => {
          const fee = (feesData || []).find((f) => f.id === p.feeId);
          const apt = (aptsData || []).find(
            (a) => a.id === (p.apartmentId || fee?.apartmentId)
          );
          return {
            ...p,
            apartmentUnit: apt?.unitNumber || `Lot #${p.apartmentId || '—'}`,
            residentName: apt?.currentOwner?.username || 'Copropriétaire',
            recordedBy: 'Saisi par le syndic',
            period: fee?.period || '2026-10',
          };
        });
        setPayments(enriched);
      }
    } catch {
      // Backend offline; keep initial demo payments
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Calculations
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const transferCount = payments.filter((p) => p.paymentMethod === 'BANK_TRANSFER').length;
  const transferPercentage =
    payments.length > 0 ? Math.round((transferCount / payments.length) * 100) : 0;

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        p.apartmentUnit.toLowerCase().includes(search) ||
        p.residentName.toLowerCase().includes(search) ||
        p.amount.toString().includes(search);

      let matchesMethod = true;
      if (methodFilter !== 'ALL') {
        matchesMethod = p.paymentMethod === methodFilter;
      }

      return matchesSearch && matchesMethod;
    });
  }, [payments, searchTerm, methodFilter]);

  // Handlers
  const handleRecordPayment = async (paymentData) => {
    setActionLoading(true);
    try {
      let newPayment = {
        ...paymentData,
        id: Date.now(),
        apartmentUnit: 'A-12',
        residentName: 'Karim El Amrani',
        recordedBy: 'Saisi par Nora',
        period: '2026-10',
      };

      try {
        const created = await paymentApi.create(paymentData);
        if (created && created.id) {
          newPayment = {
            ...created,
            apartmentUnit: newPayment.apartmentUnit,
            residentName: newPayment.residentName,
            recordedBy: 'Saisi par le syndic',
            period: '2026-10',
          };
        }
      } catch {
        // Local fallback
      }

      setPayments((prev) => [newPayment, ...prev]);
      triggerNotification(`Paiement de ${formatCurrency(paymentData.amount)} enregistré avec succès.`);
      setIsPaymentModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    setActionLoading(true);
    try {
      try {
        await paymentApi.delete(paymentToDelete.id);
      } catch {
        // Local fallback
      }
      setPayments((prev) => prev.filter((p) => p.id !== paymentToDelete.id));
      triggerNotification(`Le règlement a été supprimé.`);
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1E392A] text-white shadow-lg text-xs font-medium animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header and Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Paiements & Encaissements
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Historique des encaissements enregistrés pour la {activeResidence.name} et délivrance des reçus.
          </p>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0"
        >
          <Plus size={16} />
          <span>Enregistrer un paiement</span>
        </button>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Total encaissé"
          value={formatCurrency(totalAmount)}
          subtitle={`${payments.length} règlements enregistrés`}
          icon={Wallet}
        />
        <StatCard
          title="Virements bancaires"
          value={`${transferPercentage} %`}
          subtitle={`${transferCount} paiements par virement`}
          icon={CreditCard}
        />
        <StatCard
          title="Dernier encaissement"
          value="600 DH"
          subtitle="Lot C-02 · Hier, 18:20"
          icon={CheckCircle2}
        />
        <StatCard
          title="Mode de saisie"
          value="Manuel & Reçu"
          subtitle="Saisi par l'équipe syndic"
          icon={Calendar}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par lot, nom de copropriétaire ou montant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Moyen :</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les moyens</option>
              <option value="BANK_TRANSFER">Virement bancaire</option>
              <option value="CARD">Carte bancaire</option>
              <option value="CASH">Espèces</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <button
            onClick={fetchPaymentsData}
            title="Rafraîchir"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE7D8] bg-[#FAF9F5] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Lot & Copropriétaire</th>
                <th className="py-3.5 px-4">Date du versement</th>
                <th className="py-3.5 px-4">Mode de règlement</th>
                <th className="py-3.5 px-4">Affectation</th>
                <th className="py-3.5 px-4">Montant versé</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE3]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#7F8B80]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <CreditCard size={28} className="mx-auto text-[#B5AE9B]" />
                      <p className="font-semibold text-sm text-[#18201B]">
                        Aucun paiement trouvé
                      </p>
                      <p className="text-xs text-[#7F8B80]">
                        Aucun versement ne correspond à vos filtres.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                    {/* Apartment & Resident */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#E8F2EC] flex items-center justify-center text-[#1F6B43] shrink-0">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#18201B]">
                              {p.apartmentUnit}
                            </span>
                            <span className="text-xs font-medium text-[#18201B]">
                              · {p.residentName}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#7F8C80]">
                            {p.recordedBy}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#5F6C60]">
                      {p.paymentDate ? formatDate(p.paymentDate, { full: true }) : '15 oct. 2026'}
                    </td>

                    {/* Method */}
                    <td className="py-4 px-4 font-medium text-[#18201B]">
                      <span className="px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#DDD9C5]">
                        {METHOD_LABELS[p.paymentMethod] || p.paymentMethod}
                      </span>
                    </td>

                    {/* Allocation */}
                    <td className="py-4 px-4 text-[#5F6C60]">
                      Charge mensuelle {p.period}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-bold text-sm text-[#18201B]">
                      {formatCurrency(p.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            triggerNotification(
                              `Reçu de paiement pour ${p.residentName} (${formatCurrency(
                                p.amount
                              )}) téléchargé.`
                            )
                          }
                          title="Télécharger le reçu PDF"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DDD9C5] bg-white text-[#18201B] hover:bg-[#F2EFE4] text-xs font-semibold transition-colors shadow-subtle"
                        >
                          <Download size={13} className="text-[#647165]" />
                          <span className="hidden sm:inline">Reçu</span>
                        </button>

                        <button
                          onClick={() => {
                            setPaymentToDelete(p);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Supprimer la transaction"
                          className="p-1.5 rounded-lg text-[#8A958B] hover:text-[#BA372A] hover:bg-[#FBEBE8] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-[#EAE7D8] flex items-center justify-between text-xs text-[#717E73]">
          <span>
            Affichage de {filteredPayments.length} sur {payments.length} règlements
          </span>
          <span className="font-semibold text-[#18201B]">
            Total cumulé : {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Record Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleRecordPayment}
        feesList={fees.length > 0 ? fees : [{ id: 1, apartmentUnit: 'A-12', period: '2026-10', amount: 600, outstandingBalance: 300 }]}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePayment}
        title="Supprimer ce règlement"
        message={`Êtes-vous certain de vouloir annuler ce règlement de ${formatCurrency(
          paymentToDelete?.amount
        )} pour le lot ${paymentToDelete?.apartmentUnit} ?`}
        confirmText="Supprimer définitivement"
        isLoading={actionLoading}
      />
    </div>
  );
}

