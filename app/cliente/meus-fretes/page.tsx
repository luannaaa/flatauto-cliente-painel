"use client"

import { useEffect } from "react"
import { etapaAtiva, etapasFrete, freteAoVivo } from "@/app/data/freteAoVivo"

export default function Page() {

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px] pb-10">
        <button onClick={voltarPainel} className="font-bold text-[#ffc400]">← Voltar</button>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6">
          <p className="text-sm font-bold text-[#ffc400]">Painel do cliente</p>
          <h1 className="mt-2 text-[32px] font-black text-white">Meus fretes</h1>
          <p className="mt-3 text-white/60">
            Acompanhe suas solicitações, status, motorista e previsão de chegada.
          </p>
        </section>

        <section className="mt-6 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Última solicitação</p>
              <h2 className="mt-1 text-[22px] font-black">Frete {freteAoVivo.codigo}</h2>
              <p className="mt-1 text-xs font-bold text-white/45">{freteAoVivo.notaFiscal}</p>
            </div>

            <div className="rounded-full bg-[#ffc400] px-4 py-2 text-sm font-black text-black">
              {freteAoVivo.statusTexto}
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-black p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-3xl">🚚</div>
              <div>
                <p className="text-sm text-white/45">Motorista responsável</p>
                <p className="text-lg font-black">{freteAoVivo.motorista}</p>
                <p className="text-sm text-[#ffc400]">{freteAoVivo.veiculo} • Placa {freteAoVivo.placa}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <CardMini titulo="Previsão" valor={freteAoVivo.previsao} />
            <CardMini titulo="Distância" valor={freteAoVivo.distancia} />
            <CardMini titulo="Veículo" valor={freteAoVivo.veiculo} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <CardMini titulo="Coleta" valor={freteAoVivo.coletaPrevista} pequeno />
            <CardMini titulo="Entrega" valor={freteAoVivo.entregaPrevista} pequeno />
          </div>

          <div className="mt-5 rounded-[20px] border border-white/10 bg-black p-4">
            <p className="text-xs font-black uppercase text-white/40">Rota</p>
            <p className="mt-2 text-sm font-bold text-white">{freteAoVivo.origem}</p>
            <p className="my-2 text-[#ffc400]">↓</p>
            <p className="text-sm font-bold text-white">{freteAoVivo.destino}</p>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-white/80">Progresso da entrega</p>
              <p className="text-sm font-bold text-[#ffc400]">{freteAoVivo.progresso}%</p>
            </div>

            <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${freteAoVivo.progresso}%` }} />
            </div>

            <div className="relative mt-3 h-10">
              <div className="absolute top-0 text-3xl" style={{ left: `calc(${freteAoVivo.progresso}% - 18px)` }}>🚚</div>
              <div className="absolute left-0 top-4 h-[2px] w-full bg-white/10" />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-5">
          <h2 className="text-[22px] font-black">Status do frete</h2>
          <div className="mt-5 space-y-4">
            {etapasFrete.map((etapa) => (
              <Etapa
                key={etapa.id}
                ativo={etapaAtiva(freteAoVivo.status, etapa.id)}
                icone={etapaAtiva(freteAoVivo.status, etapa.id) ? "✅" : "○"}
                titulo={etapa.titulo}
                texto={etapa.texto}
              />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-5">
          <h2 className="text-[22px] font-black">Outros fretes</h2>
          <div className="mt-4 space-y-3">
            <FreteItem icone="🚐" codigo="#FLA-1019" status="Concluído" rota="Boa Viagem → Piedade" />
            <FreteItem icone="🏍️" codigo="#FLA-1012" status="Cancelado" rota="Centro → Casa Amarela" />
            <FreteItem icone="🚚" codigo="#FLA-1008" status="Concluído" rota="Olinda → Recife" />
          </div>
        </section>
      </div>
    </main>
  )
}

function CardMini({ titulo, valor, pequeno }: { titulo: string; valor: string; pequeno?: boolean }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black p-3 text-center">
      <p className="text-xs text-white/45">{titulo}</p>
      <p className={`mt-1 font-black text-[#ffc400] ${pequeno ? "text-[13px]" : "text-[16px]"}`}>{valor}</p>
    </div>
  )
}

function Etapa({ icone, titulo, texto, ativo = false }: { icone: string; titulo: string; texto: string; ativo?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ativo ? "bg-[#ffc400] text-black" : "bg-white/10 text-white/50"}`}>
        {icone}
      </div>
      <div>
        <p className={`font-black ${ativo ? "text-white" : "text-white/45"}`}>{titulo}</p>
        <p className="mt-1 text-sm text-white/45">{texto}</p>
      </div>
    </div>
  )
}

function FreteItem({ icone, codigo, status, rota }: { icone: string; codigo: string; status: string; rota: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-black p-4">
      <div className="text-3xl">{icone}</div>
      <div className="flex-1">
        <p className="font-black">{codigo}</p>
        <p className="text-sm text-white/45">{rota}</p>
      </div>
      <p className="text-sm font-bold text-[#ffc400]">{status}</p>
    </div>
  )
}

