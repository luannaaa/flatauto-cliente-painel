"use client"

import { ArrowLeft, Settings } from "lucide-react"

export default function ConfiguracoesPage() {
  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5">
        <Header titulo="Configurações" />

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
            <Settings size={34} />
          </div>
          <h2 className="mt-5 text-xl font-black">Configurações do motorista</h2>
          <p className="mt-2 text-sm text-white/60">Tela preparada para preferências, notificações e dados da conta.</p>
        </section>

        <Opcao titulo="Notificações" texto="Receber alertas de novas corridas" />
        <Opcao titulo="Região de atuação" texto="Recife e região metropolitana" />
        <Opcao titulo="Conta" texto="Dados e segurança" />
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

function Opcao({ titulo, texto }: any) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#10171b] p-4">
      <p className="font-black">{titulo}</p>
      <p className="mt-1 text-sm text-white/60">{texto}</p>
    </article>
  )
}
