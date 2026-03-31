// src/Pages/Administrador/GestaoInstituicaoAdmin/GestaoDeInstituicao.tsx
// FIX: URL do POST era "/api" — corrigido para "/api/cadastro-instituicao" (rota correcta)
// FIX: Interface Institution actualizada com idinstituicao

import MenuAdmin from "@/components/Menu/MenuAdmin";
import {
  ArrowUp, Bell, Building2, Calendar, CheckCircle, ChevronDown,
  CircleUser, ImagePlus, Loader2, Mail, Minus, Phone, Plus, Search, X, XCircle,
} from "lucide-react";
import React from "react";
import { useInstitutions } from "@/Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext ";
import type { Institution } from "@/Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext ";

const API_BASE = "http://localhost:5000/api";

const TIPOS_INSTITUICAO = [
  { id: 1, label: "Privada" }, // conforme tabela tipoinstituicao na BD
];

interface FormState {
  nome: string; email: string; localizacao: string; contacto: string;
  nif: string; iban: string; idTipoInstituicao: number;
  logoFile: File | null; logoPreview: string | null;
  nomeRepresentante: string; emailRepresentante: string;
  numTelRepresentante: string; senhaRepresentante: string;
}

interface ApiMsg { texto: string; tipo: "sucesso" | "erro" }

interface ModalProps {
  onClose: () => void;
  onCreated: (inst: Institution) => void;
}

