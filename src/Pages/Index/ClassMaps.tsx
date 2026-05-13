'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Search, X, MapPin, Building2, Navigation } from 'lucide-react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Raio de proximidade em km para mostrar instituições próximas
const RAIO_KM = 3

// Lugares conhecidos de Luanda (bairros, municípios, pontos de referência)
const LUGARES_CONHECIDOS: Record<
  string,
  { lat: number; lng: number; nome: string }
> = {
  mutamba: { lat: -8.8368, lng: 13.2332, nome: 'Mutamba, Luanda' },
  ingombotas: { lat: -8.821, lng: 13.2312, nome: 'Ingombotas, Luanda' },
  maianga: { lat: -8.8292, lng: 13.2198, nome: 'Maianga, Luanda' },
  sambizanga: { lat: -8.801, lng: 13.2378, nome: 'Sambizanga, Luanda' },
  rangel: { lat: -8.812, lng: 13.251, nome: 'Rangel, Luanda' },
  cazenga: { lat: -8.792, lng: 13.278, nome: 'Cazenga, Luanda' },
  kilamba: { lat: -8.929, lng: 13.291, nome: 'Kilamba Kiaxi, Luanda' },
  talatona: { lat: -8.9155, lng: 13.187, nome: 'Talatona, Luanda' },
  viana: { lat: -8.9039, lng: 13.374, nome: 'Viana, Luanda' },
  cacuaco: { lat: -8.76, lng: 13.367, nome: 'Cacuaco, Luanda' },
  samba: { lat: -8.87, lng: 13.22, nome: 'Samba, Luanda' },
  miramar: { lat: -8.823, lng: 13.225, nome: 'Miramar, Luanda' },
  alvalade: { lat: -8.845, lng: 13.242, nome: 'Alvalade, Luanda' },
  patriota: { lat: -8.952, lng: 13.309, nome: 'Patriota, Luanda' },
  benfica: { lat: -8.92, lng: 13.205, nome: 'Benfica, Luanda' },
  kinaxixi: { lat: -8.822, lng: 13.2278, nome: 'Kinaxixi, Luanda' },
  ilha: { lat: -8.796, lng: 13.219, nome: 'Ilha de Luanda' },
  'ilha de luanda': { lat: -8.796, lng: 13.219, nome: 'Ilha de Luanda' },
  aeroporto: { lat: -8.8587, lng: 13.2312, nome: 'Aeroporto 4 de Fevereiro' },
  cidadela: { lat: -8.848, lng: 13.239, nome: 'Cidadela, Luanda' },
  rocha: { lat: -8.835, lng: 13.219, nome: 'Rocha Pinto, Luanda' },
  cassenda: { lat: -8.864, lng: 13.258, nome: 'Cassenda, Luanda' },
}

interface Instituicao {
  id: number
  nome: string
  latitude: number | string
  longitude: number | string
  email?: string
  contacto?: string
  tipo?: string
}

interface MapboxFeature {
  id: string
  text: string
  place_name: string
  center: [number, number]
  place_type: string[]
}

interface Sugestao {
  id: string
  nome: string
  subtitulo: string
  lat: number
  lng: number
  tipo: 'instituicao' | 'lugar' | 'mapbox'
}

