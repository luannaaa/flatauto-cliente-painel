"use client"

import { ArrowLeft, UserRound, Truck } from "lucide-react"

export default function PerfilPage() {
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
            <p className="text-xs font-black text-[#ffc400]">
              FLATAUTO MOTORISTA
            </p>
            <h1 className="text-2xl font-black">Perfil</h1>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#ffc400] text-black">
            <UserRound size={50} />
          </div>

          <h2 className="mt-5 text-2xl font-black">
            Motorista FlatAuto
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Dados do motorista e veículo.
          </p>
        </section>

        <div className="rounded-3xl border border-white/10 bg-[#10171b] p-4">
          <h3 className="mb-4 text-lg font-black text-[#ffc400]">
            Dados do Motorista
          </h3>

          <div className="space-y-3">
            <Info titulo="Nome" valor="Motorista teste" />
            <Info titulo="E-mail" valor="motorista@flatauto.com" />
            <Info titulo="Telefone" valor="(81) 99999-9999" />
            <Info titulo="CPF" valor="123.456.789-00" />
            <Info titulo="Região" valor="Recife - PE" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10171b] p-4">
          <div className="mb-4 flex items-center gap-2">
            <Truck size={18} className="text-[#ffc400]" />
            <h3 className="text-lg font-black text-[#ffc400]">
              Dados do Veículo
            </h3>
          </div>

          <div className="space-y-3">
            <Info titulo="Tipo de veículo" valor="Caminhão" />
            <Info titulo="Modelo" valor="Volvo FH 540" />
            <Info titulo="Placa" valor="ABC1D23" />
            <Info titulo="Capacidade" valor="25 toneladas" />
            <Info titulo="Ano" valor="2023" />
          </div>
        </div>
      </div>
    </main>
  )
}

function Info({
  titulo,
  valor,
}: {
  titulo: string
  valor: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0b1014] p-4">
      <p className="text-xs font-black uppercase text-white/45">
        {titulo}
      </p>

      <p className="mt-1 text-lg font-black">
        {valor}
      </p>
    </article>
  )
}