function AddInstitutionModal({ onClose, onCreated }: ModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [apiMsg, setApiMsg] = React.useState<ApiMsg | null>(null);
  const [createAdmin, setCreateAdmin] = React.useState(false);
  const [form, setForm] = React.useState<FormState>({
    nome: "", email: "", localizacao: "", contacto: "", nif: "", iban: "",
    idTipoInstituicao: 1, logoFile: null, logoPreview: null,
    nomeRepresentante: "", emailRepresentante: "", numTelRepresentante: "", senhaRepresentante: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setForm((prev) => ({ ...prev, logoFile: file, logoPreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!form.nome.trim() || !form.email.trim() || !form.iban.trim()) {
      setApiMsg({ texto: "Nome, email e IBAN são obrigatórios.", tipo: "erro" });
      return;
    }
    if (createAdmin && (!form.nomeRepresentante.trim() || !form.emailRepresentante.trim() || !form.senhaRepresentante.trim())) {
      setApiMsg({ texto: "Nome, email e senha do representante são obrigatórios.", tipo: "erro" });
      return;
    }

    setLoading(true);
    setApiMsg(null);

    try {
      const fd = new FormData();
      fd.append("nome", form.nome.trim());
      fd.append("email", form.email.trim());
      fd.append("iban", form.iban.trim());
      fd.append("idTipoInstituicao", String(form.idTipoInstituicao));
      if (form.localizacao.trim()) fd.append("localizacao", form.localizacao.trim());
      if (form.contacto.trim()) fd.append("contacto", form.contacto.trim());
      if (form.nif.trim()) fd.append("nif", form.nif.trim());
      if (form.logoFile) fd.append("logotipo", form.logoFile);
      fd.append("nomeRepresentante", form.nomeRepresentante.trim() || "Administrador");
      fd.append("emailRepresentante", form.emailRepresentante.trim() || form.email.trim());
      fd.append("senhaRepresentante", form.senhaRepresentante.trim() || "provisorio123");
      if (form.numTelRepresentante.trim()) fd.append("numTelRepresentante", form.numTelRepresentante.trim());

      const token = localStorage.getItem("Token");
      const res = await fetch(`${API_BASE}/cadastro-instituicao`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      const data = (await res.json()) as {
        message?: string; error?: string; detalhe?: string;
        instituicao?: { idinstituicao: number };
      };

      if (!res.ok) throw new Error(data.error ?? data.detalhe ?? "Erro ao cadastrar instituição");

      // Adicionar uma verificação explícita para o ID da instituição
      if (!data.instituicao?.idinstituicao) {
        throw new Error("ID da instituição não retornado pela API após cadastro.");
      }

      const novaInst: Institution = {
        id: data.instituicao.idinstituicao, // Agora sabemos que é um número válido
        idinstituicao: data.instituicao.idinstituicao, // Agora sabemos que é um número válido
        name: form.nome.trim(),
        address: form.localizacao.trim() || "—",
        email: form.email.trim(),
        phone: form.contacto.trim() || "—",
        status: "Ativo",
        totalPayment: "0",
        contactName: form.nomeRepresentante.trim() || "—",
        dateAdded: new Date().toLocaleDateString("pt-AO"),
      };

      onCreated(novaInst);
      onClose();
    } catch (err) {
      setApiMsg({ texto: err instanceof Error ? err.message : "Erro desconhecido.", tipo: "erro" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4"
      onClick={(e) => e.target === e.currentTarget && !loading}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-gray-800">Adicionar Instituição</h1>
          <button onClick={onClose} disabled={loading}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {apiMsg && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm flex items-start gap-2 ${
            apiMsg.tipo === "erro" ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <span className="flex-1">{apiMsg.texto}</span>
            <button onClick={() => setApiMsg(null)}><X className="w-4 h-4 opacity-60" /></button>
          </div>
        )}

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">Insira os dados da instituição e clique em "Concluir" para finalizar.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col 1 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="idTipoInstituicao" className="block text-sm font-medium text-gray-700">
                  Tipo de Instituição <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <select id="idTipoInstituicao" value={form.idTipoInstituicao}
                    onChange={(e) => setForm((p) => ({ ...p, idTipoInstituicao: Number(e.target.value) }))}
                    className="appearance-none w-full border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {TIPOS_INSTITUICAO.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {[{ id: "nome", label: "Nome da Instituição", req: true, type: "text", ph: "Ex: Colégio Caracol" },
                { id: "email", label: "Email da Instituição", req: true, type: "email", ph: "contacto@instituicao.ao" },
              ].map(({ id, label, req, type, ph }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {req && <span className="text-red-500">*</span>}
                  </label>
                  <input id={id} type={type} placeholder={ph}
                    value={(form as any)[id]} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
                </div>
              ))}
              <div>
                <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">Contacto</label>
                <input id="contacto" type="tel" placeholder="+244 9XX XXX XXX" maxLength={9}
                  value={form.contacto}
                  onChange={(e) => setForm((p) => ({ ...p, contacto: e.target.value.replace(/\D/g, "") }))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              {[{ id: "localizacao", label: "Endereço / Localização", req: false, ph: "Rua Principal, nº X" },
                { id: "nif", label: "NIF", req: false, ph: "0000000000" },
                { id: "iban", label: "IBAN", req: true, ph: "AO06 XXXX XXXX XXXX" },
              ].map(({ id, label, req, ph }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {req && <span className="text-red-500">*</span>}
                  </label>
                  <input id={id} type="text" placeholder={ph}
                    value={(form as any)[id]} onChange={handleChange}
                    maxLength={id === "iban" ? 30 : id === "nif" ? 14 : undefined}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo</label>
                <label htmlFor="logoInput"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer overflow-hidden">
                  {form.logoPreview
                    ? <img src={form.logoPreview} alt="preview" className="h-20 object-contain rounded" />
                    : <><ImagePlus className="w-7 h-7 text-gray-400 mb-1" /><p className="text-xs text-gray-500">Clique para carregar</p></>
                  }
                </label>
                <input id="logoInput" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </div>
            </div>

            {/* Col 3 — Representante */}
            <div className="border border-gray-200 rounded-xl p-4 bg-blue-50 self-start">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-800">Criar Administrador Local</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={createAdmin} onChange={() => setCreateAdmin(!createAdmin)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Se ativado, será criado um representante com acesso administrativo.</p>
              <div className={`space-y-3 transition-opacity duration-300 ${createAdmin ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                {[
                  { id: "nomeRepresentante", label: "Nome", type: "text", ph: "Nome Completo" },
                  { id: "emailRepresentante", label: "Email", type: "email", ph: "admin@instituicao.ao" },
                  { id: "numTelRepresentante", label: "Contacto", type: "tel", ph: "9XX XXX XXX" },
                  { id: "senhaRepresentante", label: "Palavra-passe", type: "password", ph: "Mín. 8 caracteres" },
                ].map(({ id, label, type, ph }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs font-medium text-gray-700">
                      {label} {createAdmin && <span className="text-red-500">*</span>}
                    </label>
                    <input id={id} type={type} placeholder={ph}
                      value={(form as any)[id]} onChange={handleChange} disabled={!createAdmin}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none mt-1 bg-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-6 bg-gray-50 border-t sticky bottom-0 gap-3">
          <button onClick={onClose} disabled={loading}
            className="text-gray-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "A guardar..." : "Concluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpandedInstitutionDetails({ institution }: { institution: Institution }) {
  return (
    <div className="mt-4 p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 items-start">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 border border-indigo-300 mr-4 flex-shrink-0">
              <Building2 className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Nome da Instituição</p>
              <p className="text-base text-gray-600">{institution.name}</p>
            </div>
          </div>
          <div className="space-y-1 ml-4 text-sm">
            <div className="flex items-center text-gray-600"><Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /><span>{institution.email}</span></div>
            <div className="flex items-center text-gray-600"><Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /><span>{institution.phone}</span></div>
            <p className="text-sm text-gray-500 mt-2 ml-6"><span className="font-semibold">Endereço:</span> {institution.address}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm border-l border-gray-200 pl-8">
          <div><p className="font-medium text-gray-600">Responsável</p><p className="text-gray-800">{institution.contactName}</p></div>
          <div><p className="font-medium text-gray-600">Data de adesão</p><div className="flex items-center text-gray-800"><Calendar className="w-4 h-4 mr-1 text-gray-500" />{institution.dateAdded}</div></div>
        </div>
        <div className="flex flex-col space-y-4 items-end text-sm border-l border-gray-200 pl-8">
          <div className="flex flex-col items-end">
            <p className="font-medium text-gray-600">Status</p>
            <div className={`flex items-center font-bold mt-1 ${institution.status === "Ativo" ? "text-green-600" : "text-red-600"}`}>
              {institution.status === "Ativo" ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
              {institution.status}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="font-medium text-gray-600">Total de Pagamento</p>
            <div className="flex items-center text-xl font-bold text-gray-900 mt-1">
              <span className="text-base text-gray-600">KZ</span>
              <span className="ml-1">{institution.totalPayment}</span>
              <ArrowUp className="w-4 h-4 ml-1 text-green-500" />
            </div>
          </div>
          <button className="bg-blue-600 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4">Editar</button>
        </div>
      </div>
    </div>
  );
}

export default function GestaoDeInstituicao() {
  const { institutions, addInstitution, recarregar, newlyAddedId } = useInstitutions();
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreated = (inst: Institution) => {
    // Recarrega da BD para ter o ID real
    recarregar();
  };

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#184d8a]">Gestão de Instituição</h1>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none" />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="text-[#184d8a]" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
            </div>
            <CircleUser className="w-8 h-8 text-[#184d8a]" />
          </div>
        </div>

        <main className="p-6 md:p-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex justify-end space-x-3 mb-6">
              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-[#184d8a] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                <Minus className="w-4 h-4 mr-2 text-red-600" /> Remover
              </button>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
              <button className="py-2 px-4 text-base font-medium border-b-2 border-[#184d8a] text-[#184d8a]">Instituições</button>
            </div>

            <div className="divide-y divide-gray-200">
              {institutions.map((inst) => (
                <div key={inst.id} className="pt-4 pb-4">
                  <div className={`flex items-start transition-all duration-300 ${
                    newlyAddedId === inst.id ? "bg-green-50 ring-2 ring-green-300 rounded-lg p-2 -mx-2"
                      : expandedId === inst.id ? "pb-4" : "hover:bg-blue-50 cursor-pointer rounded-lg p-2 -mx-2"
                  }`}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 mr-4 flex-shrink-0">
                      <Building2 className="w-6 h-6 text-[#184d8a]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">{inst.name}</h3>
                        {newlyAddedId === inst.id && (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full animate-pulse">✦ Novo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{inst.address}</p>
                    </div>
                    <button onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}
                      className="ml-4 text-sm font-medium py-1 px-3 rounded-lg border border-[#184d8a] text-[#184d8a] hover:bg-blue-50 transition-colors flex-shrink-0">
                      {expandedId === inst.id ? "Esconder Detalhes" : "Detalhes"}
                    </button>
                  </div>
                  {expandedId === inst.id && <ExpandedInstitutionDetails institution={inst} />}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AddInstitutionModal onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
