"use client"

import { useEffect, useState } from "react"
import PainelClienteMobile from "./components/PainelClienteMobile"

type Tela = "login" | "cadastro" | "painel"

type Cliente = {
  nome: string
  email: string
  senha: string
}

const STORAGE_CLIENTE = "flatauto_cliente_logado"

const CLIENTE_TESTE: Cliente = {
  nome: "Cliente",
  email: "luanacat249@gmail.com",
  senha: "123456789",
}

function isMobile() {
  if (typeof window === "undefined") return false

  const userAgentMobile = /Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(navigator.userAgent)
  const larguraMobile = window.innerWidth <= 768
  const mediaMobile = window.matchMedia("(max-width: 768px)").matches

  return userAgentMobile || larguraMobile || mediaMobile
}

export default function ClientePage() {
  const [tela, setTela] = useState<Tela>("login")
  const [usuarioLogado, setUsuarioLogado] = useState<Cliente | null>(null)

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregou, setCarregou] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const saiu = params.get("sair") === "1"

    if (saiu) {
      localStorage.removeItem(STORAGE_CLIENTE)
      setUsuarioLogado(null)
      setTela("login")
      setCarregou(true)
      window.history.replaceState(null, "", "/cliente")
      return
    }

    const clienteGuardado = localStorage.getItem(STORAGE_CLIENTE)

    if (clienteGuardado) {
      try {
        const cliente = JSON.parse(clienteGuardado) as Cliente

        if (cliente?.email && cliente?.senha) {
          setUsuarioLogado(cliente)
          setTela("painel")
        } else {
          localStorage.removeItem(STORAGE_CLIENTE)
          setTela("login")
        }
      } catch {
        localStorage.removeItem(STORAGE_CLIENTE)
        setTela("login")
      }
    } else {
      setTela("login")
    }

    setCarregou(true)
  }, [])

  function limparCampos() {
    setNome("")
    setEmail("")
    setSenha("")
    setMensagem("")
  }

  function salvarLogin(cliente: Cliente) {
    localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(cliente))
    setUsuarioLogado(cliente)
    setTela("painel")
    window.history.replaceState(null, "", "/cliente")
  }

  function criarConta() {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim().toLowerCase()
    const senhaLimpa = senha.trim()

    setMensagem("")

    if (!nomeLimpo || !emailLimpo || !senhaLimpa) {
      setMensagem("Preencha nome, e-mail e senha para criar a conta.")
      return
    }

    if (senhaLimpa.length < 6) {
      setMensagem("A senha precisa ter pelo menos 6 caracteres.")
      return
    }

    const novoCliente: Cliente = {
      nome: nomeLimpo,
      email: emailLimpo,
      senha: senhaLimpa,
    }

    salvarLogin(novoCliente)
  }

  function entrarConta() {
    const emailLimpo = email.trim().toLowerCase()
    const senhaLimpa = senha.trim()

    setMensagem("")

    if (!emailLimpo || !senhaLimpa) {
      setMensagem("Digite e-mail e senha para entrar.")
      return
    }

    const clienteGuardado = localStorage.getItem(STORAGE_CLIENTE)
    let clienteSalvo: Cliente | null = null

    if (clienteGuardado) {
      try {
        clienteSalvo = JSON.parse(clienteGuardado) as Cliente
      } catch {
        clienteSalvo = null
        localStorage.removeItem(STORAGE_CLIENTE)
      }
    }

    const loginTesteCorreto =
      emailLimpo === CLIENTE_TESTE.email &&
      senhaLimpa === CLIENTE_TESTE.senha

    const loginContaCriadaCorreto =
      clienteSalvo?.email?.toLowerCase() === emailLimpo &&
      clienteSalvo?.senha === senhaLimpa

    if (loginTesteCorreto) {
      salvarLogin(CLIENTE_TESTE)
      return
    }

    if (loginContaCriadaCorreto && clienteSalvo) {
      salvarLogin(clienteSalvo)
      return
    }

    setMensagem("E-mail ou senha inválidos. Verifique os dados ou crie uma conta.")
  }

  function sair() {
    localStorage.removeItem(STORAGE_CLIENTE)
    setUsuarioLogado(null)
    limparCampos()
    setTela("login")
    window.history.replaceState(null, "", "/cliente")
  }

  if (!carregou) {
    return (
      <main className="min-h-screen bg-[#030507] text-white flex items-center justify-center px-4 py-8">
        <p className="text-[#ffc400] font-bold">Carregando...</p>
      </main>
    )
  }

  if (!isMobile()) {
    return (
      <main className="min-h-screen bg-[#030507] text-white flex items-center justify-center px-4 py-8">
        <section className="w-full max-w-[440px] rounded-[24px] border border-[#ffc400]/25 bg-[#05080b] px-6 py-10 text-center shadow-[0_0_40px_rgba(255,196,0,0.08)]">
          <h1 className="text-[30px] font-extrabold text-[#ffc400]">Instale o app</h1>
          <p className="mt-4 text-[16px] text-zinc-300">
            A área do cliente foi preparada para acesso pelo celular.
          </p>
          <a
            href="/"
            className="mt-7 flex h-14 w-full items-center justify-center rounded-[10px] bg-[#ffc400] text-[16px] font-extrabold text-black"
          >
            Voltar
          </a>
        </section>
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
              ? "Use seus dados corretos para acessar"
              : "Preencha os dados para se cadastrar"}
          </p>
        </div>

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

          {mensagem && (
            <div className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-bold text-red-300">
              {mensagem}
            </div>
          )}

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
              Criar conta de cliente
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

        <p className="mt-6 text-center text-xs text-white/40">
          Cliente teste: luanacat249@gmail.com / 123456789
        </p>
      </section>
    </main>
  )
}
