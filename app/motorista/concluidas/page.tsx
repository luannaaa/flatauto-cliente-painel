"use client"

import {
  ArrowLeft,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Package,
  FileText,
  DollarSign,
  CalendarDays,
  UserRound,
  Route,
  Hash,
} from "lucide-react"
import { useState } from "react"

type EntregaConcluida = {
  id: string
  numeroNota: string
  cliente: string
  origem: string
  destino: string
  tipoPacote: string
  dataEntrega: string
  horarioEntrega: string
  tempoTotal: string
  distancia: string
  valorRecebido: string
  observacaoCliente: string
  status: "Entregue"
}

const entregasConcluidas: EntregaConcluida[] = [
  {
    id: "FT-1287",
    numeroNota: "NF-e 000.123.456",
    cliente: "Mercado Central",
    origem: "Boa Viagem - Recife",
    destino: "Olinda - PE",
    tipoPacote: "Pacote empresarial",
    dataEntrega: "11/06/2026",
    horarioEntrega: "13:20",
    tempoTotal: "32 min",
    distancia: "18 km",
    valorRecebido: "R$ 52,00",
    observacaoCliente: "Entrega realizada no setor de estoque. Recebido pelo responsável da loja.",
    status: "Entregue",
  },
  {
    id: "FT-1286",
    numeroNota: "NF-e 000.123.457",
    cliente: "Cliente particular",
    origem: "Recife Antigo - Recife",
    destino: "Jaboatão - PE",
    tipoPacote: "Frágil / sensível",
    dataEntrega: "10/06/2026",
    horarioEntrega: "18:10",
    tempoTotal: "41 min",
    distancia: "22 km",
    valorRecebido: "R$ 46,00",
    observacaoCliente: "Produto entregue sem avaria. Cliente pediu cuidado com a embalagem.",
    status: "Entregue",
  },
  {
    id: "FT-1285",
    numeroNota: "NF-e 000.123.458",
    cliente: "Auto Peças Brasil",
    origem: "Imbiribeira - Recife",
    destino: "Casa Amarela - Recife",
    tipoPacote: "Pacote empresarial",
    dataEntrega: "10/06/2026",
    horarioEntrega: "10:45",
    tempoTotal: "28 min",
    distancia: "12 km",
    valorRecebido: "R$ 39,00",
    observacaoCliente: "Peças pequenas entregues no balcão de atendimento.",
    status: "Entregue",
  },
  {
    id: "FT-1284",
    numeroNota: "NF-e 000.123.459",
    cliente: "Loja Recife",
    origem: "Centro - Recife",
    destino: "Boa Vista - Recife",
    tipoPacote: "Mercadorias pequenas",
    dataEntrega: "09/06/2026",
    horarioEntrega: "15:40",
    tempoTotal: "19 min",
    distancia: "7 km",
    valorRecebido: "R$ 31,00",
    observacaoCliente: "Entrega concluída com nota fiscal anexada ao pacote.",
    status: "Entregue",
  },
]

export default function ConcluidasMotoristaPage() {
  const [selecionada, setSelecionada] = useState<EntregaConcluida | null>(null)

  const totalRecebido = "R$ 168,00"

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-8">
        <header className="flex items-center gap-3">
          <a
            href="/motorista"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <ArrowLeft size={22} />
          </a>

          <div>
            <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
            <h1 className="text-2xl font-black">Concluídas</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 text-xl font-black">Histórico de entregas</h2>
          <p className="mt-2 text-sm text-white/60">
            Veja as corridas finalizadas, valores recebidos, cliente, nota e detalhes da entrega.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Resumo titulo="Entregas" valor={`${entregasConcluidas.length}`} />
          <Resumo titulo="Recebido" valor={totalRecebido} destaque />
        </section>

        <section className="space-y-3">
          {entregasConcluidas.map((entrega) => (
            <article
              key={entrega.id}
              onClick={() => setSelecionada(entrega)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-[#10171b] p-4 transition hover:border-[#ffc400]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#ffc400]/30 bg-[#ffc400]/10 px-2 py-1 text-[10px] font-black text-[#ffc400]">
                      {entrega.id}
                    </span>

                    <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-black text-green-400">
                      Entregue
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-black">{entrega.cliente}</h3>

                  <p className="mt-1 text-sm text-white/60">
                    {entrega.origem} → {entrega.destino}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <MiniInfo titulo="Data" valor={entrega.dataEntrega} />
                    <MiniInfo titulo="Hora" valor={entrega.horarioEntrega} />
                    <MiniInfo titulo="Valor" valor={entrega.valorRecebido} amarelo />
                    <MiniInfo titulo="Nota" valor={entrega.numeroNota} />
                  </div>

                  <p className="mt-3 text-xs font-bold text-white/45">
                    {entrega.tipoPacote}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 px-4 pb-5 sm:items-center sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#10171b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#ffc400]">DETALHES DA ENTREGA</p>
                <h2 className="mt-1 text-xl font-black">{selecionada.cliente}</h2>
              </div>

              <button
                onClick={() => setSelecionada(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <DetalheLinha titulo="Corrida" valor={selecionada.id} icone={<Hash size={18} />} />
              <DetalheLinha titulo="Cliente" valor={selecionada.cliente} icone={<UserRound size={18} />} />
              <DetalheLinha titulo="Nota fiscal" valor={selecionada.numeroNota} icone={<FileText size={18} />} />
              <DetalheLinha titulo="Origem" valor={selecionada.origem} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Destino" valor={selecionada.destino} icone={<MapPin size={18} />} />
              <DetalheLinha titulo="Tipo de pacote" valor={selecionada.tipoPacote} icone={<Package size={18} />} />
              <DetalheLinha titulo="Data" valor={selecionada.dataEntrega} icone={<CalendarDays size={18} />} />
              <DetalheLinha titulo="Horário" valor={selecionada.horarioEntrega} icone={<Clock size={18} />} />
              <DetalheLinha titulo="Tempo total" valor={selecionada.tempoTotal} icone={<Clock size={18} />} />
              <DetalheLinha titulo="Distância" valor={selecionada.distancia} icone={<Route size={18} />} />
              <DetalheLinha titulo="Valor recebido" valor={selecionada.valorRecebido} icone={<DollarSign size={18} />} destaque />

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-white/45">
                  <FileText size={18} />
                  Observação do cliente
                </p>
                <p className="mt-2 text-sm font-bold leading-relaxed text-white">
                  {selecionada.observacaoCliente}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelecionada(null)}
              className="mt-5 h-12 w-full rounded-2xl bg-[#ffc400] font-black text-black"
            >
              Fechar detalhes
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function Resumo({ titulo, valor, destaque }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <p className="text-xs font-black uppercase text-white/45">{titulo}</p>
      <p className={`mt-1 text-xl font-black ${destaque ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </article>
  )
}

function MiniInfo({ titulo, valor, amarelo }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] font-black uppercase text-white/40">{titulo}</p>
      <p className={`mt-1 text-xs font-black ${amarelo ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </div>
  )
}

function DetalheLinha({ titulo, valor, icone, destaque }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase text-white/45">
        <span className="text-[#ffc400]">{icone}</span>
        {titulo}
      </p>
      <p className={`mt-1 text-sm font-black ${destaque ? "text-[#ffc400]" : "text-white"}`}>
        {valor}
      </p>
    </div>
  )
}