import React from 'react';
import {
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Receipt,
  Megaphone,
  FileText,
  Download,
  AlertCircle,
  FileCheck,
  Phone,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { OWNER_DASHBOARD_DATA } from '../../mock/dashboardMockData';

export default function OwnerDashboard() {
  const data = OWNER_DASHBOARD_DATA;

  return (
    <div className="space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Bonjour Karim,
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Votre appartement, vos comptes et la vie de votre résidence.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0">
          <Plus size={16} />
          <span>Nouvelle demande</span>
        </button>
      </div>

      {/* Top Banner Row: Apartment Summary Card & Balance Due Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apartment Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-[#E2DFC9] rounded-2xl overflow-hidden shadow-subtle flex flex-col md:flex-row">
          <div className="relative md:w-2/5 h-48 md:h-auto shrink-0 bg-[#E8E6DB]">
            <img
              src={data.apartment.imageUrl}
              alt={data.apartment.residence}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-[#1E392A]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
              RÉSIDENCE LES OLIVIERS
            </div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-[#79857A] uppercase">
                  Mon appartement
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[#D5D1BD] bg-[#FAF9F5] text-[#3C473E] font-medium text-[11px]">
                  Propriétaire
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#18201B] mt-2">
                {data.apartment.unit}
              </h2>
              <p className="text-xs text-[#5D6A5E] mt-1">
                {data.apartment.buildingName
                  ? `${data.apartment.buildingName} · ${
                      data.apartment.floor !== undefined && data.apartment.floor !== null
                        ? data.apartment.floor === 0
                          ? 'RDC'
                          : `${data.apartment.floor}e étage`
                        : ''
                    } · ${data.apartment.sizeM2} m²`
                  : data.apartment.details}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE7D8] flex items-center justify-between">
              <span className="text-xs text-[#7F8B80]">
                Propriétaire depuis le {data.apartment.sinceDate}
              </span>
              <a
                href="#apartment-profile"
                className="text-xs font-semibold text-[#1E392A] hover:underline flex items-center gap-1"
              >
                <span>Voir ma fiche</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Balance Card (1 Column, Dark Green) */}
        <div className="bg-[#1E392A] text-white rounded-2xl p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-200/80">
                Votre reste à régler
              </span>
              <div className="p-1.5 rounded-lg bg-white/10 text-white">
                <Receipt size={17} />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-4xl font-bold tracking-tight">
                {formatCurrency(data.solde.resteARegler)}
              </span>
            </div>

            <div className="mt-3 text-xs text-emerald-100/90 space-y-1">
              <div>{data.solde.periodDetail}</div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <span>✓</span>
                <span>{data.solde.alreadyPaidNote}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/15 text-[11px] text-emerald-200/70">
            {data.solde.syndicNote}
          </div>
        </div>
      </div>

      {/* Middle Section: 2/3 (Left) and 1/3 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Mes charges et paiements */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#18201B]">
                  Mes charges et paiements
                </h2>
                <p className="text-xs text-[#6A766B] mt-0.5">
                  Appartement A-12 · trois derniers mois
                </p>
              </div>
              <a
                href="#all-fees"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Tout consulter</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Fees Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAE7D8] text-[#7F8B80] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-medium">Période</th>
                    <th className="pb-3 font-medium">Charge</th>
                    <th className="pb-3 font-medium">Versé</th>
                    <th className="pb-3 font-medium">Reste dû</th>
                    <th className="pb-3 font-medium text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE3]">
                  {data.chargesEtPaiements.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 font-medium text-[#18201B]">
                        {row.period}
                      </td>
                      <td className="py-3.5 text-[#5F6C60]">
                        {formatCurrency(row.charge)}
                      </td>
                      <td className="py-3.5 text-[#5F6C60]">
                        {formatCurrency(row.verse)}
                      </td>
                      <td className="py-3.5 font-bold text-[#18201B]">
                        {formatCurrency(row.resteDu)}
                      </td>
                      <td className="py-3.5 text-right">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Last payment highlight box */}
            <div className="mt-5 p-3.5 bg-[#FAF9F5] border border-[#EAE7D8] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E8F2EC] flex items-center justify-center text-[#1F6B43] shrink-0">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <span className="font-semibold text-[#18201B]">
                    Dernier paiement : {formatCurrency(data.dernierPaiementNotice.amount)}
                  </span>
                  <span className="text-[#717E73] ml-1.5">
                    · {data.dernierPaiementNotice.date}
                  </span>
                  <div className="text-[11px] text-[#7F8C80] mt-0.5">
                    {data.dernierPaiementNotice.description}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={15} className="text-[#849185]" />
            </div>
          </div>

          {/* Card: Mes demandes */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#18201B]">
                Mes demandes
              </h2>
              <a
                href="#all-requests"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Toutes mes demandes</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="space-y-3">
              {data.demandes.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-[#EAE7D8] bg-[#FAF9F5] hover:border-[#D6D2BF] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-[#18201B]">
                        {req.title}
                      </div>
                      <div className="text-xs text-[#717E73] mt-0.5">
                        {req.type}
                      </div>
                      <div className="text-xs text-[#525E54] mt-2 font-medium">
                        {req.feedback}
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-5 pt-4 border-t border-[#EAE7D8] flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle">
                <Plus size={14} />
                <span>Signaler un problème</span>
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDD9C5] text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-all shadow-subtle">
                <FileCheck size={14} />
                <span>Demander une autorisation</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Announcement Card */}
          <div className="bg-[#FAF4EB] border border-[#EBDDC8] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8B6734] uppercase tracking-wider mb-2">
              <div className="flex items-center gap-1.5">
                <Megaphone size={13} />
                <span>VIE DE LA RÉSIDENCE</span>
              </div>
              <span className="text-[#967749] lowercase font-normal">
                Publié le 15 oct.
              </span>
            </div>

            <h3 className="font-bold text-sm text-[#18201B] mt-1">
              Coupure d'eau programmée
            </h3>

            <p className="text-xs text-[#5E584E] mt-1.5 leading-relaxed">
              Mardi 20 octobre, de 9 h à 12 h. Intervention sur le réseau d'eau de la résidence.
            </p>

            <div className="mt-4 pt-3 border-t border-[#E8D9C2] flex items-center justify-between text-xs">
              <span className="text-[#847869] text-[11px]">
                Toute la résidence
              </span>
              <a
                href="#announcements"
                className="font-semibold text-[#1E392A] hover:underline flex items-center gap-1"
              >
                <span>Lire l'annonce</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Useful Documents */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#18201B]">
                Documents utiles
              </h2>
              <a
                href="#documents"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Tous</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="space-y-3">
              {data.documentsUtiles.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F5] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={17} className="text-[#7F8B80] shrink-0" />
                    <div>
                      <div className="font-semibold text-xs text-[#18201B]">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#7F8C80]">
                        {doc.scope}
                      </div>
                    </div>
                  </div>

                  <button
                    title="Télécharger"
                    className="p-1.5 rounded-lg text-[#7F8B80] hover:text-[#18201B] hover:bg-[#EAE7D8] transition-colors"
                  >
                    <Download size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Votre Syndic Card */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-5 shadow-subtle">
            <div className="text-[10px] font-semibold text-[#79857A] tracking-wider uppercase mb-3">
              Votre syndic
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs tracking-wider">
                NA
              </div>
              <div>
                <div className="font-bold text-sm text-[#18201B]">
                  {data.syndicContact.name}
                </div>
                <div className="text-xs text-[#6F7B70]">
                  {data.syndicContact.hours}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7D8] flex items-center gap-2 text-sm font-bold text-[#18201B]">
              <Phone size={15} className="text-[#647165]" />
              <span>{data.syndicContact.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice Footer */}
      <div className="flex items-center gap-2 text-xs text-[#7F8B80] pt-2">
        <ShieldCheck size={14} className="text-[#657266]" />
        <span>Votre espace personnel · seules vos informations sont affichées.</span>
      </div>
    </div>
  );
}

