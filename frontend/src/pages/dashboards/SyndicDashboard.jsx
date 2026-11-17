import React from 'react';
import {
  Wallet,
  Wrench,
  FileCheck,
  Plus,
  Receipt,
  Megaphone,
  ArrowUpRight,
  CheckCircle2,
  FolderClosed,
  ChevronDown,
  ArrowRight,
  ArrowRightLeft,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { SYNDIC_DASHBOARD_DATA } from '../../mock/dashboardMockData';

export default function SyndicDashboard() {
  const data = SYNDIC_DASHBOARD_DATA;

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            La résidence en un regard
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Suivez les comptes et les sujets qui demandent votre attention.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle">
            <Receipt size={15} className="text-[#647165]" />
            <span>Générer les charges</span>
          </button>

          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle">
            <Megaphone size={15} className="text-[#647165]" />
            <span>Publier une annonce</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle">
            <Plus size={16} />
            <span>Enregistrer un paiement</span>
          </button>
        </div>
      </div>

      {/* Date & Period Indicator */}
      <div className="flex items-center gap-2 text-xs text-[#6F7B70]">
        <button className="font-semibold text-[#18201B] flex items-center gap-1 hover:text-[#1E392A]">
          <span>Octobre 2026</span>
          <ChevronDown size={14} />
        </button>
        <span>·</span>
        <span>Situation au 16 octobre</span>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Solde total à recouvrer"
          value={formatCurrency(data.stats.soldeTotalARecouvrer)}
          subtitle={data.stats.soldeDetails}
          icon={Receipt}
        />
        <StatCard
          title="Paiements enregistrés"
          value={formatCurrency(data.stats.paiementsEnregistres)}
          subtitle={data.stats.paiementsDetails}
          icon={Wallet}
        />
        <StatCard
          title="Interventions ouvertes"
          value={data.stats.interventionsOuvertes.toString()}
          subtitle={data.stats.interventionsDetails}
          icon={Wrench}
        />
        <StatCard
          title="Autorisations en attente"
          value={data.stats.autorisationsEnAttente.toString()}
          subtitle={data.stats.autorisationsDetails}
          icon={FileCheck}
        />
      </div>

      {/* Main Grid: 2/3 (Left) and 1/3 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Columns on Large Screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Charges à suivre */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-[#18201B]">
                  Charges à suivre
                </h2>
                <p className="text-xs text-[#6A766B] mt-0.5">
                  12 appartements avec un solde à régler
                </p>
              </div>
              <a
                href="#fees"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Toutes les charges</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Recovery Progress Bar */}
            <div className="mt-5 p-4 bg-[#F9F8F3] border border-[#EAE7D8] rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[#5A665B]">
                  Recouvrement · octobre 2026
                </span>
                <span className="font-semibold text-[#18201B]">
                  21 900 / 28 800 DH · 76 %
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#E4E0D0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1E392A] rounded-full transition-all duration-500"
                  style={{ width: `${data.recouvrement.percentage}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] text-[#788579]">
                {data.recouvrement.subtext}
              </div>
            </div>

            {/* Overdue Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAE7D8] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-medium">Appartement / Propriétaire</th>
                    <th className="pb-3 font-medium">Période</th>
                    <th className="pb-3 font-medium">Solde dû</th>
                    <th className="pb-3 font-medium text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE3]">
                  {data.chargesASuivre.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded border border-[#DDD9C5] bg-[#F7F6F1] font-semibold text-[11px] text-[#18201B]">
                            {row.unit}
                          </span>
                          <span className="font-medium text-[#18201B]">
                            {row.owner}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#5F6C60]">{row.period}</td>
                      <td className="py-3.5 font-bold text-[#18201B]">
                        {formatCurrency(row.balanceDue)}
                      </td>
                      <td className="py-3.5 text-right">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7D8] text-xs text-[#7B877C]">
              4 sur 12 appartements affichés · solde total : 7 200 DH
            </div>
          </div>

          {/* Card: Derniers paiements enregistrés */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#18201B]">
                Derniers paiements enregistrés
              </h2>
              <a
                href="#payments"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Historique</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="divide-y divide-[#F1EFE3]">
              {data.derniersPaiements.map((payment, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex items-center justify-between hover:bg-[#FAF9F5] px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E8F2EC] flex items-center justify-center text-[#1F6B43] shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#7F8C80] font-medium">{payment.date}</span>
                        <span className="font-semibold text-[#18201B]">
                          {payment.unit} · {payment.owner}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7F8C80]">
                        {payment.by}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold text-sm text-[#18201B]">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7D8] text-[11px] text-[#7B877C]">
              Les paiements sont enregistrés manuellement par votre équipe.
            </div>
          </div>

          {/* Callout Banner: Documents */}
          <div className="bg-[#ECEAE0] border border-[#DDD9C5] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1E392A] shadow-sm">
                <FolderClosed size={20} />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#18201B]">
                  Les documents au bon endroit
                </div>
                <div className="text-xs text-[#5D6A5E] mt-0.5">
                  Résidence, appartement ou propriétaire : gardez la bonne visibilité.
                </div>
              </div>
            </div>

            <button className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle">
              Gérer
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Card: Demandes à traiter */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#18201B]">
                Demandes à traiter
              </h2>
              <a
                href="#requests"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Tout voir</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="space-y-3">
              {data.demandesATraiter.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-[#EAE7D8] bg-[#FDFDFC] hover:border-[#D6D2BF] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-semibold text-[#79857A] tracking-wider uppercase">
                        {item.type}
                      </div>
                      <div className="font-semibold text-xs text-[#18201B] mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#69756A] mt-0.5">
                        {item.details}
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7D8] text-[11px] text-[#7B877C]">
              8 interventions ouvertes · 3 autorisations en attente
            </div>
          </div>

          {/* Announcement Card (Warm Tan Background) */}
          <div className="bg-[#FAF4EB] border border-[#EBDDC8] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8B6734] uppercase tracking-wider mb-2">
              <div className="flex items-center gap-1.5">
                <Megaphone size={13} />
                <span>{data.annonce.category}</span>
              </div>
              <span className="text-[#967749] lowercase font-normal">
                {data.annonce.publishedDate}
              </span>
            </div>

            <h3 className="font-bold text-sm text-[#18201B] mt-1">
              {data.annonce.title}
            </h3>

            <p className="text-xs text-[#5E584E] mt-1.5 leading-relaxed">
              {data.annonce.body}
            </p>

            <div className="mt-4 pt-3 border-t border-[#E8D9C2] flex items-center justify-between text-xs">
              <span className="text-[#847869] text-[11px]">
                {data.annonce.audience}
              </span>
              <a
                href="#announcements"
                className="font-semibold text-[#1E392A] hover:underline flex items-center gap-1"
              >
                <span>Voir l'annonce</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Card: Activité récente */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#18201B]">
                Activité récente
              </h2>
              <a
                href="#log"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Journal</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="space-y-3.5">
              {data.activiteRecente.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#F5F4EE] text-[#556156] mt-0.5">
                    {act.type === 'payment' && <Wallet size={14} />}
                    {act.type === 'announcement' && <Megaphone size={14} />}
                    {act.type === 'ownership' && <ArrowRightLeft size={14} />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#18201B]">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-[#717E73] mt-0.5">
                      {act.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

