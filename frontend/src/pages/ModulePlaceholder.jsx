import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModulePlaceholder({ title, description, moduleName }) {
  return (
    <div className="bg-white border border-[#E2DFC9] rounded-2xl p-8 shadow-subtle max-w-3xl">
      <div className="flex items-center gap-3 text-[#1E392A]">
        <div className="w-12 h-12 rounded-xl bg-[#E8F2EC] flex items-center justify-center">
          <Construction size={24} className="text-[#1F6B43]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#18201B]">{title}</h1>
          <p className="text-xs text-[#626F63] mt-0.5">{moduleName}</p>
        </div>
      </div>

      <div className="mt-6 text-sm text-[#4E5B50] leading-relaxed border-t border-[#EAE7D8] pt-4">
        {description ||
          "Ce module sera développé dans la Phase 4 avec l'intégration complète des formulaires, tables et opérations backend."}
      </div>

      <div className="mt-6 pt-4 border-t border-[#EAE7D8] flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E392A] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Retour au tableau de bord</span>
        </Link>
        <span className="text-[11px] text-[#869287]">
          Architecture prête pour intégration REST
        </span>
      </div>
    </div>
  );
}

