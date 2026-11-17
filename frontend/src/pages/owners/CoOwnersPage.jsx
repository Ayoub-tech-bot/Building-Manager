import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  Eye,
  CheckCircle,
  Home,
  RefreshCw,
  Receipt,
  FileCheck,
  Maximize2,
  PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import OwnerDetailsModal from './OwnerDetailsModal';
import { userApi } from '../../api/userApi';
import { ownershipApi } from '../../api/ownershipApi';
import { apartmentApi } from '../../api/apartmentApi';
import { useDemoAuth } from '../../context/DemoAuthContext';

const INITIAL_DEMO_CO_OWNERS = [
  {
    id: 'owner-1',
    username: 'Karim El Amrani',
    email: 'karim.amrani@gmail.com',
    phoneNumber: '06 61 14 25 36',
    role: 'Owner',
    ownedApartments: [
      { id: 1, unitNumber: 'A-12', buildingName: 'Bâtiment A', floor: 2, sizeM2: 86.0 },
    ],
    accountStatus: 'partial', // partial balance due
    balanceDue: 300,
  },
  {
    id: 'owner-2',
    username: 'Youssef Tazi',
    email: 'youssef.tazi@outlook.com',
    phoneNumber: '06 62 88 99 00',
    role: 'Owner',
    ownedApartments: [
      { id: 2, unitNumber: 'B-04', buildingName: 'Bâtiment B', floor: 0, sizeM2: 92.5 },
    ],
    accountStatus: 'late',
    balanceDue: 900,
  },
  {
    id: 'owner-3',
    username: 'Salma Idrissi',
    email: 'salma.idrissi@gmail.com',
    phoneNumber: '06 63 45 67 89',
    role: 'Owner',
    ownedApartments: [
      { id: 3, unitNumber: 'C-08', buildingName: 'Bâtiment C', floor: 1, sizeM2: 74.0 },
    ],
    accountStatus: 'late',
    balanceDue: 600,
  },
  {
    id: 'owner-4',
    username: 'Omar Berrada',
    email: 'omar.berrada@yahoo.fr',
    phoneNumber: '06 70 12 34 56',
    role: 'Owner',
    ownedApartments: [
      { id: 4, unitNumber: 'A-03', buildingName: 'Bâtiment A', floor: 0, sizeM2: 86.0 },
    ],
    accountStatus: 'late',
    balanceDue: 600,
  },
  {
    id: 'owner-5',
    username: 'Mehdi Amrani',
    email: 'mehdi.amrani@gmail.com',
    phoneNumber: '06 68 55 44 33',
    role: 'Owner',
    ownedApartments: [
      { id: 5, unitNumber: 'B-07', buildingName: 'Bâtiment B', floor: 2, sizeM2: 110.0 },
    ],
    accountStatus: 'paid',
    balanceDue: 0,
  },
  {
    id: 'owner-6',
    username: 'Amina Chraïbi',
    email: 'amina.chraibi@menara.ma',
    phoneNumber: '06 65 21 43 65',
    role: 'Owner',
    ownedApartments: [
      { id: 6, unitNumber: 'C-02', buildingName: 'Bâtiment C', floor: 0, sizeM2: 68.0 },
    ],
    accountStatus: 'paid',
    balanceDue: 0,
  },
];

