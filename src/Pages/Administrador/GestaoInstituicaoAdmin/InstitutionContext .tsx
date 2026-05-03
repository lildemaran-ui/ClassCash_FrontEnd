// src/Pages/Administrador/GestaoInstituicaoAdmin/InstitutionContext.tsx

import { fetchComAuth } from '@/types/global/fetchComAuth'
import React, { createContext, useContext, useState, useEffect } from 'react'

const API = 'http://localhost:5000/api'

export interface Institution {
  id: number // = idinstituicao da BD
  idinstituicao: number
  name: string // = nome
  address: string // = localizacao
  email: string
  phone: string // = contacto
  // BD: fk_status_usuario → status_usuario(1=ativo, 2=inativo)
  // listarInstituicoes faz JOIN com status_usuario e retorna su.nome
  status: 'Ativo' | 'Inativo'
  totalPayment: string
  contactName: string
  dateAdded: string
  logotipo?: string
}

interface InstitutionContextType {
  institutions: Institution[]
  loading: boolean
  addInstitution: (
    data: Partial<Institution> & { adminName?: string },
  ) => Institution
  removeInstitution: (id: number) => void
  recarregar: () => void
  newlyAddedId: number | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInstituicao(row: any): Institution {
  return {
    id: row.idinstituicao,
    idinstituicao: row.idinstituicao,
    name: row.nome ?? '—',
    address: row.localizacao ?? '—',
    email: row.email ?? '—',
    phone: row.contacto ?? '—',
    // BD: status vem do JOIN com status_usuario ('ativo' ou 'inativo' em minúsculo)
    // Instituições cadastradas ficam sempre ativas (fk_status_usuario=1)
    status: row.status?.toLowerCase() === 'inativo' ? 'Inativo' : 'Ativo',
    totalPayment: '—',
    contactName: '—',
    dateAdded: row.created_at
      ? new Date(row.created_at).toLocaleDateString('pt-AO')
      : '—',
    logotipo: row.logotipo ?? undefined,
  }
}

// eslint-disable-next-line react-refresh/only-export-components
const InstitutionContext = createContext<InstitutionContextType | null>(null)

export function InstitutionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null)

  // No seu arquivo InstitutionContext.tsx

  const carregar = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetchComAuth(`${API}/cadastro-instituicao`)

      if (!res || !res.ok) return

      const data = await res.json()
      if (Array.isArray(data)) {
        setInstitutions(data.map(mapInstituicao))
      }
    } catch (err) {
      console.error('Erro ao carregar instituições:', err)
    } finally {
      setLoading(false)
    }
  }

  // Altere o useEffect para ser mais inteligente
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      carregar()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [])

  const addInstitution = (
    data: Partial<Institution> & { adminName?: string },
  ): Institution => {
    const newInst: Institution = {
      id: Date.now(),
      idinstituicao: Date.now(),
      name: data.name || 'Nova Instituição',
      address: data.address || '—',
      email: data.email || '—',
      phone: data.phone || '—',
      status: 'Ativo',
      totalPayment: '0',
      contactName: data.adminName || data.contactName || '—',
      dateAdded: new Date().toLocaleDateString('pt-AO'),
    }
    setInstitutions((prev) => [newInst, ...prev])
    setNewlyAddedId(newInst.id)
    setTimeout(() => setNewlyAddedId(null), 5000)
    return newInst
  }

  const removeInstitution = (id: number) => {
    setInstitutions((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <InstitutionContext.Provider
      value={{
        institutions,
        loading,
        addInstitution,
        removeInstitution,
        recarregar: carregar,
        newlyAddedId,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInstitutions(): InstitutionContextType {
  const ctx = useContext(InstitutionContext)
  if (!ctx)
    throw new Error(
      'useInstitutions deve ser usado dentro de <InstitutionProvider>',
    )
  return ctx
}
