"use client"

import { useState } from "react"
import { Mail, Lock, Truck, Building2, UserRound } from "lucide-react"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  function entrar() {
    const emailLimpo = email.trim().toLowerCase()
    const senhaLimpa = senha.trim()

    setErro("")

    // LOGIN EMPRESA TESTE
    if (
      emailLimpo === "luanacat249@gmail.com" &&
      senhaLimpa === "12345678"
    ) {
      localStorage.setItem("empresaLogada", "true")
      window.location.href = "/empresa"
      return
    }

    // LOGIN MOTORISTA TESTE
    if (
      emailLimpo === "luanacat249@gmail.com" &&
      senhaLimpa === "luke2003"
    ) {
      localStorage.setItem("motoristaLogado", "true")
      localStorage.setItem("tipoVeiculoMotorista", "caminhao")
      window.location.href = "/motorista"
      return
    }

    setErro("E-mail ou senha incorretos.")
  }

  return (
    <main className="min-h-screen bg-[#020507] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-5 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                <Truck size={32} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#ffc400]">FLATAUTO</p>
                <p className="text-sm font-bold text-white/60">Fretes rápidos, com segurança e confiança.</p>
              </div>
            </div>

            <h1 className="mt-10 max-w-[520px] text-5xl font-black leading-tight">
              Acesse sua área e acompanhe suas entregas.
            </h1>

            <p className="mt-5 max-w-[480px] text-lg text-white/60">
              Plataforma preparada para cliente, empresa e motorista.
            </p>

            <div className="mt-8 grid max-w-[480px] gap-4">
              <Info icon={<Building2 size={22} />} titulo="Empresa" texto="Painel de entregas, veículos e motoristas." />
              <Info icon={<UserRound size={22} />} titulo="Motorista" texto="Corridas, mapa, agendamentos e ganhos." />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[430px] rounded-[34px] border border-white/10 bg-[#10171b] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
              <Truck size={34} />
            </div>

            <h2 className="mt-6 text-4xl font-black">Entrar</h2>
            <p className="mt-2 text-sm text-white/55">
              Use seu e-mail e senha para acessar sua área.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/60">E-mail</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
                  <Mail size={20} className="text-[#ffc400]" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/60">Senha</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
                  <Lock size={20} className="text-[#ffc400]" />
                  <input
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    type="password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") entrar()
                    }}
                  />
                </div>
              </label>

              {erro && (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
                  {erro}
                </p>
              )}

              <button
                onClick={entrar}
                className="h-14 w-full rounded-2xl bg-[#ffc400] text-base font-black text-black shadow-[0_12px_30px_rgba(255,196,0,0.25)]"
              >
                Entrar
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/50">
                <p className="font-bold text-white/70">Teste Motorista:</p>
                <p>E-mail: luanacat249@gmail.com</p>
                <p>Senha: luke2003</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Info({ icon, titulo, texto }: any) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffc400] text-black">
        {icon}
      </div>
      <div>
        <h3 className="font-black">{titulo}</h3>
        <p className="mt-1 text-sm text-white/55">{texto}</p>
      </div>
    </div>
  )
}
