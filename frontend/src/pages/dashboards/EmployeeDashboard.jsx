import React from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Megaphone,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  ArrowRight,
  Building,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { EMPLOYEE_DASHBOARD_DATA } from '../../mock/dashboardMockData';

export default function EmployeeDashboard() {
  const data = EMPLOYEE_DASHBOARD_DATA;

  return (
    <div className="space-y-6">
      {/* Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18201B]">
            Bonjour Rachid,
          </h1>
          <p className="text-sm text-[#5B675C] mt-1">
            Vos interventions assignées, planning de travail et urgences du jour.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-all shadow-subtle shrink-0">
          <Plus size={16} />
          <span>Rapport d'intervention</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="primary"
          title="Interventions assignées"
          value={data.stats.assignedInterventions.toString()}
          subtitle="2 urgentes aujourd'hui"
          icon={Wrench}
        />
        <StatCard
          title="Tâches complétées"
          value={data.stats.resolvedThisMonth.toString()}
          subtitle="Ce mois-ci · Résidence Les Oliviers"
          icon={CheckCircle2}
        />
        <StatCard
          title="Heures effectuées"
          value={`${data.stats.weeklyHours}h`}
          subtitle="Semaine du 12 au 18 octobre"
          icon={Clock}
        />
        <StatCard
          title="Statut d'astreinte"
          value="En service"
          subtitle="Jusqu'à 18h00 aujourd'hui"
          icon={ShieldCheck}
        />
      </div>

      {/* Main Grid: 2/3 (Left) and 1/3 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Interventions Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#18201B]">
                  Feuille de route du jour
                </h2>
                <p className="text-xs text-[#6A766B] mt-0.5">
                  Interventions techniques et maintenance programmée
                </p>
              </div>
              <a
                href="#all-tasks"
                className="text-xs font-medium text-[#18201B] hover:text-[#1E392A] flex items-center gap-1"
              >
                <span>Toutes les tâches</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="space-y-3">
              {data.interventions.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-[#EAE7D8] bg-[#FAF9F5] hover:border-[#D6D2BF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded border border-[#DDD9C5] bg-[#F7F6F1] font-semibold text-[11px] text-[#18201B]">
                        {task.unit}
                      </span>
                      <span className="text-xs text-[#6B786C] font-medium">
                        {task.resident}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#FAF1E6] text-[#8C5D23]">
                        {task.urgency}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#18201B]">
                      {task.title}
                    </div>

                    <div className="text-xs text-[#7A877B] flex items-center gap-1">
                      <Clock size={12} />
                      <span>{task.scheduledDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={task.status} />
                    <button className="px-3 py-1.5 rounded-lg bg-[#1E392A] text-white text-xs font-medium hover:bg-[#162C20] transition-colors">
                      Mettre à jour
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE7D8] flex items-center justify-between text-xs text-[#7B877C]">
              <span>3 interventions programmées pour cette journée</span>
              <button className="font-semibold text-[#1E392A] hover:underline">
                Télécharger la feuille de route PDF →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Syndic Contact Box */}
          <div className="bg-white border border-[#E2DFC9] rounded-2xl p-5 shadow-subtle">
            <div className="text-[10px] font-semibold text-[#79857A] tracking-wider uppercase mb-3">
              Contact Syndic Direct
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs tracking-wider">
                NA
              </div>
              <div>
                <div className="font-bold text-sm text-[#18201B]">
                  Nora Alaoui (Syndic)
                </div>
                <div className="text-xs text-[#6F7B70]">
                  Permanence technique
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE7D8] flex items-center gap-2 text-sm font-bold text-[#18201B]">
              <Phone size={15} className="text-[#647165]" />
              <span>05 22 44 18 60</span>
            </div>
          </div>

          {/* Announcement Card */}
          <div className="bg-[#FAF4EB] border border-[#EBDDC8] rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8B6734] uppercase tracking-wider mb-2">
              <div className="flex items-center gap-1.5">
                <Megaphone size={13} />
                <span>INFO TECHNIQUE RÉSIDENCE</span>
              </div>
              <span className="text-[#967749] lowercase font-normal">
                Publié le 15 oct.
              </span>
            </div>

            <h3 className="font-bold text-sm text-[#18201B] mt-1">
              Coupure d'eau programmée
            </h3>

            <p className="text-xs text-[#5E584E] mt-1.5 leading-relaxed">
              Mardi 20 octobre, de 9 h à 12 h. Accompagner l'équipe de plomberie lors de la coupure générale.
            </p>

            <div className="mt-4 pt-3 border-t border-[#E8D9C2] flex items-center justify-between text-xs">
              <span className="text-[#847869] text-[11px]">
                Consigne pour le personnel
              </span>
              <a
                href="#announcements"
                className="font-semibold text-[#1E392A] hover:underline flex items-center gap-1"
              >
                <span>Détails</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

