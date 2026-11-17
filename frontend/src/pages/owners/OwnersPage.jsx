import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Home,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import OwnerModal from './OwnerModal';
import OwnerDetailsModal from './OwnerDetailsModal';
import { userApi } from '../../api/userApi';
import { ownershipApi } from '../../api/ownershipApi';
import { useDemoAuth } from '../../context/DemoAuthContext';

const LOCAL_STORAGE_KEY = 'habita_all_owners';

const INITIAL_DEMO_OWNERS = [
  {
    id: 'owner-1',
    username: 'Karim El Amrani',
    email: 'karim.amrani@gmail.com',
    phoneNumber: '06 61 14 25 36',
    role: 'Owner',
    ownedApartments: [{ id: 1, unitNumber: 'A-12', sizeM2: 86.0 }],
  },
  {
    id: 'owner-2',
    username: 'Youssef Tazi',
    email: 'youssef.tazi@outlook.com',
    phoneNumber: '06 62 88 99 00',
    role: 'Owner',
    ownedApartments: [{ id: 2, unitNumber: 'B-04', sizeM2: 92.5 }],
  },
  {
    id: 'owner-3',
    username: 'Salma Idrissi',
    email: 'salma.idrissi@gmail.com',
    phoneNumber: '06 63 45 67 89',
    role: 'Owner',
    ownedApartments: [{ id: 3, unitNumber: 'C-08', sizeM2: 74.0 }],
  },
  {
    id: 'owner-4',
    username: 'Omar Berrada',
    email: 'omar.berrada@yahoo.fr',
    phoneNumber: '06 70 12 34 56',
    role: 'Owner',
    ownedApartments: [{ id: 4, unitNumber: 'A-03', sizeM2: 86.0 }],
  },
  {
    id: 'owner-5',
    username: 'Mehdi Amrani',
    email: 'mehdi.amrani@gmail.com',
    phoneNumber: '06 68 55 44 33',
    role: 'Owner',
    ownedApartments: [{ id: 5, unitNumber: 'B-07', sizeM2: 110.0 }],
  },
  {
    id: 'owner-6',
    username: 'Amina Chraïbi',
    email: 'amina.chraibi@menara.ma',
    phoneNumber: '06 65 21 43 65',
    role: 'Owner',
    ownedApartments: [{ id: 6, unitNumber: 'C-02', sizeM2: 68.0 }],
  },
  {
    id: 'owner-7',
    username: 'Fatima Zahra Bennani',
    email: 'fz.bennani@gmail.com',
    phoneNumber: '06 72 33 22 11',
    role: 'Owner',
    ownedApartments: [],
  },
  {
    id: 'owner-8',
    username: 'Hassan Kabbaj',
    email: 'hassan.kabbaj@gmail.com',
    phoneNumber: '06 60 99 88 77',
    role: 'Owner',
    ownedApartments: [],
  },
];

