"use client"

import { useEffect } from "react"

function useVoltarCelularParaPainel() {
  useEffect(() => {
    window.history.pushState({ telaInternaCliente: true }, "", window.location.href)

    function voltarParaPainel() {
      window.location.replace("/cliente")
    }

    window.addEventListener("popstate", voltarParaPainel)

    return () => {
      window.removeEventListener("popstate", voltarParaPainel)
    }
  }, [])
}

export default function Page() {
  useVoltarCelularParaPainel()

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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Última solicitação</p>
              <h2 className="mt-1 text-[22px] font-black">Frete #FLA-1024</h2>
            </div>

            <div className="rounded-full bg-[#ffc400] px-4 py-2 text-sm font-black text-black">
              Em rota
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-black p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400]/15 text-3xl">
                🚚
              </div>

              <div>
                <p className="text-sm text-white/45">Motorista responsável</p>
                <p className="text-lg font-black">Carlos Henrique</p>
                <p className="text-sm text-[#ffc400]">VUC • Placa RTA-4H22</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <CardMini titulo="Previsão" valor="18 min" />
            <CardMini titulo="Distância" valor="7,4 km" />
            <CardMini titulo="Veículo" valor="VUC" />
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-white/80">Progresso da entrega</p>
              <p className="text-sm font-bold text-[#ffc400]">65%</p>
            </div>

            <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[65%] rounded-full bg-[#ffc400]" />
            </div>

            <div className="relative mt-3 h-10">
              <div className="absolute left-[63%] top-0 text-3xl">🚚</div>
              <div className="absolute left-0 top-4 h-[2px] w-full bg-white/10" />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/10 bg-[#080808] p-5">
          <h2 className="text-[22px] font-black">Status do frete</h2>

          <div className="mt-5 space-y-4">
            <Etapa ativo icone="✅" titulo="Solicitação criada" texto="Pedido recebido pelo sistema." />
            <Etapa ativo icone="👤" titulo="Motorista definido" texto="Carlos Henrique aceitou a corrida." />
            <Etapa ativo icone="🚚" titulo="Motorista em rota" texto="Veículo indo para o local de coleta." />
            <Etapa icone="📦" titulo="Mercadoria retirada" texto="Aguardando confirmação da retirada." />
            <Etapa icone="🏁" titulo="Entrega concluída" texto="Finalização pendente." />
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

function CardMini({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black p-3 text-center">
      <p className="text-xs text-white/45">{titulo}</p>
      <p className="mt-1 text-[16px] font-black text-[#ffc400]">{valor}</p>
    </div>
  )
}

function Etapa({
  icone,
  titulo,
  texto,
  ativo = false,
}: {
  icone: string
  titulo: string
  texto: string
  ativo?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          ativo ? "bg-[#ffc400] text-black" : "bg-white/10 text-white/50"
        }`}
      >
        {icone}
      </div>

      <div>
        <p className={`font-black ${ativo ? "text-white" : "text-white/45"}`}>{titulo}</p>
        <p className="mt-1 text-sm text-white/45">{texto}</p>
      </div>
    </div>
  )
}

function FreteItem({
  icone,
  codigo,
  status,
  rota,
}: {
  icone: string
  codigo: string
  status: string
  rota: string
}) {
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