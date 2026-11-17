import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Layers,
  Home,
  Maximize2,
  Edit2,
  Trash2,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import BuildingModal from './BuildingModal';
import buildingApi from '../../api/buildingApi';
import { apartmentApi } from '../../api/apartmentApi';
import { useDemoAuth } from '../../context/DemoAuthContext';

const LOCAL_STORAGE_BUILDINGS_KEY = 'habita_buildings';

const INITIAL_DEMO_BUILDINGS = [
  {
    id: 1,
    name: 'Bâtiment A',
    floorsCount: 4,
    residenceId: 1,
  },
  {
    id: 2,
    name: 'Bâtiment B',
    floorsCount: 4,
    residenceId: 1,
  },
  {
    id: 3,
    name: 'Bâtiment C',
    floorsCount: 4,
    residenceId: 1,
  },
];

export default function BuildingsPage() {
  const { activeResidence } = useDemoAuth();

  // Load buildings from localStorage or fallback
  const [buildings, setBuildings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BUILDINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DEMO_BUILDINGS;
  });

  const [apartments, setApartments] = useState(() => {
    try {
      const saved = localStorage.getItem('habita_apartments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildingToEdit, setBuildingToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BUILDINGS_KEY, JSON.stringify(buildings));
    } catch {
      // ignore
    }
  }, [buildings]);

  // Fetch buildings and apartments
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [buildingsData, apartmentsData] = await Promise.allSettled([
        buildingApi.getByResidence(activeResidence.id),
        apartmentApi.getAll(),
      ]);

      if (buildingsData.status === 'fulfilled' && Array.isArray(buildingsData.value) && buildingsData.value.length > 0) {
        setBuildings(buildingsData.value);
        localStorage.setItem(LOCAL_STORAGE_BUILDINGS_KEY, JSON.stringify(buildingsData.value));
      }

      if (apartmentsData.status === 'fulfilled' && Array.isArray(apartmentsData.value) && apartmentsData.value.length > 0) {
        setApartments(apartmentsData.value);
      }
    } catch {
      // Keep cached local state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeResidence.id]);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Group apartments by building
  const buildingsWithMetrics = useMemo(() => {
    return buildings.map((b) => {
      const buildingApts = apartments.filter((a) => {
        if (a.buildingId) return Number(a.buildingId) === Number(b.id);
        if (a.buildingName) return a.buildingName.toLowerCase() === b.name.toLowerCase();
        if (a.building) return a.building.toLowerCase() === b.name.toLowerCase();
        // Fallback by prefix: "Bâtiment A" matches "A-..."
        const prefix = b.name.replace('Bâtiment ', '').trim();
        return a.unitNumber.startsWith(prefix);
      });

      const totalArea = buildingApts.reduce((sum, a) => sum + (Number(a.sizeM2) || 0), 0);
      const occupiedCount = buildingApts.filter((a) => Boolean(a.currentOwner)).length;
      const vacantCount = buildingApts.length - occupiedCount;

      return {
        ...b,
        apartments: buildingApts,
        apartmentsCount: buildingApts.length,
        totalArea,
        occupiedCount,
        vacantCount,
      };
    });
  }, [buildings, apartments]);

  // Filtered by search
  const filteredBuildings = useMemo(() => {
    return buildingsWithMetrics.filter((b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [buildingsWithMetrics, searchTerm]);

  // Global KPIs
  const totalBuildings = buildings.length;
  const totalApartments = buildingsWithMetrics.reduce((sum, b) => sum + b.apartmentsCount, 0);
  const totalFloors = buildings.reduce((sum, b) => sum + (Number(b.floorsCount) || 0), 0);
  const totalArea = buildingsWithMetrics.reduce((sum, b) => sum + b.totalArea, 0);

  // Handlers
  const handleOpenCreate = () => {
    setBuildingToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (building) => {
    setBuildingToEdit(building);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (building) => {
    setBuildingToDelete(building);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBuilding = async (formData) => {
    setActionLoading(true);
    try {
      if (buildingToEdit) {
        try {
          await buildingApi.update(buildingToEdit.id, formData);
        } catch (err) {
          console.warn('Backend update building failed or offline, saving locally:', err);
        }
        setBuildings((prev) => {
          const updated = prev.map((b) =>
            b.id === buildingToEdit.id ? { ...b, ...formData } : b
          );
          localStorage.setItem(LOCAL_STORAGE_BUILDINGS_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`L'immeuble ${formData.name} a été mis à jour.`);
      } else {
        let newBuilding = {
          ...formData,
          id: Date.now(),
        };
        try {
          const created = await buildingApi.create(formData);
          if (created && created.id) {
            newBuilding = created;
          }
        } catch (err) {
          console.warn('Backend create building failed or offline, saving locally:', err);
        }
        setBuildings((prev) => {
          const updated = [...prev, newBuilding];
          localStorage.setItem(LOCAL_STORAGE_BUILDINGS_KEY, JSON.stringify(updated));
          return updated;
        });
        triggerNotification(`L'immeuble ${formData.name} a été créé avec succès.`);
      }
      setIsModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!buildingToDelete) return;
    setActionLoading(true);
    try {
      try {
        await buildingApi.delete(buildingToDelete.id);
      } catch (err) {
        console.warn('Backend delete building failed or offline, saving locally:', err);
      }
      setBuildings((prev) => {
        const updated = prev.filter((b) => b.id !== buildingToDelete.id);
        localStorage.setItem(LOCAL_STORAGE_BUILDINGS_KEY, JSON.stringify(updated));
        return updated;
      });
      triggerNotification(`L'immeuble ${buildingToDelete.name} a été supprimé.`);
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

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Immeubles & Bâtiments
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Structure physique de la {activeResidence.name}. Gérez les immeubles, volumétrie en étages et parcs de lots associés.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0"
        >
          <Plus size={16} />
          <span>Ajouter un immeuble</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Total des immeubles"
          value={totalBuildings.toString()}
          subtitle="Bâtiments composant la copropriété"
          icon={Building2}
        />
        <StatCard
          title="Lots totaux répartis"
          value={totalApartments.toString()}
          subtitle="Appartements et locaux privatifs"
          icon={Home}
        />
        <StatCard
          title="Nombre total d'étages"
          value={`${totalFloors} étages`}
          subtitle="Cumul des niveaux bâtis"
          icon={Layers}
        />
        <StatCard
          title="Surface totale bâtie"
          value={`${totalArea.toLocaleString('fr-FR')} m²`}
          subtitle="Superficie privative gérée"
          icon={Maximize2}
        />
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher un immeuble par son nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            title="Rafraîchir depuis le serveur"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid of Buildings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuildings.length === 0 ? (
          <div className="col-span-full bg-white border border-[#E2DFC9] rounded-2xl p-12 text-center text-[#7F8B80]">
            <Building2 size={32} className="mx-auto text-[#B5AE9B] mb-3" />
            <p className="font-semibold text-sm text-[#18201B]">
              Aucun immeuble trouvé
            </p>
            <p className="text-xs text-[#7F8B80] mt-1">
              Cliquez sur "Ajouter un immeuble" pour créer un nouveau bâtiment dans la résidence.
            </p>
          </div>
        ) : (
          filteredBuildings.map((building) => (
            <div
              key={building.id}
              className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle flex flex-col justify-between hover:border-[#1E392A]/40 transition-all group"
            >
              <div>
                {/* Top: Icon + Name + Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#DDD9C5] flex items-center justify-center text-[#1E392A] group-hover:bg-[#1E392A] group-hover:text-white transition-all shadow-subtle shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#18201B]">
                        {building.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[#7A877B]">
                        {activeResidence.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(building)}
                      title="Modifier l'immeuble"
                      className="p-1.5 rounded-lg text-[#6E7B70] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(building)}
                      title="Supprimer l'immeuble"
                      className="p-1.5 rounded-lg text-[#8C988D] hover:text-[#BA372A] hover:bg-[#FBEBE8] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE7D8]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A877B] tracking-wider block">
                      Hauteur
                    </span>
                    <span className="text-sm font-bold text-[#18201B] mt-0.5 block">
                      {building.floorsCount} étages
                    </span>
                    <span className="text-[10px] text-[#788579]">
                      RDC à R+{building.floorsCount - 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A877B] tracking-wider block">
                      Lots gérés
                    </span>
                    <span className="text-sm font-bold text-[#18201B] mt-0.5 block">
                      {building.apartmentsCount} appartements
                    </span>
                    <span className="text-[10px] text-[#788579]">
                      {building.totalArea.toFixed(0)} m² surface
                    </span>
                  </div>
                </div>

                {/* Apartment list preview */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-[#6C786E] block mb-2">
                    Lots dans cet immeuble :
                  </span>
                  {building.apartments.length === 0 ? (
                    <span className="text-xs text-[#8F9A90] italic">
                      Aucun appartement rattaché
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {building.apartments.map((apt) => (
                        <span
                          key={apt.id}
                          className="px-2 py-0.5 rounded-md border border-[#DDD9C5] bg-white text-[11px] font-semibold text-[#18201B]"
                        >
                          {apt.unitNumber} ({apt.sizeM2} m²)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-[#EAE7D8] flex items-center justify-between">
                <span className="text-xs text-[#7F8B80]">
                  {building.occupiedCount} occupés · {building.vacantCount} vacants
                </span>

                <Link
                  to="/apartments"
                  className="flex items-center gap-1 text-xs font-semibold text-[#1E392A] hover:underline"
                >
                  <span>Gérer les lots</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <BuildingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBuilding}
        buildingToEdit={buildingToEdit}
        activeResidenceId={activeResidence.id}
        activeResidenceName={activeResidence.name}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBuilding}
        title={`Supprimer l'immeuble ${buildingToDelete?.name}`}
        message={`Êtes-vous certain de vouloir supprimer l'immeuble ${buildingToDelete?.name} ? Les appartements qui y sont rattachés devront être réassignés.`}
        confirmText="Supprimer définitivement"
        isLoading={actionLoading}
      />
    </div>
  );
}
