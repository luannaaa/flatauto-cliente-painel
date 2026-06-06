"use client"

import { useEffect, useState } from "react"
import PainelClienteMobile from "./components/PainelClienteMobile"

type Tela = "login" | "cadastro" | "painel"
type TipoConta = "cliente" | "motorista"

type Cliente = {
  nome: string
  email: string
  senha: string
  tipo: TipoConta
}

const STORAGE_CLIENTE = "flatauto_cliente_logado"

const CLIENTE_PADRAO: Cliente = {
  nome: "Cliente",
  email: "cliente@email.com",
  senha: "",
  tipo: "cliente",
}

export default function ClientePage() {
  const [tela, setTela] = useState<Tela>("painel")
  const [tipoConta, setTipoConta] = useState<TipoConta>("cliente")
  const [clienteSalvo, setClienteSalvo] = useState<Cliente | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<Cliente | null>(CLIENTE_PADRAO)

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregou, setCarregou] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const saiu = params.get("sair") === "1"

    if (saiu) {
      localStorage.removeItem(STORAGE_CLIENTE)
      setUsuarioLogado(null)
      setTela("login")
      setCarregou(true)
      return
    }

    const clienteGuardado = localStorage.getItem(STORAGE_CLIENTE)

    if (clienteGuardado) {
      try {
        const cliente = JSON.parse(clienteGuardado) as Cliente
        setClienteSalvo(cliente)
        setUsuarioLogado(cliente)
        setTela("painel")
      } catch {
        localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(CLIENTE_PADRAO))
        setUsuarioLogado(CLIENTE_PADRAO)
        setTela("painel")
      }
    } else {
      localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(CLIENTE_PADRAO))
      setClienteSalvo(CLIENTE_PADRAO)
      setUsuarioLogado(CLIENTE_PADRAO)
      setTela("painel")
    }

    window.history.replaceState(null, "", "/cliente")
    setCarregou(true)
  }, [])

  function limparCampos() {
    setNome("")
    setEmail("")
    setSenha("")
  }

  function salvarLogin(cliente: Cliente) {
    localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(cliente))
    setClienteSalvo(cliente)
    setUsuarioLogado(cliente)
    setTela("painel")
    window.history.replaceState(null, "", "/cliente")
  }

  function criarConta() {
    if (!nome || !email || !senha) {
      alert("Preencha nome, e-mail e senha.")
      return
    }

    const novoCliente: Cliente = {
      nome,
      email,
      senha,
      tipo: tipoConta,
    }

    salvarLogin(novoCliente)
  }

  function entrarConta() {
    if (!email || !senha) {
      alert("Preencha e-mail e senha.")
      return
    }

    const clienteParaEntrar: Cliente = clienteSalvo || {
      nome: nome || "Cliente",
      email,
      senha,
      tipo: "cliente",
    }

    salvarLogin(clienteParaEntrar)
  }

  function sair() {
    localStorage.removeItem(STORAGE_CLIENTE)
    setUsuarioLogado(null)
    limparCampos()
    setTela("login")
    window.history.replaceState(null, "", "/cliente?sair=1")
  }

  if (!carregou) {
    return (
      <main className="min-h-screen bg-[#030507] text-white flex items-center justify-center px-4 py-8">
        <p className="text-[#ffc400] font-bold">Carregando...</p>
      </main>
    )
  }

  if (tela === "painel" && usuarioLogado) {
    return (
      <PainelClienteMobile
        nomeCompleto={usuarioLogado.nome}
        onSair={sair}
      />
    )
  }

  return (
    <main className="min-h-screen bg-[#030507] text-white flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-[440px] rounded-[24px] border border-white/10 bg-[#05080b] px-6 py-10 shadow-[0_0_40px_rgba(255,196,0,0.06)]">
        <div className="text-center">
          <h1 className="text-[34px] font-extrabold leading-tight">
            {tela === "login" ? "Entrar na conta" : "Criar sua conta"}
          </h1>

          <p className="mt-4 text-[16px] text-zinc-300">
            {tela === "login"
              ? "Acesse sua conta para continuar"
              : "Preencha os dados para se cadastrar"}
          </p>
        </div>

        {tela === "cadastro" && (
          <div className="mt-9 grid grid-cols-2 gap-3">
            <button
              onClick={() => setTipoConta("cliente")}
              className={`h-16 rounded-[14px] border text-[18px] font-bold transition ${
                tipoConta === "cliente"
                  ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
                  : "border-white/20 bg-transparent text-white"
              }`}
            >
              Cliente
            </button>

            <button
              onClick={() => setTipoConta("motorista")}
              className={`h-16 rounded-[14px] border text-[18px] font-bold transition ${
                tipoConta === "motorista"
                  ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
                  : "border-white/20 bg-transparent text-white"
              }`}
            >
              Motorista
            </button>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {tela === "cadastro" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-16 w-full rounded-[8px] border border-white/20 bg-[#070b0f] px-5 text-[17px] text-white outline-none placeholder:text-zinc-400"
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 w-full rounded-[8px] border border-white/20 bg-[#070b0f] px-5 text-[17px] text-white outline-none placeholder:text-zinc-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="h-16 w-full rounded-[8px] border border-white/20 bg-[#070b0f] px-5 text-[17px] text-white outline-none placeholder:text-zinc-400"
          />

          {tela === "login" ? (
            <button
              onClick={entrarConta}
              className="mt-5 h-16 w-full rounded-[10px] bg-[#ffc400] text-[17px] font-extrabold text-black shadow-[0_0_28px_rgba(255,196,0,0.35)]"
            >
              Entrar
            </button>
          ) : (
            <button
              onClick={criarConta}
              className="mt-5 h-16 w-full rounded-[10px] bg-[#ffc400] text-[17px] font-extrabold text-black shadow-[0_0_28px_rgba(255,196,0,0.35)]"
            >
              Criar conta de {tipoConta}
            </button>
          )}

          {tela === "login" ? (
            <button
              onClick={() => {
                limparCampos()
                setTela("cadastro")
              }}
              className="h-14 w-full rounded-[10px] border border-[#ffc400] text-[16px] font-bold text-[#ffc400]"
            >
              Criar conta
            </button>
          ) : (
            <button
              onClick={() => {
                limparCampos()
                setTela("login")
              }}
              className="h-14 w-full rounded-[10px] border border-[#ffc400] text-[16px] font-bold text-[#ffc400]"
            >
              Voltar para login
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
