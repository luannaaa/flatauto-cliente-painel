"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { supabase } from "../../../lib/supabase"

type Cliente = {
  id: string
  nome?: string | null
  email?: string | null
  telefone?: string | null
  cpf?: string | null
  foto_perfil?: string | null
}

function texto(valor?: string | null) {
  const limpo = String(valor || "").trim()
  return limpo || "Não informado"
}

export default function PerfilPage() {
  const [clienteId, setClienteId] = useState("")
  const [foto, setFoto] = useState("/foto_perfil_cadastro.png")
  const [nome, setNome] = useState("Cliente")
  const [email, setEmail] = useState("Não informado")
  const [telefone, setTelefone] = useState("Não informado")
  const [cpf, setCpf] = useState("Não informado")
  const [carregando, setCarregando] = useState(true)
  const [salvandoFoto, setSalvandoFoto] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    carregarCliente()
  }, [])

  async function carregarCliente() {
    setCarregando(true)
    setErro("")
    setSucesso("")

    const idSalvo = localStorage.getItem("flatauto_cliente_id")
    const emailSalvo =
      localStorage.getItem("flatauto_cliente_email") ||
      localStorage.getItem("flatauto_usuario_email")

    if (!idSalvo && !emailSalvo) {
      setErro("Cliente não encontrado no login.")
      setCarregando(false)
      return
    }

    let consulta = supabase
      .from("clientes")
      .select("id,nome,email,telefone,cpf,foto_perfil")

    if (idSalvo) {
      consulta = consulta.eq("id", idSalvo)
    } else {
      consulta = consulta.eq("email", String(emailSalvo).trim().toLowerCase())
    }

    const { data, error } = await consulta.maybeSingle()

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    if (!data) {
      setErro("Cliente não encontrado no Supabase.")
      setCarregando(false)
      return
    }

    preencherCliente(data)
    setCarregando(false)
  }

  function preencherCliente(data: Cliente) {
    setClienteId(data.id)
    setNome(texto(data.nome))
    setEmail(texto(data.email))
    setTelefone(texto(data.telefone))
    setCpf(texto(data.cpf))

    if (data.foto_perfil && data.foto_perfil !== "sem-foto") {
      setFoto(data.foto_perfil)
    } else {
      setFoto("/foto_perfil_cadastro.png")
    }

    localStorage.setItem("flatauto_cliente_id", data.id)
    localStorage.setItem("flatauto_cliente_nome", data.nome || "Cliente")
    localStorage.setItem("flatauto_cliente_email", data.email || "")
    localStorage.setItem("flatauto_cliente_telefone", data.telefone || "")
  }

  function voltarPainel() {
    window.location.replace("/cliente")
  }

  function sairDaConta() {
    localStorage.removeItem("flatauto_cliente_logado")
    localStorage.removeItem("flatauto_cliente_id")
    localStorage.removeItem("flatauto_cliente_email")
    localStorage.removeItem("flatauto_cliente_nome")
    localStorage.removeItem("flatauto_cliente_telefone")
    localStorage.removeItem("flatauto_usuario_nome")
    localStorage.removeItem("flatauto_usuario_email")
    localStorage.removeItem("flatauto_clientes_cadastrados")

    window.location.replace("/")
  }

  function trocarFoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async () => {
      const fotoBase64 = String(reader.result || "")
      setFoto(fotoBase64)
      await salvarFoto(fotoBase64)
    }

    reader.readAsDataURL(file)
  }

  async function salvarFoto(fotoBase64: string) {
    if (!clienteId) {
      setErro("Cliente não encontrado no login.")
      return
    }

    setSalvandoFoto(true)
    setErro("")
    setSucesso("")

    const { data, error } = await supabase
      .from("clientes")
      .update({
        foto_perfil: fotoBase64 || "sem-foto",
      })
      .eq("id", clienteId)
      .select("id,nome,email,telefone,cpf,foto_perfil")
      .maybeSingle()

    setSalvandoFoto(false)

    if (error) {
      setErro(`Erro ao salvar foto: ${error.message}`)
      return
    }

    if (!data) {
      setErro("Não consegui confirmar a foto no Supabase.")
      return
    }

    preencherCliente(data)
    setSucesso("Foto salva no Supabase.")
  }

  return (
    <main className="min-h-screen bg-black px-5 pt-8 text-white">
      <div className="mx-auto max-w-[430px] pb-10">
        <button onClick={voltarPainel} className="font-bold text-[#ffc400]">
          ← Voltar
        </button>

        <section className="mt-8 rounded-[26px] border border-[#ffc400]/25 bg-[#080808] p-6 text-center">
          <label className="mx-auto block h-[110px] w-[110px] cursor-pointer overflow-hidden rounded-full border-4 border-[#ffc400] bg-[#ffc400]/15 p-1">
            <Image
              src={foto}
              alt="Perfil"
              width={110}
              height={110}
              unoptimized
              className="h-full w-full rounded-full object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={trocarFoto}
              className="hidden"
            />
          </label>

          <p className="mt-3 text-sm font-bold text-[#ffc400]">
            {salvandoFoto ? "Salvando foto..." : "Trocar foto"}
          </p>

          <h1 className="mt-5 text-[30px] font-black">Perfil do cliente</h1>

          {erro && (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-400">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-sm font-bold text-green-400">
              {sucesso}
            </p>
          )}

          {carregando ? (
            <div className="mt-6 rounded-[18px] border border-white/10 bg-black p-5">
              <p className="font-bold text-[#ffc400]">Carregando perfil do Supabase...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4 text-left">
              <Campo label="Nome" value={nome} />
              <Campo label="E-mail" value={email} bloqueado />
              <Campo label="Telefone" value={telefone} bloqueado />
              <Campo label="CPF" value={cpf} bloqueado />
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-white/45">
            E-mail, telefone e CPF ficam bloqueados aqui para segurança. A foto pode ser alterada e salva no Supabase.
          </p>

          <button
            type="button"
            onClick={sairDaConta}
            className="mt-7 h-14 w-full rounded-[14px] border border-red-500/40 bg-red-500/10 text-[16px] font-black text-red-300"
          >
            Sair da conta
          </button>
        </section>
      </div>
    </main>
  )
}

function Campo({
  label,
  value,
  bloqueado,
}: {
  label: string
  value: string
  bloqueado?: boolean
}) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white/45">{label}</p>

        {bloqueado && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black text-white/40">
            Bloqueado
          </span>
        )}
      </div>

      <p className="mt-1 text-[16px] font-bold text-white">{value}</p>
    </div>
  )
}
