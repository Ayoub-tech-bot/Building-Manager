import React, { useState, useEffect, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Calendar,
  AlertCircle,
  CreditCard,
  Edit2,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import FeeModal from './FeeModal';
import GenerateFeesModal from './GenerateFeesModal';
import PaymentModal from '../payments/PaymentModal';
import { feeApi } from '../../api/feeApi';
import { paymentApi } from '../../api/paymentApi';
import { apartmentApi } from '../../api/apartmentApi';
import { formatCurrency, formatPeriod, formatDate } from '../../utils/formatters';
import { useDemoAuth } from '../../context/DemoAuthContext';

// Baseline demo charges matching Figma screenshots
const INITIAL_DEMO_FEES = [
  {
    id: 1,
    apartmentId: 2,
    apartmentUnit: 'B-04',
    ownerName: 'Youssef Tazi',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 600,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'UNPAID',
  },
  {
    id: 2,
    apartmentId: 2,
    apartmentUnit: 'B-04',
    ownerName: 'Youssef Tazi',
    period: '2026-09',
    amount: 600,
    outstandingBalance: 300,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-09-30',
    status: 'IN_PROGRESS',
  },
  {
    id: 3,
    apartmentId: 3,
    apartmentUnit: 'C-08',
    ownerName: 'Salma Idrissi',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 600,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'UNPAID',
  },
  {
    id: 4,
    apartmentId: 4,
    apartmentUnit: 'A-03',
    ownerName: 'Omar Berrada',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 600,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'UNPAID',
  },
  {
    id: 5,
    apartmentId: 1,
    apartmentUnit: 'A-12',
    ownerName: 'Karim El Amrani',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 300,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'IN_PROGRESS',
  },
  {
    id: 6,
    apartmentId: 6,
    apartmentUnit: 'C-02',
    ownerName: 'Amina Chraïbi',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 0,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'PAID',
  },
  {
    id: 7,
    apartmentId: 5,
    apartmentUnit: 'B-07',
    ownerName: 'Mehdi Amrani',
    period: '2026-10',
    amount: 600,
    outstandingBalance: 0,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-10-31',
    status: 'PAID',
  },
  {
    id: 8,
    apartmentId: 1,
    apartmentUnit: 'A-12',
    ownerName: 'Karim El Amrani',
    period: '2026-09',
    amount: 600,
    outstandingBalance: 0,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-09-30',
    status: 'PAID',
  },
  {
    id: 9,
    apartmentId: 1,
    apartmentUnit: 'A-12',
    ownerName: 'Karim El Amrani',
    period: '2026-08',
    amount: 600,
    outstandingBalance: 0,
    type: 'MONTHLY_CHARGE',
    dueDate: '2026-08-31',
    status: 'PAID',
  },
];

const DEMO_APARTMENTS = [
  { id: 1, unitNumber: 'A-12', sizeM2: 86.0, currentOwner: { username: 'Karim El Amrani' } },
  { id: 2, unitNumber: 'B-04', sizeM2: 92.5, currentOwner: { username: 'Youssef Tazi' } },
  { id: 3, unitNumber: 'C-08', sizeM2: 74.0, currentOwner: { username: 'Salma Idrissi' } },
  { id: 4, unitNumber: 'A-03', sizeM2: 86.0, currentOwner: { username: 'Omar Berrada' } },
  { id: 5, unitNumber: 'B-07', sizeM2: 110.0, currentOwner: { username: 'Mehdi Amrani' } },
  { id: 6, unitNumber: 'C-02', sizeM2: 68.0, currentOwner: { username: 'Amina Chraïbi' } },
];

export default function FeesPage() {
  const { activeResidence } = useDemoAuth();

  const [fees, setFees] = useState(INITIAL_DEMO_FEES);
  const [apartments, setApartments] = useState(DEMO_APARTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState('ALL');

  // Modals state
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeToEdit, setFeeToEdit] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [feeForPayment, setFeeForPayment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load fees and apartments from backend
  const fetchFeesData = async () => {
    setIsLoading(true);
    try {
      const [feesData, aptsData] = await Promise.all([
        feeApi.getAll(),
        apartmentApi.getAll(),
      ]);

      if (Array.isArray(aptsData) && aptsData.length > 0) {
        setApartments(aptsData);
      }

      if (Array.isArray(feesData) && feesData.length > 0) {
        // Enrich with unit number and calculated balance
        const enriched = await Promise.all(
          feesData.map(async (fee) => {
            let outstanding = fee.amount;
            try {
              const balance = await paymentApi.getBalance(fee.id);
              if (balance && balance.outstandingBalance !== undefined) {
                outstanding = Number(balance.outstandingBalance);
              }
            } catch {
              // fallback
            }
            const apt = (aptsData || []).find((a) => a.id === fee.apartmentId);
            return {
              ...fee,
              apartmentUnit: apt?.unitNumber || `Lot #${fee.apartmentId}`,
              ownerName: apt?.currentOwner?.username || 'Copropriétaire',
              outstandingBalance: outstanding,
            };
          })
        );
        setFees(enriched);
      }
    } catch {
      // Backend offline; keep initial demo data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesData();
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Calculations
  const totalEmitted = fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const totalDue = fees.reduce(
    (sum, f) => sum + (Number(f.outstandingBalance ?? f.amount) || 0),
    0
  );
  const totalCollected = totalEmitted - totalDue;
  const recoveryRate =
    totalEmitted > 0 ? Math.round((totalCollected / totalEmitted) * 100) : 0;
  const unpaidCount = fees.filter(
    (f) => f.status === 'UNPAID' || f.status === 'IN_PROGRESS'
  ).length;

  // Filtered fees
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        fee.apartmentUnit.toLowerCase().includes(search) ||
        fee.period.toLowerCase().includes(search) ||
        (fee.ownerName && fee.ownerName.toLowerCase().includes(search));

      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        matchesStatus = fee.status === statusFilter;
      }

      let matchesPeriod = true;
      if (periodFilter !== 'ALL') {
        matchesPeriod = fee.period === periodFilter;
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [fees, searchTerm, statusFilter, periodFilter]);

  // Handlers
  const handleOpenCreateModal = () => {
    setFeeToEdit(null);
    setIsFeeModalOpen(true);
  };

  const handleOpenEditModal = (fee) => {
    setFeeToEdit(fee);
    setIsFeeModalOpen(true);
  };

  const handleOpenPaymentModal = (fee) => {
    setFeeForPayment(fee);
    setIsPaymentModalOpen(true);
  };

  const handleOpenDeleteModal = (fee) => {
    setFeeToDelete(fee);
    setIsDeleteModalOpen(true);
  };

  const handleSaveFee = async (formData) => {
    setActionLoading(true);
    try {
      if (feeToEdit) {
        try {
          await feeApi.update(feeToEdit.id, formData);
        } catch {
          // Local fallback
        }
        setFees((prev) =>
          prev.map((f) => (f.id === feeToEdit.id ? { ...f, ...formData } : f))
        );
        triggerNotification(`La charge ${formData.period} a été mise à jour.`);
      } else {
        const apt = apartments.find((a) => a.id === formData.apartmentId);
        let newFee = {
          ...formData,
          id: Date.now(),
          apartmentUnit: apt?.unitNumber || `Lot #${formData.apartmentId}`,
          ownerName: apt?.currentOwner?.username || 'Copropriétaire',
          outstandingBalance: formData.amount,
        };

        try {
          const created = await feeApi.create(formData);
          if (created && created.id) {
            newFee = {
              ...created,
              apartmentUnit: apt?.unitNumber || `Lot #${formData.apartmentId}`,
              ownerName: apt?.currentOwner?.username || 'Copropriétaire',
              outstandingBalance: created.amount,
            };
          }
        } catch {
          // Local fallback
        }
        setFees((prev) => [newFee, ...prev]);
        triggerNotification(`Nouvelle charge émise pour le lot ${newFee.apartmentUnit}.`);
      }
      setIsFeeModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateBulkFees = async (generatedFees, targetPeriod) => {
    setActionLoading(true);
    try {
      // Create each via API or local fallback
      const enrichedNewFees = generatedFees.map((fee, idx) => {
        const apt = apartments.find((a) => a.id === fee.apartmentId);
        return {
          ...fee,
          id: Date.now() + idx,
          apartmentUnit: apt?.unitNumber || `Lot #${fee.apartmentId}`,
          ownerName: apt?.currentOwner?.username || 'Copropriétaire',
          outstandingBalance: fee.amount,
        };
      });

      // Try sending them in background
      try {
        await Promise.all(generatedFees.map((f) => feeApi.create(f)));
      } catch {
        // Local fallback
      }

      setFees((prev) => [...enrichedNewFees, ...prev]);
      triggerNotification(
        `Charges de ${formatPeriod(targetPeriod)} générées pour ${generatedFees.length} appartements.`
      );
      setIsGenerateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async (paymentData) => {
    setActionLoading(true);
    try {
      try {
        await paymentApi.create(paymentData);
      } catch {
        // Local fallback
      }

      // Update fee balance locally
      setFees((prev) =>
        prev.map((f) => {
          if (f.id === paymentData.feeId) {
            const currentRem = f.outstandingBalance ?? f.amount;
            const newRem = Math.max(0, currentRem - paymentData.amount);
            const newStatus = newRem === 0 ? 'PAID' : 'IN_PROGRESS';
            return {
              ...f,
              outstandingBalance: newRem,
              status: newStatus,
            };
          }
          return f;
        })
      );

      triggerNotification(`Paiement de ${formatCurrency(paymentData.amount)} enregistré.`);
      setIsPaymentModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFee = async () => {
    if (!feeToDelete) return;
    setActionLoading(true);
    try {
      try {
        await feeApi.delete(feeToDelete.id);
      } catch {
        // Local fallback
      }
      setFees((prev) => prev.filter((f) => f.id !== feeToDelete.id));
      triggerNotification(`La charge a été supprimée.`);
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

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Charges de Copropriété
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Émission des appels de fonds, suivi des recouvrements et gestion des soldes débiteurs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle"
          >
            <Receipt size={15} className="text-[#647165]" />
            <span>Générer les charges</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle"
          >
            <Plus size={16} />
            <span>Émettre une charge</span>
          </button>
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Solde total à recouvrer"
          value={formatCurrency(totalDue)}
          subtitle={`${unpaidCount} appels avec solde débiteur`}
          icon={Receipt}
        />
        <StatCard
          title="Total encaissé"
          value={formatCurrency(totalCollected)}
          subtitle={`${recoveryRate} % du montant total émis`}
          icon={DollarSign}
        />
        <StatCard
          title="Charges totales émises"
          value={formatCurrency(totalEmitted)}
          subtitle={`${fees.length} appels de charges au total`}
          icon={Calendar}
        />
        <StatCard
          title="Taux de recouvrement"
          value={`${recoveryRate} %`}
          subtitle="Toutes périodes confondues"
          icon={CheckCircle2}
        />
      </div>

      {/* Progress Bar Banner */}
      <div className="p-4 bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-[#5A665B]">
            Progression globale du recouvrement
          </span>
          <span className="font-bold text-[#18201B]">
            {formatCurrency(totalCollected)} / {formatCurrency(totalEmitted)} ({recoveryRate} %)
          </span>
        </div>
        <div className="w-full h-3 bg-[#E4E0D0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E392A] rounded-full transition-all duration-500"
            style={{ width: `${recoveryRate}%` }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par lot (ex: A-12), nom de copropriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="UNPAID">En retard (Impayé)</option>
              <option value="IN_PROGRESS">Partiel (En cours)</option>
              <option value="PAID">Réglé (Soldé)</option>
            </select>
          </div>

          <button
            onClick={fetchFeesData}
            title="Rafraîchir"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE7D8] bg-[#FAF9F5] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Lot / Copropriétaire</th>
                <th className="py-3.5 px-4">Période</th>
                <th className="py-3.5 px-4">Échéance</th>
                <th className="py-3.5 px-4">Montant émis</th>
                <th className="py-3.5 px-4">Solde dû</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE3]">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#7F8B80]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt size={28} className="mx-auto text-[#B5AE9B]" />
                      <p className="font-semibold text-sm text-[#18201B]">
                        Aucune charge trouvée
                      </p>
                      <p className="text-xs text-[#7F8B80]">
                        Aucun appel de charge ne correspond aux filtres appliqués.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const isSettled = fee.status === 'PAID';
                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      {/* Apartment & Owner */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded border border-[#DDD9C5] bg-[#F7F6F1] font-bold text-xs text-[#18201B]">
                            {fee.apartmentUnit}
                          </span>
                          <div>
                            <div className="font-semibold text-xs text-[#18201B]">
                              {fee.ownerName}
                            </div>
                            <div className="text-[10px] text-[#758276]">
                              Lot {fee.apartmentUnit}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-4 px-4 font-semibold text-[#18201B]">
                        {formatPeriod(fee.period)}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 text-[#5D6B5E]">
                        {formatDate(fee.dueDate)}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 font-bold text-[#18201B]">
                        {formatCurrency(fee.amount)}
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-4 px-4">
                        <span
                          className={`font-bold ${
                            (fee.outstandingBalance ?? fee.amount) > 0
                              ? 'text-[#BA372A]'
                              : 'text-[#1F6B43]'
                          }`}
                        >
                          {formatCurrency(fee.outstandingBalance ?? fee.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={fee.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isSettled && (
                            <button
                              onClick={() => handleOpenPaymentModal(fee)}
                              title="Enregistrer un versement"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1E392A] text-white hover:bg-[#162C20] text-xs font-semibold transition-colors shadow-subtle"
                            >
                              <CreditCard size={13} />
                              <span>Paiement</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEditModal(fee)}
                            title="Modifier la charge"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenDeleteModal(fee)}
                            title="Supprimer la charge"
                            className="p-1.5 rounded-lg text-[#8A958B] hover:text-[#BA372A] hover:bg-[#FBEBE8] transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-[#EAE7D8] flex items-center justify-between text-xs text-[#717E73]">
          <span>
            Affichage de {filteredFees.length} sur {fees.length} appels de charges
          </span>
          <span className="font-semibold text-[#18201B]">
            Solde total restant : {formatCurrency(totalDue)}
          </span>
        </div>
      </div>

      {/* Create / Edit Fee Modal */}
      <FeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onSubmit={handleSaveFee}
        feeToEdit={feeToEdit}
        apartmentsList={apartments}
        isLoading={actionLoading}
      />

      {/* Bulk Fee Generation Modal */}
      <GenerateFeesModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        apartmentsList={apartments}
        onSubmit={handleGenerateBulkFees}
        isLoading={actionLoading}
      />

      {/* Payment Recording Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleRecordPayment}
        feesList={fees.filter((f) => f.status !== 'PAID')}
        preselectedFee={feeForPayment}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFee}
        title="Supprimer cet appel de charge"
        message={`Êtes-vous sûr de vouloir supprimer cet appel de charge de ${formatCurrency(
          feeToDelete?.amount
        )} pour le lot ${feeToDelete?.apartmentUnit} (${formatPeriod(
          feeToDelete?.period
        )}) ?`}
        confirmText="Supprimer définitivement"
        isLoading={actionLoading}
      />
    </div>
  );
}
