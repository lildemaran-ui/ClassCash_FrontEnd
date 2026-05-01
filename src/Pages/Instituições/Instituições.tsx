// src/Pages/Instituições/Instituições.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Calendar, CheckCircle, ChevronDown,
  Mail, Phone, Search, XCircle,
} from "lucide-react";
import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";

const API_BASE = "http://localhost:5000/api";

interface InstitutionPublica {
  idinstituicao: number;
  nome: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  contact_name: string;
  date_added: string;
}

// ─── Detalhes expandidos ──────────────────────────────────────────────────────
function ExpandedDetails({ inst }: { inst: InstitutionPublica }) {
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
            <span className="break-all">{inst.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{inst.phone || "—"}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {inst.address || "—"}
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
              {inst.contact_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase">
              Membro desde
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-800 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {inst.date_added
                ? new Date(inst.date_added).toLocaleDateString("pt-AO")
                : "—"}
            </div>
          </div>
        </div>

        {/* Col 3 — Status */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">
              Status
            </p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
              inst.status === "Ativo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {inst.status === "Ativo"
                ? <CheckCircle className="w-3.5 h-3.5" />
                : <XCircle className="w-3.5 h-3.5" />}
              {inst.status}
            </span>
          </div>
          {inst.status === "Inativo" && (
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
  const [institutions, setInstitutions] = useState<InstitutionPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/cadastro-instituicao/publicas`)
      .then((res) => res.json())
      .then(setInstitutions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = institutions.filter(
    (i) =>
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      (i.address ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleCadastrar = (inst: InstitutionPublica) => {
    navigate("/Cadastro", {
      state: {
        preSelectedInstitution: {
          idinstituicao: inst.idinstituicao,
          nome: inst.nome,
        },
        fromInstitutions: true,
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
      <main className="flex-1 px-4 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto">

          <p className="text-xs text-gray-400 font-medium mb-4 px-1">
            {filtered.length} instituição{filtered.length !== 1 ? "s" : ""}{" "}
            encontrada{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                A carregar instituições...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhuma instituição encontrada.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((inst) => (
                  <div key={inst.idinstituicao} className="px-4 md:px-6 py-4">

                    {/* Linha principal */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                      {/* Ícone + Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="w-5 h-5 text-[#184d8a]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900 leading-snug">
                              {inst.nome}
                            </h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              inst.status === "Ativo"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {inst.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {inst.address || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Botões */}
                      <div className="flex items-center gap-2 sm:shrink-0">
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === inst.idinstituicao ? null : inst.idinstituicao
                            )
                          }
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center"
                        >
                          Detalhes
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            expandedId === inst.idinstituicao ? "rotate-180" : ""
                          }`} />
                        </button>

                        <button
                          onClick={() => inst.status === "Ativo" && handleCadastrar(inst)}
                          disabled={inst.status === "Inativo"}
                          className={`text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm flex-1 sm:flex-none ${
                            inst.status === "Ativo"
                              ? "bg-primary text-white hover:bg-primary/80 hover:shadow-md active:scale-95"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Cadastrar‑se
                        </button>
                      </div>
                    </div>

                    {/* Detalhes expandidos */}
                    {expandedId === inst.idinstituicao && (
                      <ExpandedDetails inst={inst} />
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