"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Bike, Clock, MapPin, Package, RefreshCw } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Frete = {
  id: string
  codigo?: string | null
  origem?: string | null
  destino?: string | null
  endereco_origem?: string | null
  endereco_destino?: string | null
  tipo_carga?: string | null
  tipo_transporte?: string | null
  status?: string | null
  data_frete?: string | null
  data_entrega?: string | null
  horario?: string | null
  valor_frete?: number | null
  observacoes?: string | null
  motorista_id?: string | null
  created_at?: string | null
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

function texto(valor?: string | null) {
  return String(valor || "").toLowerCase()
}

function formatarMoeda(valor?: number | null) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function dataDoFrete(frete: Frete) {
  const data = frete.data_frete || frete.data_entrega || frete.created_at || ""
  return String(data).slice(0, 10)
}

function ehDisponivelHoje(frete: Frete) {
  const status = texto(frete.status)
  const semMotorista = !frete.motorista_id
  const dataHoje = dataDoFrete(frete) === hojeISO()

  const statusDisponivel =
    status.includes("disponivel") ||
    status.includes("pendente") ||
    status.includes("aguardando")

  return semMotorista && dataHoje && statusDisponivel
}

export default function MotoristaSubPage() {
  const [corridas, setCorridas] = useState<Frete[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarCorridasDisponiveis()
  }, [])

  async function carregarCorridasDisponiveis() {
    setCarregando(true)
    setErro("")

    const { data, error } = await supabase
      .from("fretes")
      .select("*")
      .is("motorista_id", null)
      .order("created_at", { ascending: false })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCorridas([])
      setCarregando(false)
      return
    }

    const lista = Array.isArray(data) ? data : []
    setCorridas(lista.filter(ehDisponivelHoje))
    setCarregando(false)
  }

  async function aceitarCorrida(freteId: string) {
    const motoristaId = localStorage.getItem("flatauto_motorista_id")

    if (!motoristaId) {
      alert("Motorista não encontrado no login.")
      return
    }

    const { error } = await supabase
      .from("fretes")
      .update({
        motorista_id: motoristaId,
        status: "em_andamento",
      })
      .eq("id", freteId)
      .is("motorista_id", null)

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    await carregarCorridasDisponiveis()
  }

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Corridas disponíveis</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Bike size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Corridas de hoje</h2>
          <p className="mt-2 text-sm text-white/60">
            Aqui aparecem somente fretes de hoje, sem motorista vinculado e com status disponível.
          </p>

          <button
            onClick={carregarCorridasDisponiveis}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-[#ffc400]"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </section>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="rounded-2xl border border-white/10 bg-[#10171b] p-5 text-center text-sm text-white/60">
            Carregando corridas do Supabase...
          </div>
        ) : corridas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-6 text-center">
            <Package className="mx-auto text-[#ffc400]" size={34} />
            <h3 className="mt-3 font-black">Nenhuma corrida disponível</h3>
            <p className="mt-2 text-sm text-white/60">
              Quando cliente ou empresa chamar um frete para hoje, ele aparece aqui.
            </p>
          </div>
        ) : (
          <section className="space-y-3">
            {corridas.map((frete) => (
              <Card
                key={frete.id}
                frete={frete}
                onAceitar={() => aceitarCorrida(frete.id)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

function Card({ frete, onAceitar }: { frete: Frete; onAceitar: () => void }) {
  const origem = frete.origem || frete.endereco_origem || "Origem não informada"
  const destino = frete.destino || frete.endereco_destino || "Destino não informado"

  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <h3 className="font-black">{frete.codigo || "Frete disponível"}</h3>

      <p className="mt-2 flex gap-2 text-sm text-white/70">
        <MapPin size={16} className="text-[#ffc400]" />
        {origem} → {destino}
      </p>

      <p className="mt-2 flex gap-2 text-sm text-white/60">
        <Package size={16} className="text-[#ffc400]" />
        {frete.tipo_carga || frete.tipo_transporte || "Tipo não informado"}
      </p>

      <p className="mt-2 flex gap-2 text-sm text-white/60">
        <Clock size={16} className="text-[#ffc400]" />
        {frete.horario || "Horário não informado"}
      </p>

      <p className="mt-3 text-lg font-black text-[#ffc400]">
        {formatarMoeda(frete.valor_frete)}
      </p>

      {frete.observacoes && (
        <p className="mt-2 text-sm text-white/50">{frete.observacoes}</p>
      )}

      <button
        onClick={onAceitar}
        className="mt-4 h-12 w-full rounded-xl bg-[#ffc400] font-black text-black"
      >
        Aceitar corrida
      </button>
    </article>
  )
}