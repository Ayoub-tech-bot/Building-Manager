import React, { useState, useEffect, useMemo } from 'react';
import {
  Building,
  Plus,
  Search,
  Filter,
  UserCheck,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Maximize2,
  Users,
  Home,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ApartmentModal from './ApartmentModal';
import AssignOwnerModal from './AssignOwnerModal';
import { apartmentApi } from '../../api/apartmentApi';
import { ownershipApi } from '../../api/ownershipApi';
import { userApi } from '../../api/userApi';
import buildingApi from '../../api/buildingApi';
import { useDemoAuth } from '../../context/DemoAuthContext';

// Baseline demo apartments for fallback & initial preview matching Figma
const INITIAL_DEMO_APARTMENTS = [
  {
    id: 1,
    unitNumber: 'A-12',
    sizeM2: 86.0,
    residenceId: 1,
    buildingId: 1,
    buildingName: 'Bâtiment A',
    floor: 2,
    currentOwner: {
      id: 'owner-1',
      username: 'Karim El Amrani',
      email: 'karim.amrani@gmail.com',
    },
  },
  {
    id: 2,
    unitNumber: 'B-04',
    sizeM2: 92.5,
    residenceId: 1,
    buildingId: 2,
    buildingName: 'Bâtiment B',
    floor: 0,
    currentOwner: {
      id: 'owner-2',
      username: 'Youssef Tazi',
      email: 'youssef.tazi@outlook.com',
    },
  },
  {
    id: 3,
    unitNumber: 'C-08',
    sizeM2: 74.0,
    residenceId: 1,
    buildingId: 3,
    buildingName: 'Bâtiment C',
    floor: 1,
    currentOwner: {
      id: 'owner-3',
      username: 'Salma Idrissi',
      email: 'salma.idrissi@gmail.com',
    },
  },
  {
    id: 4,
    unitNumber: 'A-03',
    sizeM2: 86.0,
    residenceId: 1,
    buildingId: 1,
    buildingName: 'Bâtiment A',
    floor: 0,
    currentOwner: {
      id: 'owner-4',
      username: 'Omar Berrada',
      email: 'omar.berrada@yahoo.fr',
    },
  },
  {
    id: 5,
    unitNumber: 'B-07',
    sizeM2: 110.0,
    residenceId: 1,
    buildingId: 2,
    buildingName: 'Bâtiment B',
    floor: 2,
    currentOwner: {
      id: 'owner-5',
      username: 'Mehdi Amrani',
      email: 'mehdi.amrani@gmail.com',
    },
  },
  {
    id: 6,
    unitNumber: 'C-02',
    sizeM2: 68.0,
    residenceId: 1,
    buildingId: 3,
    buildingName: 'Bâtiment C',
    floor: 0,
    currentOwner: {
      id: 'owner-6',
      username: 'Amina Chraïbi',
      email: 'amina.chraibi@menara.ma',
    },
  },
  {
    id: 7,
    unitNumber: 'A-15',
    sizeM2: 95.0,
    residenceId: 1,
    buildingId: 1,
    buildingName: 'Bâtiment A',
    floor: 3,
    currentOwner: null, // Vacant
  },
  {
    id: 8,
    unitNumber: 'B-11',
    sizeM2: 80.0,
    residenceId: 1,
    buildingId: 2,
    buildingName: 'Bâtiment B',
    floor: 3,
    currentOwner: null, // Vacant
  },
];

const DEFAULT_BUILDINGS = [
  { id: 1, name: 'Bâtiment A' },
  { id: 2, name: 'Bâtiment B' },
  { id: 3, name: 'Bâtiment C' },
];

const DEMO_OWNERS_LIST = [
  { id: 'owner-1', username: 'Karim El Amrani', email: 'karim.amrani@gmail.com' },
  { id: 'owner-2', username: 'Youssef Tazi', email: 'youssef.tazi@outlook.com' },
  { id: 'owner-3', username: 'Salma Idrissi', email: 'salma.idrissi@gmail.com' },
  { id: 'owner-4', username: 'Omar Berrada', email: 'omar.berrada@yahoo.fr' },
  { id: 'owner-5', username: 'Mehdi Amrani', email: 'mehdi.amrani@gmail.com' },
  { id: 'owner-6', username: 'Amina Chraïbi', email: 'amina.chraibi@menara.ma' },
  { id: 'owner-7', username: 'Fatima Zahra Bennani', email: 'fz.bennani@gmail.com' },
  { id: 'owner-8', username: 'Hassan Kabbaj', email: 'hassan.kabbaj@gmail.com' },
];

const LOCAL_STORAGE_KEY = 'habita_apartments';

export default function ApartmentsPage() {
  const { activeResidence } = useDemoAuth();

  // Load from localStorage or fallback
  const [apartments, setApartments] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_APARTMENTS;
  });

  const [buildings, setBuildings] = useState(DEFAULT_BUILDINGS);
  const [ownersList, setOwnersList] = useState(DEMO_OWNERS_LIST);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apartments));
    } catch {
      // ignore
    }
  }, [apartments]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isApartmentModalOpen, setIsApartmentModalOpen] = useState(false);
  const [apartmentToEdit, setApartmentToEdit] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [apartmentForAssign, setApartmentForAssign] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load from backend on mount, fallback to demo data if offline or empty
  const fetchApartments = async () => {
    setIsLoading(true);
    try {
      const data = await apartmentApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        // Enrich apartments with current owner info
        const enriched = await Promise.all(
          data.map(async (apt) => {
            try {
              const currentOwner = await ownershipApi.getCurrentOwner(apt.id);
              return { ...apt, currentOwner };
            } catch {
              return { ...apt, currentOwner: null };
            }
          })
        );
        setApartments(enriched);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(enriched));
      }
    } catch {
      // Backend not running or no data; keep cached local state in apartments
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const data = await buildingApi.getByResidence(activeResidence.id);
      if (Array.isArray(data) && data.length > 0) {
        setBuildings(data);
      }
    } catch {
      // Keep DEFAULT_BUILDINGS
    }
  };

  const fetchOwners = async () => {
    try {
      const owners = await userApi.getByRole('Owner');
      if (Array.isArray(owners) && owners.length > 0) {
        setOwnersList(owners);
      }
    } catch {
      // Keep DEMO_OWNERS_LIST
    }
  };

  useEffect(() => {
    fetchApartments();
    fetchBuildings();
    fetchOwners();
  }, [activeResidence.id]);

  // Show auto-dismiss notification
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered apartments calculation
  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      // Search filter
      const matchesSearch =
        apt.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.currentOwner &&
          apt.currentOwner.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (apt.currentOwner &&
          apt.currentOwner.email.toLowerCase().includes(searchTerm.toLowerCase()));

      // Building filter
      let matchesBuilding = true;
      if (buildingFilter !== 'ALL') {
        const filterVal = String(buildingFilter);
        const aptBuildingId = apt.buildingId ? String(apt.buildingId) : null;
        const aptBuildingName = apt.buildingName || apt.building || '';

        matchesBuilding =
          aptBuildingId === filterVal ||
          aptBuildingName === filterVal ||
          aptBuildingName.includes(filterVal) ||
          apt.unitNumber.startsWith(filterVal);
      }

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'OCCUPIED') {
        matchesStatus = Boolean(apt.currentOwner);
      } else if (statusFilter === 'VACANT') {
        matchesStatus = !apt.currentOwner;
      }

      return matchesSearch && matchesBuilding && matchesStatus;
    });
  }, [apartments, searchTerm, buildingFilter, statusFilter]);

  // Statistics
  const totalApartments = apartments.length;
  const totalArea = apartments.reduce((acc, apt) => acc + (Number(apt.sizeM2) || 0), 0);
  const occupiedCount = apartments.filter((apt) => Boolean(apt.currentOwner)).length;
  const vacantCount = totalApartments - occupiedCount;
  const occupancyRate = totalApartments > 0 ? Math.round((occupiedCount / totalApartments) * 100) : 0;

  // Handlers
  const handleOpenCreateModal = () => {
    setApartmentToEdit(null);
    setIsApartmentModalOpen(true);
  };

  const handleOpenEditModal = (apt) => {
    setApartmentToEdit(apt);
    setIsApartmentModalOpen(true);
  };

  const handleOpenAssignModal = (apt) => {
    setApartmentForAssign(apt);
    setIsAssignModalOpen(true);
  };

  const handleOpenDeleteModal = (apt) => {
    setApartmentToDelete(apt);
    setIsDeleteModalOpen(true);
  };

  const handleSaveApartment = async (formData) => {
    setActionLoading(true);
    try {
      if (apartmentToEdit) {
        // Try backend update
        try {
          await apartmentApi.update(apartmentToEdit.id, formData);
        } catch (err) {
          console.warn('Backend update failed or offline, saving locally:', err);
        }
        setApartments((prev) => {
          const updated = prev.map((a) =>
            a.id === apartmentToEdit.id ? { ...a, ...formData } : a
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`L'appartement ${formData.unitNumber} a été mis à jour.`);
      } else {
        // Try backend create
        let newApt = {
          ...formData,
          id: Date.now(),
          currentOwner: null,
        };
        try {
          const created = await apartmentApi.create(formData);
          if (created && created.id) {
            newApt = { ...created, currentOwner: null };
          }
        } catch (err) {
          console.warn('Backend create failed or offline, saving locally:', err);
        }
        setApartments((prev) => {
          const updated = [newApt, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`L'appartement ${formData.unitNumber} a été créé avec succès.`);
      }
      setIsApartmentModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignOwner = async ({ apartmentId, ownerId, transferDate, isTransfer }) => {
    setActionLoading(true);
    try {
      const selectedOwner = ownersList.find((o) => o.id === ownerId);

      // Try backend call
      try {
        if (isTransfer) {
          await ownershipApi.transfer(apartmentId, { newOwnerId: ownerId, transferDate });
        } else {
          await ownershipApi.assign({ ownerId, apartmentId });
        }
      } catch (err) {
        console.warn('Backend ownership assign failed or offline, saving locally:', err);
      }

      setApartments((prev) => {
        const updated = prev.map((a) =>
          a.id === apartmentId ? { ...a, currentOwner: selectedOwner } : a
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      triggerNotification(
        isTransfer
          ? `Propriété transférée à ${selectedOwner?.username || 'nouveau propriétaire'}.`
          : `Propriétaire assigné à l'appartement.`
      );
      setIsAssignModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteApartment = async () => {
    if (!apartmentToDelete) return;
    setActionLoading(true);
    try {
      try {
        await apartmentApi.delete(apartmentToDelete.id);
      } catch (err) {
        console.warn('Backend delete failed or offline, saving locally:', err);
      }
      setApartments((prev) => {
        const updated = prev.filter((a) => a.id !== apartmentToDelete.id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      triggerNotification(`L'appartement ${apartmentToDelete.unitNumber} a été supprimé.`);
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const formatFloor = (floor) => {
    if (floor === null || floor === undefined || floor === '') return null;
    const num = Number(floor);
    if (num === 0) return 'RDC';
    if (num === 1) return '1er étage';
    return `${num}e étage`;
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

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Appartements & Lots
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Inventaire des {totalApartments} lots de la {activeResidence.name}, classés par bâtiment et étage.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0"
        >
          <Plus size={16} />
          <span>Ajouter un appartement</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Total des lots"
          value={totalApartments.toString()}
          subtitle={`${occupiedCount} occupés · ${vacantCount} vacants`}
          icon={Building}
        />
        <StatCard
          title="Surface totale gérée"
          value={`${totalArea.toLocaleString('fr-FR')} m²`}
          subtitle="Tantièmes calculés sur surface"
          icon={Maximize2}
        />
        <StatCard
          title="Taux d'occupation"
          value={`${occupancyRate} %`}
          subtitle="Lots avec propriétaire assigné"
          icon={Users}
        />
        <StatCard
          title="Lots vacants"
          value={vacantCount.toString()}
          subtitle="À assigner ou en vente"
          icon={Home}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par numéro de lot, nom ou email du propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Building filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Bâtiment :</span>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les bâtiments</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les lots</option>
              <option value="OCCUPIED">Occupés / Assignés</option>
              <option value="VACANT">Vacants</option>
            </select>
          </div>

          <button
            onClick={fetchApartments}
            title="Rafraîchir depuis le serveur"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Apartments Table */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE7D8] bg-[#FAF9F5] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Lot / Appartement</th>
                <th className="py-3.5 px-4">Bâtiment & Étage</th>
                <th className="py-3.5 px-4">Surface</th>
                <th className="py-3.5 px-4">Propriétaire actuel</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE3]">
              {filteredApartments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#7F8B80]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Home size={28} className="mx-auto text-[#B5AE9B]" />
                      <p className="font-semibold text-sm text-[#18201B]">
                        Aucun appartement trouvé
                      </p>
                      <p className="text-xs text-[#7F8B80]">
                        Aucun lot ne correspond à vos critères de recherche actuels.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApartments.map((apt) => {
                  const isOccupied = Boolean(apt.currentOwner);
                  const buildingDisplayName = apt.buildingName || apt.building || 'Bâtiment non assigné';
                  const floorLabel = formatFloor(apt.floor);

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      {/* Unit Number */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-lg border border-[#DDD9C5] bg-[#F7F6F1] font-bold text-xs text-[#18201B] shadow-subtle">
                            {apt.unitNumber}
                          </span>
                          <div>
                            <div className="font-semibold text-sm text-[#18201B]">
                              Appartement {apt.unitNumber}
                            </div>
                            <div className="text-[11px] text-[#758276]">
                              {activeResidence.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Building and Floor */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#18201B]">
                          {buildingDisplayName}
                        </div>
                        <div className="text-[11px] text-[#7F8B80]">
                          {floorLabel ? floorLabel : 'Étage non spécifié'}
                        </div>
                      </td>

                      {/* Size in M2 */}
                      <td className="py-4 px-4 font-semibold text-[#18201B]">
                        <span>{apt.sizeM2} m²</span>
                        <span className="block text-[11px] text-[#7F8B80] font-normal">
                          {totalArea > 0
                            ? `${((apt.sizeM2 / totalArea) * 1000).toFixed(0)} / 1000e`
                            : ''}
                        </span>
                      </td>

                      {/* Current Owner */}
                      <td className="py-4 px-4">
                        {isOccupied ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {apt.currentOwner.username
                                ? apt.currentOwner.username.substring(0, 2).toUpperCase()
                                : 'PR'}
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-[#18201B]">
                                {apt.currentOwner.username}
                              </div>
                              <div className="text-[11px] text-[#738075]">
                                {apt.currentOwner.email}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#8F9A90] font-medium italic">
                            Non assigné (vacant)
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {isOccupied ? (
                          <StatusBadge status="paid" label="Occupé" />
                        ) : (
                          <StatusBadge status="pending" label="Vacant" />
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Assign or Transfer */}
                          <button
                            onClick={() => handleOpenAssignModal(apt)}
                            title={isOccupied ? 'Transférer la propriété' : 'Assigner un propriétaire'}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DDD9C5] bg-white text-[#18201B] hover:bg-[#F2EFE4] text-xs font-semibold transition-colors shadow-subtle"
                          >
                            {isOccupied ? (
                              <>
                                <ArrowRightLeft size={13} className="text-[#627063]" />
                                <span className="hidden sm:inline">Transférer</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} className="text-[#1E392A]" />
                                <span>Assigner</span>
                              </>
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(apt)}
                            title="Modifier le lot"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDeleteModal(apt)}
                            title="Supprimer le lot"
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

        {/* Table Footer Summary */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-[#EAE7D8] flex items-center justify-between text-xs text-[#717E73]">
          <span>
            Affichage de {filteredApartments.length} sur {totalApartments} appartements
          </span>
          <span className="font-semibold text-[#18201B]">
            Surface cumulée : {filteredApartments.reduce((sum, a) => sum + (Number(a.sizeM2) || 0), 0).toFixed(1)} m²
          </span>
        </div>
      </div>

      {/* Add / Edit Apartment Modal */}
      <ApartmentModal
        isOpen={isApartmentModalOpen}
        onClose={() => setIsApartmentModalOpen(false)}
        onSubmit={handleSaveApartment}
        apartmentToEdit={apartmentToEdit}
        activeResidenceId={activeResidence.id}
        isLoading={actionLoading}
      />

      {/* Assign / Transfer Ownership Modal */}
      <AssignOwnerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        apartment={apartmentForAssign}
        currentOwner={apartmentForAssign?.currentOwner}
        ownersList={ownersList}
        onSubmit={handleAssignOwner}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteApartment}
        title={`Supprimer l'appartement ${apartmentToDelete?.unitNumber}`}
        message={`Êtes-vous certain de vouloir supprimer le lot ${apartmentToDelete?.unitNumber} (${apartmentToDelete?.sizeM2} m²) ? Cette action supprimera également les données associées.`}
        confirmText="Supprimer définitivement"
        isLoading={actionLoading}
      />
    </div>
  );
}