export default function OwnersPage() {
  const { activeResidence } = useDemoAuth();

  // Load from localStorage or fallback
  const [owners, setOwners] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_OWNERS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ASSIGNED, UNASSIGNED

  // Modals state
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOwnerForDetails, setSelectedOwnerForDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Save to localStorage whenever owners change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(owners));
    } catch {
      // ignore
    }
  }, [owners]);

  // Fetch owners from backend, fallback to local/demo data if offline
  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getByRole('Owner');
      if (Array.isArray(data) && data.length > 0) {
        // Enrich owners with their owned apartments
        const enriched = await Promise.all(
          data.map(async (owner) => {
            try {
              const ownedApartments = await ownershipApi.getByOwner(owner.id);
              return { ...owner, ownedApartments: ownedApartments || [] };
            } catch {
              return { ...owner, ownedApartments: [] };
            }
          })
        );
        setOwners(enriched);
      }
    } catch {
      // Backend offline; keep cached local state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered calculation
  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        owner.username.toLowerCase().includes(search) ||
        owner.email.toLowerCase().includes(search) ||
        (owner.phoneNumber && owner.phoneNumber.includes(search));

      const hasLots = owner.ownedApartments && owner.ownedApartments.length > 0;
      let matchesStatus = true;
      if (statusFilter === 'ASSIGNED') {
        matchesStatus = hasLots;
      } else if (statusFilter === 'UNASSIGNED') {
        matchesStatus = !hasLots;
      }

      return matchesSearch && matchesStatus;
    });
  }, [owners, searchTerm, statusFilter]);

  // Statistics
  const totalOwners = owners.length;
  const assignedOwnersCount = owners.filter(
    (o) => o.ownedApartments && o.ownedApartments.length > 0
  ).length;
  const unassignedOwnersCount = totalOwners - assignedOwnersCount;
  const verifiedPhones = owners.filter((o) => Boolean(o.phoneNumber)).length;
  const contactRate =
    totalOwners > 0 ? Math.round((verifiedPhones / totalOwners) * 100) : 0;

  // Handlers
  const handleOpenCreateModal = () => {
    setOwnerToEdit(null);
    setIsOwnerModalOpen(true);
  };

  const handleOpenEditModal = (owner) => {
    setOwnerToEdit(owner);
    setIsOwnerModalOpen(true);
  };

  const handleOpenDetailsModal = (owner) => {
    setSelectedOwnerForDetails(owner);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (owner) => {
    setOwnerToDelete(owner);
    setIsDeleteModalOpen(true);
  };

  const handleSaveOwner = async (formData) => {
    setActionLoading(true);
    try {
      if (ownerToEdit) {
        try {
          await userApi.update(ownerToEdit.id, formData);
        } catch {
          // Local fallback
        }
        setOwners((prev) => {
          const updated = prev.map((o) =>
            o.id === ownerToEdit.id ? { ...o, ...formData } : o
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`Le compte de ${formData.username} a été mis à jour.`);
      } else {
        let newOwner = {
          ...formData,
          id: `owner-${Date.now()}`,
          ownedApartments: [],
        };
        try {
          const created = await userApi.create(formData);
          if (created && created.id) {
            newOwner = { ...created, ownedApartments: [] };
          }
        } catch {
          // Local fallback
        }
        setOwners((prev) => {
          const updated = [newOwner, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`Le profil propriétaire de ${formData.username} a été créé.`);
      }
      setIsOwnerModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOwner = async () => {
    if (!ownerToDelete) return;
    setActionLoading(true);
    try {
      try {
        await userApi.delete(ownerToDelete.id);
      } catch {
        // Local fallback
      }
      setOwners((prev) => {
        const updated = prev.filter((o) => o.id !== ownerToDelete.id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      triggerNotification(`Le propriétaire ${ownerToDelete.username} a été supprimé.`);
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
          <CheckCircle size={16} className="text-emerald-300" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Annuaire des Propriétaires
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Gestion globale des profils propriétaires. Créez et gérez les comptes utilisateurs avant leur attribution à des lots.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0"
        >
          <Plus size={16} />
          <span>Nouveau propriétaire</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Total propriétaires"
          value={totalOwners.toString()}
          subtitle="Comptes enregistrés sur la plateforme"
          icon={Users}
        />
        <StatCard
          title="Attribués à des lots"
          value={assignedOwnersCount.toString()}
          subtitle="Possèdent au moins 1 appartement"
          icon={UserCheck}
        />
        <StatCard
          title="Sans lot (en attente)"
          value={unassignedOwnersCount.toString()}
          subtitle="Profils disponibles pour assignation"
          icon={UserPlus}
        />
        <StatCard
          title="Coordonnées vérifiées"
          value={`${contactRate} %`}
          subtitle="Avec numéro de téléphone renseigné"
          icon={ShieldCheck}
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les propriétaires ({totalOwners})</option>
              <option value="ASSIGNED">Attribués à un lot ({assignedOwnersCount})</option>
              <option value="UNASSIGNED">Sans lot attribué ({unassignedOwnersCount})</option>
            </select>
          </div>

          <button
            onClick={fetchOwners}
            title="Rafraîchir depuis le serveur"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Owners Table */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE7D8] bg-[#FAF9F5] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Propriétaire</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Statut d'attribution</th>
                <th className="py-3.5 px-4">Lots associés</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE3]">
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#7F8B80]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users size={28} className="mx-auto text-[#B5AE9B]" />
                      <p className="font-semibold text-sm text-[#18201B]">
                        Aucun propriétaire trouvé
                      </p>
                      <p className="text-xs text-[#7F8B80]">
                        Aucun profil ne correspond aux critères de recherche actuels.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner) => {
                  const hasLots =
                    owner.ownedApartments && owner.ownedApartments.length > 0;

                  return (
                    <tr
                      key={owner.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-subtle">
                            {owner.username
                              ? owner.username.substring(0, 2).toUpperCase()
                              : 'PR'}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#18201B]">
                              {owner.username}
                            </div>
                            <div className="text-[11px] text-[#717E73]">
                              Rôle : Propriétaire
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#18201B]">
                          <Mail size={13} className="text-[#7F8B80]" />
                          <span>{owner.email}</span>
                        </div>
                        {owner.phoneNumber ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#69766B]">
                            <Phone size={12} className="text-[#7F8B80]" />
                            <span>{owner.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#A69F8E] italic">
                            Téléphone non renseigné
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {hasLots ? (
                          <StatusBadge status="paid" label="Attribué à un lot" />
                        ) : (
                          <StatusBadge status="pending" label="Sans lot (en attente)" />
                        )}
                      </td>

                      {/* Lots */}
                      <td className="py-4 px-4">
                        {hasLots ? (
                          <div className="flex flex-wrap gap-1.5">
                            {owner.ownedApartments.map((apt) => (
                              <span
                                key={apt.id}
                                className="px-2 py-0.5 rounded-md border border-[#DDD9C5] bg-[#FAF9F5] text-[11px] font-semibold text-[#18201B]"
                              >
                                {apt.unitNumber} ({apt.sizeM2} m²)
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-[#8A958B] italic">
                            Aucun lot pour le moment
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetailsModal(owner)}
                            title="Voir la fiche détaillée"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(owner)}
                            title="Modifier les coordonnées"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenDeleteModal(owner)}
                            title="Supprimer le propriétaire"
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
            Affichage de {filteredOwners.length} sur {totalOwners} propriétaires
          </span>
          <span className="font-semibold text-[#18201B]">
            {assignedOwnersCount} copropriétaires actifs dans la résidence
          </span>
        </div>
      </div>

      {/* Modals */}
      <OwnerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        onSubmit={handleSaveOwner}
        ownerToEdit={ownerToEdit}
        isLoading={actionLoading}
      />

      <OwnerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        owner={selectedOwnerForDetails}
      />

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOwner}
        title={`Supprimer le propriétaire ${ownerToDelete?.username}`}
        message={`Êtes-vous certain de vouloir supprimer le compte de ${ownerToDelete?.username} ? S'il possède des lots, ses attributions devront être réassignées.`}
        confirmText="Supprimer définitivement"
        isLoading={actionLoading}
      />
    </div>
  );
}