// Calcula distÃ¢ncia em km entre dois pontos (fÃ³rmula de Haversine)
function distanciaKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Cria elemento HTML para marcador personalizado com animaÃ§Ã£o de pulso opcional
function criarElementoMarcador(cor: string, pulsar = false): HTMLDivElement {
  const el = document.createElement('div')
  el.style.cssText = `
    width: 18px; height: 18px; border-radius: 50%;
    background: ${cor}; border: 2.5px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.28);
    cursor: pointer; position: relative;
  `
  if (pulsar) {
    const ring = document.createElement('div')
    ring.style.cssText = `
      position: absolute; top: -7px; left: -7px;
      width: 30px; height: 30px; border-radius: 50%;
      background: ${cor}40;
      animation: classmapsPulse 1.8s ease-out infinite;
    `
    el.appendChild(ring)
    if (!document.getElementById('classmaps-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'classmaps-pulse-style'
      style.textContent = `
        @keyframes classmapsPulse {
          0%   { transform: scale(1); opacity: 0.8; }
          70%  { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
  }
  return el
}

export default function ClassMapsDefinitivo() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const marcadoresLocalizacaoRef = useRef<mapboxgl.Marker[]>([])
  const marcadoresProximosRef = useRef<mapboxgl.Marker[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([])
  const [showSugestoes, setShowSugestoes] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [erro, setErro] = useState('')
  const [resultadoInfo, setResultadoInfo] = useState<{
    nome: string
    proximas: number
  } | null>(null)

  // 1. Buscar instituiÃ§Ãµes da API
  useEffect(() => {
    fetch('http://localhost:5000/api/ClassMaps')
      .then((res) => res.json())
      .then((data: Instituicao[]) => {
        setInstituicoes(data.filter((i) => i.latitude && i.longitude))
      })
      .catch((err) => console.error('Erro ao carregar instituiÃ§Ãµes:', err))
  }, [])

  // 2. Iniciar mapa Mapbox
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    mapboxgl.accessToken = MAPBOX_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [13.2344, -8.839],
      zoom: 13,
      language: 'pt',
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  }, [])

  // Limpa marcadores de localizaÃ§Ã£o e de instituiÃ§Ãµes prÃ³ximas
  const limparTodosMarcadores = useCallback(() => {
    marcadoresLocalizacaoRef.current.forEach((m) => m.remove())
    marcadoresLocalizacaoRef.current = []
    marcadoresProximosRef.current.forEach((m) => m.remove())
    marcadoresProximosRef.current = []
    document.getElementById('classmaps-circle')?.remove()
    setResultadoInfo(null)
  }, [])

  // Cria popup hover-only
  const criarPopup = (html: string) =>
    new mapboxgl.Popup({
      offset: 14,
      closeButton: false,
      closeOnClick: false,
      anchor: 'bottom',
    }).setHTML(html)

  // Mostra instituiÃ§Ãµes prÃ³ximas com etiqueta fixa sempre visÃvel + cÃrculo de raio
  const mostrarInstituicoesProximas = useCallback(
    (lat: number, lng: number): number => {
      marcadoresProximosRef.current.forEach((m) => m.remove())
      marcadoresProximosRef.current = []

      // Remove cÃrculo anterior
      document.getElementById('classmaps-circle')?.remove()

      const proximas = instituicoes.filter((inst) => {
        const dist = distanciaKm(
          lat,
          lng,
          Number(inst.latitude),
          Number(inst.longitude),
        )
        return dist <= RAIO_KM
      })

      proximas.forEach((inst) => {
        const dist = distanciaKm(
          lat,
          lng,
          Number(inst.latitude),
          Number(inst.longitude),
        )

        // Container do marcador
        const el = document.createElement('div')
        el.style.cssText = `
          display: flex; flex-direction: column; align-items: center;
          cursor: pointer;
        `

        // Ponto verde
        const ponto = document.createElement('div')
        ponto.style.cssText = `
          width: 13px; height: 13px; border-radius: 50%;
          background: #16a34a; border: 2.5px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25); z-index: 2;
        `

        // Etiqueta com nome â€” sempre visÃvel no mapa
        const etiqueta = document.createElement('div')
        etiqueta.style.cssText = `
          margin-top: 4px;
          background: #fff;
          color: #15803d;
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.15);
          border: 1px solid #dcfce7;
          white-space: nowrap;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: none;
        `
        etiqueta.textContent = inst.nome

        // DistÃ¢ncia aparece ao hover
        const distEl = document.createElement('div')
        distEl.style.cssText = `
          font-family: sans-serif; font-size: 10px; color: #64748b;
          background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 1px 5px; border-radius: 4px; margin-top: 2px;
          white-space: nowrap; pointer-events: none;
          display: none;
        `
        distEl.textContent = `${dist.toFixed(1)} km`

        el.appendChild(ponto)
        el.appendChild(etiqueta)
        el.appendChild(distEl)

        el.addEventListener('mouseenter', () => {
          distEl.style.display = 'block'
        })
        el.addEventListener('mouseleave', () => {
          distEl.style.display = 'none'
        })

        const marker = new mapboxgl.Marker({ element: el, anchor: 'top' })
          .setLngLat([Number(inst.longitude), Number(inst.latitude)])
          .addTo(mapRef.current!)

        marcadoresProximosRef.current.push(marker)
      })

      // Desenhar cÃrculo tracejado em torno da localizaÃ§Ã£o
      const desenharCirculo = () => {
        document.getElementById('classmaps-circle')?.remove()
        const map = mapRef.current!
        const centro = map.project([lng, lat])
        const pontoRaio = map.project([lng + RAIO_KM / 111.32, lat])
        const raioxPx = Math.abs(pontoRaio.x - centro.x)
        const size = raioxPx * 2 + 40
        const canvas = document.createElement('canvas')
        canvas.id = 'classmaps-circle'
        canvas.width = size
        canvas.height = size
        canvas.style.cssText = `
          position: absolute;
          left: ${centro.x - size / 2}px;
          top: ${centro.y - size / 2}px;
          pointer-events: none;
          z-index: 1;
        `
        const ctx = canvas.getContext('2d')!
        const cx = size / 2,
          cy = size / 2
        // Preenchimento rosa suave
        ctx.beginPath()
        ctx.arc(cx, cy, raioxPx, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(219, 39, 119, 0.07)'
        ctx.fill()
        // Borda tracejada
        ctx.beginPath()
        ctx.arc(cx, cy, raioxPx, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(219, 39, 119, 0.55)'
        ctx.lineWidth = 2
        ctx.setLineDash([7, 5])
        ctx.stroke()
        map.getCanvas().parentElement?.appendChild(canvas)
      }

      desenharCirculo()
      mapRef.current!.on('move', desenharCirculo)
      mapRef.current!.on('zoom', desenharCirculo)

      return proximas.length
    },
    [instituicoes],
  )

  // Coloca o marcador rosa (localizaÃ§Ã£o pesquisada) e opcionalmente mostra proximas
  const colocarMarcadorPrincipal = useCallback(
    (lng: number, lat: number, nome: string, ehInstituicao: boolean) => {
      limparTodosMarcadores()

      const el = criarElementoMarcador('#db2777', !ehInstituicao)

      const popup = criarPopup(
        `<div style="font-family:sans-serif;">
          <b style="color:#db2777;font-size:12px;">${nome}</b>
          <div style="color:#64748b;font-size:10px;margin-top:2px;">
            ${ehInstituicao ? 'InstituiÃ§Ã£o pesquisada' : 'A tua localizaÃ§Ã£o'}
          </div>
        </div>`,
      )

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current!)

      // Popup aberto por padrÃ£o no marcador principal
      marker.togglePopup()

      el.addEventListener('mouseenter', () => {
        if (!marker.getPopup()?.isOpen()) marker.togglePopup()
      })
      el.addEventListener('mouseleave', () => {
        // MantÃ©m popup aberto permanentemente no marcador principal
      })

      marcadoresLocalizacaoRef.current.push(marker)

      if (!ehInstituicao) {
        const qtd = mostrarInstituicoesProximas(lat, lng)
        setResultadoInfo({ nome, proximas: qtd })
      } else {
        setResultadoInfo({ nome, proximas: -1 })
      }

      mapRef.current!.flyTo({ center: [lng, lat], zoom: 15, duration: 1400 })
    },
    [limparTodosMarcadores, mostrarInstituicoesProximas],
  )

  // GeocodificaÃ§Ã£o via Mapbox com fallback sem bbox
  const geocodificar = async (
    termo: string,
  ): Promise<{ lat: number; lng: number; nome: string } | null> => {
    try {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        termo + ' Luanda Angola',
      )}.json?access_token=${MAPBOX_TOKEN}&bbox=13.0859,-9.0031,13.4682,-8.7305&limit=1&language=pt`
      let res = await fetch(url)
      let data = await res.json()

      if (data.features?.length > 0) {
        const f: MapboxFeature = data.features[0]
        return { lng: f.center[0], lat: f.center[1], nome: f.text }
      }

      // Fallback sem bbox
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        termo + ' Angola',
      )}.json?access_token=${MAPBOX_TOKEN}&country=AO&limit=1&language=pt`
      res = await fetch(url)
      data = await res.json()

      if (data.features?.length > 0) {
        const f: MapboxFeature = data.features[0]
        return { lng: f.center[0], lat: f.center[1], nome: f.text }
      }
    } catch (e) {
      console.error('Erro geocodificaÃ§Ã£o:', e)
    }
    return null
  }

  // SugestÃµes para o autocomplete
  const buscarSugestoes = useCallback(
    async (termo: string) => {
      if (termo.length < 2) {
        setSugestoes([])
        return
      }

      const termoLower = termo.toLowerCase()

      const deInstituicoes: Sugestao[] = instituicoes
        .filter((i) => i.nome.toLowerCase().includes(termoLower))
        .slice(0, 3)
        .map((i) => ({
          id: `inst-${i.id}`,
          nome: i.nome,
          subtitulo: 'InstituiÃ§Ã£o cadastrada',
          lat: Number(i.latitude),
          lng: Number(i.longitude),
          tipo: 'instituicao' as const,
        }))

      const deLugares: Sugestao[] = Object.entries(LUGARES_CONHECIDOS)
        .filter(
          ([key]) =>
            key.includes(termoLower) || termoLower.includes(key.slice(0, 5)),
        )
        .slice(0, 3)
        .map(([, v]) => ({
          id: `lugar-${v.nome}`,
          nome: v.nome,
          subtitulo: 'Bairro / ReferÃªncia Â· Luanda',
          lat: v.lat,
          lng: v.lng,
          tipo: 'lugar' as const,
        }))

      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          termo + ' Luanda Angola',
        )}.json?access_token=${MAPBOX_TOKEN}&bbox=13.0859,-9.0031,13.4682,-8.7305&limit=3&language=pt&types=place,poi,neighborhood,locality,address`
        const res = await fetch(url)
        const data = await res.json()

        const deMapbox: Sugestao[] = (data.features || []).map(
          (f: MapboxFeature) => ({
            id: f.id,
            nome: f.text,
            subtitulo:
              f.place_name?.split(', ').slice(1, 3).join(', ') || 'Luanda',
            lat: f.center[1],
            lng: f.center[0],
            tipo: 'mapbox' as const,
          }),
        )

        const vistos = new Set<string>()
        const merged: Sugestao[] = []
        for (const s of [...deInstituicoes, ...deLugares, ...deMapbox]) {
          const key = s.nome.toLowerCase()
          if (!vistos.has(key) && merged.length < 6) {
            vistos.add(key)
            merged.push(s)
          }
        }
        setSugestoes(merged)
        setShowSugestoes(merged.length > 0)
      } catch {
        const merged = [...deInstituicoes, ...deLugares].slice(0, 5)
        setSugestoes(merged)
        setShowSugestoes(merged.length > 0)
      }
    },
    [instituicoes],
  )

  // Debounce nas sugestÃµes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!searchTerm.trim()) {
      setSugestoes([])
      setShowSugestoes(false)
      return
    }
    debounceRef.current = setTimeout(() => buscarSugestoes(searchTerm), 280)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm, buscarSugestoes])

  // Selecionar sugestÃ£o do dropdown
  const selecionarSugestao = useCallback(
    (s: Sugestao) => {
      setSearchTerm(s.nome)
      setShowSugestoes(false)
      setSugestoes([])
      setErro('')
      colocarMarcadorPrincipal(s.lng, s.lat, s.nome, s.tipo === 'instituicao')
    },
    [colocarMarcadorPrincipal],
  )

  // Executar pesquisa principal
  const executarBusca = useCallback(async () => {
    const termo = searchTerm.trim()
    if (!termo || !mapRef.current) return

    setShowSugestoes(false)
    setSugestoes([])
    setErro('')
    setIsSearching(true)

    // Prioridade 1: banco local (instituiÃ§Ã£o)
    const instLocal = instituicoes.find((i) =>
      i.nome.toLowerCase().includes(termo.toLowerCase()),
    )
    if (instLocal) {
      colocarMarcadorPrincipal(
        Number(instLocal.longitude),
        Number(instLocal.latitude),
        instLocal.nome,
        true,
      )
      setIsSearching(false)
      return
    }

    // Prioridade 2: lugares conhecidos de Luanda (bairros)
    const termoLower = termo.toLowerCase()
    const conhecido = Object.entries(LUGARES_CONHECIDOS).find(
      ([key]) => termoLower.includes(key) || key.includes(termoLower),
    )
    if (conhecido) {
      const [, coords] = conhecido
      colocarMarcadorPrincipal(coords.lng, coords.lat, coords.nome, false)
      setIsSearching(false)
      return
    }

    // Prioridade 3: geocodificaÃ§Ã£o Mapbox
    const geo = await geocodificar(termo)
    if (geo) {
      colocarMarcadorPrincipal(geo.lng, geo.lat, geo.nome, false)
    } else {
      setErro(
        'LocalizaÃ§Ã£o nÃ£o encontrada. Tenta um bairro ou endereÃ§o de Luanda.',
      )
      setTimeout(() => setErro(''), 4000)
    }

    setIsSearching(false)
  }, [searchTerm, instituicoes, colocarMarcadorPrincipal])

  // Limpar toda a pesquisa
  const limparPesquisa = () => {
    setSearchTerm('')
    setSugestoes([])
    setShowSugestoes(false)
    setErro('')
    limparTodosMarcadores()
  }

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl font-sans border-4 border-white bg-slate-200">
      {/* BARRA DE PESQUISA */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 w-full max-w-[500px] px-4">
        <form
          className="flex gap-2 bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-2xl shadow-xl border border-white"
          onSubmit={(e) => {
            e.preventDefault()
            executarBusca()
          }}
        >
          <Navigation
            size={18}
            className="text-pink-500 mt-0.5 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="O teu bairro, rua ou nome da instituiÃ§Ã£o..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400 min-w-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => sugestoes.length > 0 && setShowSugestoes(true)}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={limparPesquisa}
              className="text-gray-300 hover:text-gray-500 flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow active:scale-95 flex-shrink-0 flex items-center gap-1.5"
          >
            <Search size={13} />
            {isSearching ? '...' : 'Pesquisar'}
          </button>
        </form>

        {/* DROPDOWN DE SUGESTÃ•ES */}
        {showSugestoes && sugestoes.length > 0 && (
          <div className="mt-1.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white overflow-hidden">
            {sugestoes.map((s) => (
              <button
                key={s.id}
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-pink-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                onClick={() => selecionarSugestao(s)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      s.tipo === 'instituicao'
                        ? '#16a34a'
                        : s.tipo === 'lugar'
                          ? '#db2777'
                          : '#f97316',
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {s.nome}
                  </div>
                  <div className="text-[10px] text-gray-400">{s.subtitulo}</div>
                </div>
                {s.tipo === 'instituicao' && (
                  <Building2
                    size={13}
                    className="text-green-600 ml-auto flex-shrink-0"
                  />
                )}
                {s.tipo === 'lugar' && (
                  <MapPin
                    size={13}
                    className="text-pink-500 ml-auto flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MENSAGEM DE ERRO */}
      {erro && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border-l-4 border-pink-500 flex items-center gap-2 whitespace-nowrap">
          <MapPin className="text-pink-500" size={18} />
          <p className="text-sm font-semibold text-gray-700">{erro}</p>
        </div>
      )}

      {/* PAINEL DE RESULTADO (mostra o resumo da pesquisa) */}
      {resultadoInfo && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white flex items-center gap-2.5 max-w-[90%]">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700 truncate">
            {resultadoInfo.nome}
          </span>
          {resultadoInfo.proximas >= 0 && (
            <>
              <span className="text-gray-300 text-xs">|</span>
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                {resultadoInfo.proximas === 0
                  ? `Nenhuma instituiÃ§Ã£o nos ${RAIO_KM} km`
                  : `${resultadoInfo.proximas} instituiÃ§Ã£o(Ãµes) prÃ³xima(s)`}
              </span>
            </>
          )}
        </div>
      )}

      {/* LEGENDA */}
      <div className="absolute bottom-5 left-5 z-10 flex gap-2 flex-wrap">
        <div className="bg-white/95 px-2.5 py-1.5 rounded-xl shadow flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-pink-600 rounded-full" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-wide">
            A tua localizaÃ§Ã£o
          </span>
        </div>
        <div className="bg-white/95 px-2.5 py-1.5 rounded-xl shadow flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-wide">
            InstituiÃ§Ãµes prÃ³ximas
          </span>
        </div>
      </div>

      {/* MAPA */}
      <div ref={mapContainerRef} className="w-full h-full" />

      <style>{`
        .mapboxgl-popup-content {
          border-radius: 10px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.13) !important;
          border: 1px solid #f1f5f9 !important;
          min-width: 140px;
          max-width: 220px;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  )
}