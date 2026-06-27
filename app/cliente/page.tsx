"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import PainelClienteMobile from "./components/PainelClienteMobile"

type ClienteSupabase = {
  id: string
  nome?: string | null
  email?: string | null
  telefone?: string | null
  cpf?: string | null
  foto_perfil?: string | null
}

function isMobile() {
  if (typeof window === "undefined") return false

  const userAgentMobile = /Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(
    navigator.userAgent
  )
  const larguraMobile = window.innerWidth <= 768
  const mediaMobile = window.matchMedia("(max-width: 768px)").matches

  return userAgentMobile || larguraMobile || mediaMobile
}

function primeiroNome(nome?: string | null) {
  const limpo = String(nome || "").trim()
  if (!limpo) return "Cliente"
  return limpo.split(" ")[0]
}

export default function ClientePage() {
  const [carregou, setCarregou] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [cliente, setCliente] = useState<ClienteSupabase | null>(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return

    setMobile(isMobile())
    setCarregou(true)

    localStorage.removeItem("flatauto_clientes_cadastrados")

    window.history.replaceState({ pagina: "cliente-painel" }, "", "/cliente")
    window.history.pushState({ pagina: "cliente-painel" }, "", "/cliente")

    const bloquearVoltarParaLogin = () => {
      window.history.pushState({ pagina: "cliente-painel" }, "", "/cliente")
    }

    window.addEventListener("popstate", bloquearVoltarParaLogin)

    carregarClienteReal()

    return () => {
      window.removeEventListener("popstate", bloquearVoltarParaLogin)
    }
  }, [])

  async function carregarClienteReal() {
    setErro("")

    const clienteId = localStorage.getItem("flatauto_cliente_id")
    const emailCliente =
      localStorage.getItem("flatauto_cliente_email") ||
      localStorage.getItem("flatauto_usuario_email")

    if (!clienteId && !emailCliente) {
      setErro("Cliente não encontrado no login.")
      return
    }

    let consulta = supabase
      .from("clientes")
      .select("id,nome,email,telefone,cpf,foto_perfil")

    if (clienteId) {
      consulta = consulta.eq("id", clienteId)
    } else {
      consulta = consulta.eq("email", String(emailCliente).trim().toLowerCase())
    }

    const { data, error } = await consulta.maybeSingle()

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    if (!data) {
      setErro("Cliente não encontrado no Supabase.")
      return
    }

    setCliente(data)

    localStorage.setItem("flatauto_cliente_id", String(data.id || ""))
    localStorage.setItem("flatauto_cliente_nome", data.nome || "Cliente")
    localStorage.setItem("flatauto_cliente_email", data.email || "")
    localStorage.setItem("flatauto_usuario_nome", data.nome || "Cliente")
    localStorage.setItem("flatauto_usuario_email", data.email || "")
    localStorage.setItem("flatauto_cliente_logado", "true")
  }

  function sair() {
    localStorage.removeItem("flatauto_cliente_logado")
    localStorage.removeItem("flatauto_cliente_id")
    localStorage.removeItem("flatauto_cliente_email")
    localStorage.removeItem("flatauto_cliente_nome")
    localStorage.removeItem("flatauto_usuario_nome")
    localStorage.removeItem("flatauto_usuario_email")
    localStorage.removeItem("flatauto_clientes_cadastrados")

    window.location.replace("/")
  }

  if (!carregou) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030507] px-4 py-8 text-white">
        <p className="font-bold text-[#ffc400]">Carregando...</p>
      </main>
    )
  }

  if (!mobile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030507] px-4 py-8 text-white">
        <section className="w-full max-w-[440px] rounded-[24px] border border-[#ffc400]/25 bg-[#05080b] px-6 py-10 text-center shadow-[0_0_40px_rgba(255,196,0,0.08)]">
          <h1 className="text-[30px] font-extrabold text-[#ffc400]">
            Acesso pelo computador bloqueado
          </h1>

          <p className="mt-4 text-[16px] text-zinc-300">
            A área do cliente foi preparada para acesso pelo celular.
          </p>

          <button
            type="button"
            onClick={() => window.location.replace("/")}
            className="mt-7 flex h-14 w-full items-center justify-center rounded-[10px] bg-[#ffc400] text-[16px] font-extrabold text-black"
          >
            Voltar para o login principal
          </button>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030507] px-4 py-8 text-white">
        <section className="w-full max-w-[430px] rounded-[24px] border border-red-500/25 bg-[#05080b] p-6 text-center">
          <h1 className="text-xl font-black text-red-400">Erro no cliente</h1>
          <p className="mt-3 text-sm font-bold text-white/70">{erro}</p>

          <button
            type="button"
            onClick={carregarClienteReal}
            className="mt-6 h-12 w-full rounded-xl bg-[#ffc400] font-black text-black"
          >
            Tentar novamente
          </button>

          <button
            type="button"
            onClick={sair}
            className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] font-black text-white"
          >
            Sair
          </button>
        </section>
      </main>
    )
  }

  return (
    <PainelClienteMobile
      nomeCompleto={primeiroNome(cliente?.nome)}
      onSair={sair}
    />
  )
}
