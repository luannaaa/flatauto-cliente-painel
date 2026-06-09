"use client"

import { ArrowLeft, UserRound } from "lucide-react"

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <Header titulo="Perfil" />

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ffc400] text-black">
            <UserRound size={42} />
          </div>
          <h2 className="mt-5 text-xl font-black">Motorista FlatAuto</h2>
          <p className="mt-2 text-sm text-white/60">Perfil visual preparado para o backend.</p>
        </section>

        <Info titulo="Nome" valor="Motorista teste" />
        <Info titulo="Veículo" valor="Caminhão" />
        <Info titulo="Região" valor="Recife - PE" />
      </div>
    </main>
  )
}

function Header({ titulo }: any) {
  return (
    <header className="flex items-center gap-3">
      <a href="/motorista" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <ArrowLeft size={22} />
      </a>
      <div>
        <p className="text-xs font-black text-[#ffc400]">FLATAUTO MOTORISTA</p>
        <h1 className="text-2xl font-black">{titulo}</h1>
      </div>
    </header>
  )
}

function Info({ titulo, valor }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <p className="text-xs font-black uppercase text-white/45">{titulo}</p>
      <p className="mt-1 font-black">{valor}</p>
    </article>
  )
}
