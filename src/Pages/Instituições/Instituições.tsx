// src/Pages/Instituições/Instituições.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  XCircle,
  ChevronDown,
  Search,
} from "lucide-react";
import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";
import { useInstitutions } from "@/Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext ";
import type { Institution } from "@/Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext ";

// ─── Detalhes expandidos (só leitura) ────────────────────────────────────────
function ExpandedDetails({ institution }: { institution: Institution }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
        {/* Col 1 — Contacto */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Contacto
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">{institution.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{institution.phone}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {institution.address}
          </p>
        </div>

        {/* Col 2 — Informações */}
        <div className="p-5 space-y-4">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Informações
          </p>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">
              Responsável
            </p>
            <p className="text-sm text-gray-800 mt-0.5">
              {institution.contactName}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">
              Membro desde
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-800 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {institution.dateAdded}
            </div>
          </div>
        </div>

        {/* Col 3 — Status */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">
              Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                institution.status === "Ativo"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {institution.status === "Ativo" ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {institution.status}
            </span>
          </div>
          {institution.status === "Inativo" && (
            <p className="text-xs text-gray-400 mt-3 italic">
              Esta instituição não está a aceitar novos registos de momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Instituicoes() {
  const navigate = useNavigate();
  const { institutions } = useInstitutions();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCadastrar = (inst: Institution) => {
    navigate("/Cadastro", {
      state: {
        preSelectedInstitution: {
          idinstituicao: inst.id,
          nome: inst.name,
        },
        fromInstitutions:true
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f5fa] flex flex-col font-sans">
      <MenuEstatico />

      {/* Hero */}
      <section className="pt-36 pb-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 max-w-2xl mx-auto leading-tight">
          Encontre a sua instituição e
          <span className="text-[#184d8a]"> registe‑se hoje</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
          Confira as instituições parceiras da plataforma. Clique em
          <strong className="text-gray-700"> "Cadastrar-se"</strong> para criar
          a sua conta automaticamente vinculada à instituição escolhida.
        </p>

        {/* Pesquisa */}
        <div className="relative max-w-md mx-auto mt-8">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar instituição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#184d8a]/30 transition"
          />
        </div>
      </section>

      {/* Lista */}
      <main className="flex-1 px-6 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-xs text-gray-400 font-medium">
              {filtered.length} instituição{filtered.length !== 1 ? "s" : ""}{" "}
              encontrada{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhuma instituição encontrada.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((inst) => (
                  <div key={inst.id} className="px-6 py-4">
                    {/* Linha principal */}
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#184d8a]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {inst.name}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              inst.status === "Ativo"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {inst.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {inst.address}
                        </p>
                      </div>

                      {/* Acções */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === inst.id ? null : inst.id,
                            )
                          }
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Detalhes
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedId === inst.id ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Botão Cadastrar-se — desactivado se Inativo */}
                        <button
                          onClick={() =>
                            inst.status === "Ativo" && handleCadastrar(inst)
                          }
                          disabled={inst.status === "Inativo"}
                          className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all duration-200 shadow-sm ${
                            inst.status === "Ativo"
                              ? "bg-[#184d8a] text-white hover:bg-blue-600 hover:shadow-md active:scale-95"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Cadastrar‑se
                        </button>
                      </div>
                    </div>

                    {/* Detalhes expandidos */}
                    {expandedId === inst.id && (
                      <ExpandedDetails institution={inst} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
