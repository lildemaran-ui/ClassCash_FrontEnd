// src/context/InstitutionContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Interface pública ────────────────────────────────────────────────────────
export interface Institution {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: "Ativo" | "Inativo";
  totalPayment: string;
  contactName: string;
  dateAdded: string;
}

interface InstitutionContextType {
  institutions: Institution[];
  addInstitution: (data: Partial<Institution> & { adminName?: string }) => Institution;
  removeInstitution: (id: number) => void;
  newlyAddedId: number | null;
}

// ─── Dados padrão ─────────────────────────────────────────────────────────────
const DEFAULT_INSTITUTIONS: Institution[] = [
  { id: 1, name: "Instituto Médio Politécnico Kibangas",     address: "Rua: António Pedro Benje, nº 107, Vila-Alice - Luanda", email: "impc.kibangas@gmail.com", phone: "+244 923 000 000", status: "Ativo",   totalPayment: "200,000", contactName: "Dr. João Silva", dateAdded: "01/01/2023" },
  { id: 2, name: "Colégio Caracol",                          address: "Rua da Liberdade, Vila-Alice - Luanda",                 email: "info@caracol.co.ao",      phone: "911 111 111",      status: "Ativo",   totalPayment: "50,000",  contactName: "Maria F.",       dateAdded: "10/05/2023" },
  { id: 3, name: "Colégio Elizângela Filomena",              address: "Avenida Ho-Chi-Min, Praça da Independência - Luanda",   email: "elizangela@colegio.ao",   phone: "922 222 222",      status: "Inativo", totalPayment: "0",       contactName: "Filomena L.",    dateAdded: "03/03/2024" },
  { id: 4, name: "Centro MAPTESS",                           address: "Rua: B6, Rangel - Luanda",                              email: "contacto@maptess.gov.ao", phone: "933 333 333",      status: "Ativo",   totalPayment: "150,000", contactName: "Pedro S.",       dateAdded: "15/07/2022" },
  { id: 5, name: "Centro Infantil Kiesse",                   address: "Bairro Nelito Soares, Rangel - Luanda",                 email: "kiesse.infantil@ao",      phone: "944 444 444",      status: "Ativo",   totalPayment: "80,000",  contactName: "Ana C.",         dateAdded: "20/11/2023" },
  { id: 6, name: "Instituto Superior Politécnico — INSUTEC", address: "Gamek, Morro-Bento - Luanda",                           email: "insutec@edu.ao",          phone: "955 555 555",      status: "Ativo",   totalPayment: "300,000", contactName: "Carlos M.",      dateAdded: "01/09/2022" },
];

const STORAGE_KEY = "edu_institutions";

// ─── Contexto interno (não exportado directamente — suprime o aviso de fast-refresh) ──
// eslint-disable-next-line react-refresh/only-export-components
const InstitutionContext = createContext<InstitutionContextType | null>(null);

// ─── Provider — export nomeado de componente (ok para fast-refresh) ───────────
export function InstitutionProvider({ children }: { children: React.ReactNode }) {
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Institution[]) : DEFAULT_INSTITUTIONS;
    } catch {
      return DEFAULT_INSTITUTIONS;
    }
  });

  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(institutions));
  }, [institutions]);

  const addInstitution = (
    data: Partial<Institution> & { adminName?: string }
  ): Institution => {
    const newInst: Institution = {
      id: Date.now(),
      name:         data.name        || "Nova Instituição",
      address:      data.address     || "—",
      email:        data.email       || "—",
      phone:        data.phone       || "—",
      status:       "Ativo",
      totalPayment: "0",
      contactName:  data.adminName   || data.contactName || "—",
      dateAdded:    new Date().toLocaleDateString("pt-AO"),
    };
    setInstitutions((prev) => [newInst, ...prev]);
    setNewlyAddedId(newInst.id);
    setTimeout(() => setNewlyAddedId(null), 5000);
    return newInst;
  };

  const removeInstitution = (id: number) => {
    setInstitutions((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InstitutionContext.Provider
      value={{ institutions, addInstitution, removeInstitution, newlyAddedId }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}

// ─── Hook — o comentário eslint-disable suprime o aviso de fast-refresh ───────
// eslint-disable-next-line react-refresh/only-export-components
export function useInstitutions(): InstitutionContextType {
  const ctx = useContext(InstitutionContext);
  if (!ctx) {
    throw new Error("useInstitutions deve ser usado dentro de <InstitutionProvider>");
  }
  return ctx;
}
