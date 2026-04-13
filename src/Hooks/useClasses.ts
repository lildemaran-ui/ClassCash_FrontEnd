import { useEffect, useState } from "react"
import { getToken } from "@/types/global/sessao"

const API = "http://localhost:5000/api"

interface Classe {
  idclasse: number
  nivel: number
  valorservico?: string
}

// Para a secretaria — usa o idInstituicao do token via rota autenticada
export function useClasses() {
  const [classes, setClasses] = useState<Classe[]>([])

  useEffect(() => {
    fetch(`${API}/gestaoEstudantes/classes`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setClasses(data)
      })
      .catch(console.error)
  }, [])

  return classes
}

// Para o cadastro público — usa idInstituicao como parâmetro
export function useClassesPublicas(idInstituicao: number | "") {
  const [classes, setClasses] = useState<Classe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!idInstituicao) { setClasses([]); return }
    setLoading(true)
    fetch(`${API}/classes/${idInstituicao}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setClasses(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [idInstituicao])

  return { classes, loading }
}