export default function CoOwnersPage() {
  const { activeResidence } = useDemoAuth();

  const [coOwners, setCoOwners] = useState(INITIAL_DEMO_CO_OWNERS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOwnerForDetails, setSelectedOwnerForDetails] = useState(null);

  // Fetch from backend
  const fetchCoOwners = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getByRole('Owner');
      if (Array.isArray(data) && data.length > 0) {
        const enriched = await Promise.all(
          data.map(async (owner) => {
            try {
              const ownedApartments = await ownershipApi.getByOwner(owner.id);
              return {
                ...owner,
                ownedApartments: ownedApartments || [],
                accountStatus: 'paid',
                balanceDue: 0,
              };
            } catch {
              return { ...owner, ownedApartments: [], accountStatus: 'paid', balanceDue: 0 };
            }
          })
        );
        // Only keep owners who hold at least 1 apartment in this residence
        const activeCoOwners = enriched.filter(
          (o) => o.ownedApartments && o.ownedApartments.length > 0
        );
        if (activeCoOwners.length > 0) {
          setCoOwners(activeCoOwners);
        }
      }
    } catch {
      // Backend offline: keep initial demo data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoOwners();
  }, []);

  // Filtered calculation
  const filteredCoOwners = useMemo(() => {
    return coOwners.filter((co) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        co.username.toLowerCase().includes(search) ||
        co.email.toLowerCase().includes(search) ||
        (co.phoneNumber && co.phoneNumber.includes(search)) ||
        co.ownedApartments.some(
          (a) =>
            a.unitNumber.toLowerCase().includes(search) ||
            (a.buildingName && a.buildingName.toLowerCase().includes(search))
        );

      let matchesBuilding = true;
      if (buildingFilter !== 'ALL') {
        matchesBuilding = co.ownedApartments.some((a) => {
          const bName = a.buildingName || '';
          return bName.includes(buildingFilter) || a.unitNumber.startsWith(buildingFilter);
        });
      }

      let matchesStatus = true;
      if (statusFilter === 'UP_TO_DATE') {
        matchesStatus = co.accountStatus === 'paid' || co.balanceDue === 0;
      } else if (statusFilter === 'DEBT') {
        matchesStatus = co.accountStatus === 'late' || co.accountStatus === 'partial' || co.balanceDue > 0;
      }

      return matchesSearch && matchesBuilding && matchesStatus;
    });
  }, [coOwners, searchTerm, buildingFilter, statusFilter]);

  // Statistics
  const totalCoOwners = coOwners.length;
  const totalLots = coOwners.reduce(
    (acc, co) => acc + (co.ownedApartments ? co.ownedApartments.length : 0),
    0
  );
  const totalArea = coOwners.reduce((acc, co) => {
    const area = (co.ownedApartments || []).reduce(
      (sum, a) => sum + (Number(a.sizeM2) || 0),
      0
    );
    return acc + area;
  }, 0);
  const upToDateCount = coOwners.filter(
    (co) => co.accountStatus === 'paid' || co.balanceDue === 0
  ).length;

  const handleOpenDetails = (owner) => {
    setSelectedOwnerForDetails(owner);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Copropriétaires de la Résidence
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Titulaires de droits réels dans la {activeResidence.name}. Suivi des quotes-parts, tantièmes et situation comptable.
          </p>
        </div>

        <Link
          to="/owners"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDD9C5] bg-white text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle shrink-0"
        >
          <Users size={15} />
          <span>Gérer tous les propriétaires</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Copropriétaires actifs"
          value={totalCoOwners.toString()}
          subtitle="Titulaires d'au moins un lot"
          icon={Users}
        />
        <StatCard
          title="Lots détenus"
          value={totalLots.toString()}
          subtitle="Appartements et locaux privatifs"
          icon={Building}
        />
        <StatCard
          title="Surface privative totale"
          value={`${totalArea.toLocaleString('fr-FR')} m²`}
          subtitle="Base du calcul des tantièmes"
          icon={Maximize2}
        />
        <StatCard
          title="Comptes à jour"
          value={`${upToDateCount} / ${totalCoOwners}`}
          subtitle={`${Math.round((upToDateCount / (totalCoOwners || 1)) * 100)} % sans impayé de charges`}
          icon={FileCheck}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, lot (ex: A-12), bâtiment ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-[#FAF9F5] text-[#18201B] placeholder-[#8C988D] focus:bg-white focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Building Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Bâtiment :</span>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les bâtiments</option>
              <option value="A">Bâtiment A</option>
              <option value="B">Bâtiment B</option>
              <option value="C">Bâtiment C</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#DDD9C5] px-3 py-1.5 rounded-xl">
            <span className="text-[#6E7B70] font-medium">Situation :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#18201B] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes situations</option>
              <option value="UP_TO_DATE">À jour de charges</option>
              <option value="DEBT">Avec solde débiteur</option>
            </select>
          </div>

          <button
            onClick={fetchCoOwners}
            title="Rafraîchir depuis le serveur"
            className="p-2 rounded-xl border border-[#DDD9C5] bg-white hover:bg-[#F2EFE4] text-[#6E7B70] hover:text-[#18201B] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#E2DFC9] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE7D8] bg-[#FAF9F5] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-6">Copropriétaire</th>
                <th className="py-3.5 px-4">Lots détenus</th>
                <th className="py-3.5 px-4">Surface & Tantièmes</th>
                <th className="py-3.5 px-4">Situation des charges</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE3]">
              {filteredCoOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#7F8B80]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users size={28} className="mx-auto text-[#B5AE9B]" />
                      <p className="font-semibold text-sm text-[#18201B]">
                        Aucun copropriétaire trouvé
                      </p>
                      <p className="text-xs text-[#7F8B80]">
                        Aucun copropriétaire ne correspond aux filtres sélectionnés.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoOwners.map((co) => {
                  const ownerArea = co.ownedApartments.reduce(
                    (s, a) => sumArea(s, a.sizeM2),
                    0
                  );
                  const isUpToDate = co.accountStatus === 'paid' || co.balanceDue === 0;

                  return (
                    <tr
                      key={co.id}
                      className="hover:bg-[#FAF9F5] transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-subtle">
                            {co.username
                              ? co.username.substring(0, 2).toUpperCase()
                              : 'CP'}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#18201B]">
                              {co.username}
                            </div>
                            <div className="text-[11px] text-[#717E73] flex items-center gap-2 mt-0.5">
                              <span>{co.email}</span>
                              {co.phoneNumber && (
                                <>
                                  <span>·</span>
                                  <span>{co.phoneNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owned Lots */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {co.ownedApartments.map((apt) => (
                            <span
                              key={apt.id}
                              className="px-2.5 py-1 rounded-lg border border-[#DDD9C5] bg-[#F7F6F1] font-semibold text-xs text-[#18201B] shadow-subtle"
                            >
                              Lot {apt.unitNumber}
                              {apt.buildingName ? ` · ${apt.buildingName}` : ''}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Surface & Tantiemes */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#18201B]">
                          {ownerArea.toFixed(1)} m²
                        </div>
                        <div className="text-[11px] text-[#7F8B80]">
                          {totalArea > 0
                            ? `${((ownerArea / totalArea) * 1000).toFixed(0)} / 1000e tantièmes`
                            : ''}
                        </div>
                      </td>

                      {/* Charges status */}
                      <td className="py-4 px-4">
                        {isUpToDate ? (
                          <StatusBadge status="paid" label="À jour (0 DH)" />
                        ) : co.accountStatus === 'partial' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF8EB] border border-[#FDE6B8] text-[#8C5E0D]">
                            Solde : {co.balanceDue} DH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FBEBE8] border border-[#F4BEB7] text-[#BA372A]">
                            En retard : {co.balanceDue} DH
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetails(co)}
                            title="Voir la fiche détaillée"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          <Link
                            to="/fees"
                            title="Accéder aux charges de ce copropriétaire"
                            className="p-1.5 rounded-lg text-[#667368] hover:text-[#1E392A] hover:bg-[#EAE7D8] transition-colors"
                          >
                            <Receipt size={15} />
                          </Link>
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
            Affichage de {filteredCoOwners.length} sur {totalCoOwners} copropriétaires
          </span>
          <span className="font-semibold text-[#18201B]">
            Surface totale attribuée : {totalArea.toFixed(1)} m²
          </span>
        </div>
      </div>

      {/* Details Modal */}
      <OwnerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        owner={selectedOwnerForDetails}
      />
    </div>
  );
}

function sumArea(sum, size) {
  return sum + (Number(size) || 0);
}
