"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Camera, Save, Truck, UserRound } from "lucide-react"
import { supabase } from "../../../lib/supabase"

type Motorista = {
  id?: string
  nome?: string | null
  email?: string | null
  telefone?: string | null
  cpf?: string | null
  regiao?: string | null
  tipo_caminhao?: string | null
  modelo_caminhao?: string | null
  placa?: string | null
  capacidade?: string | null
  foto_perfil?: string | null
}

function texto(valor?: string | null) {
  return valor && String(valor).trim() ? String(valor) : "Não informado"
}

export default function PerfilPage() {
  const [motoristaId, setMotoristaId] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  const [fotoPerfil, setFotoPerfil] = useState("")
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cpf, setCpf] = useState("")
  const [regiao, setRegiao] = useState("")
  const [tipoVeiculo, setTipoVeiculo] = useState("")
  const [modelo, setModelo] = useState("")
  const [placa, setPlaca] = useState("")
  const [capacidade, setCapacidade] = useState("")

  useEffect(() => {
    carregarMotorista()
  }, [])

  async function carregarMotorista() {
    setCarregando(true)
    setErro("")

    const idSalvo = localStorage.getItem("flatauto_motorista_id")
    const emailSalvo = localStorage.getItem("motoristaEmail") || localStorage.getItem("flatauto_motorista_email")

    if (!idSalvo && !emailSalvo) {
      setErro("Motorista não encontrado no login.")
      setCarregando(false)
      return
    }

    let consulta = supabase
      .from("motoristas")
      .select("*")

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
      setErro("Motorista não encontrado no Supabase.")
      setCarregando(false)
      return
    }

    preencherCampos(data)

    if (data.id) {
      localStorage.setItem("flatauto_motorista_id", data.id)
      setMotoristaId(data.id)
    }

    if (data.email) {
      localStorage.setItem("flatauto_motorista_email", data.email)
      localStorage.setItem("motoristaEmail", data.email)
    }

    if (data.nome) localStorage.setItem("motoristaNome", data.nome)
    if (data.telefone) localStorage.setItem("motoristaTelefone", data.telefone)
    if (data.tipo_caminhao) localStorage.setItem("tipoVeiculoMotorista", data.tipo_caminhao)

    setCarregando(false)
  }

  function preencherCampos(data: Motorista) {
    setMotoristaId(data.id || "")
    setFotoPerfil(data.foto_perfil || "")
    setNome(data.nome || "")
    setEmail(data.email || "")
    setTelefone(data.telefone || "")
    setCpf(data.cpf || "")
    setRegiao(data.regiao || "")
    setTipoVeiculo(data.tipo_caminhao || "")
    setModelo(data.modelo_caminhao || "")
    setPlaca(data.placa || "")
    setCapacidade(data.capacidade || "")
  }

  function escolherFoto(arquivo?: File) {
    if (!arquivo) return

    const leitor = new FileReader()

    leitor.onload = () => {
      const resultado = String(leitor.result || "")
      setFotoPerfil(resultado)
    }

    leitor.readAsDataURL(arquivo)
  }

  async function salvarPerfil() {
    if (!motoristaId) {
      alert("Motorista não encontrado no login.")
      return
    }

    setSalvando(true)
    setErro("")

    const { data, error } = await supabase
      .from("motoristas")
      .update({
        nome: nome.trim() || null,
        telefone: telefone.trim() || null,
        cpf: cpf.trim() || null,
        regiao: regiao.trim() || null,
        tipo_caminhao: tipoVeiculo.trim() || null,
        modelo_caminhao: modelo.trim() || null,
        placa: placa.trim().toUpperCase() || null,
        capacidade: capacidade.trim() || null,
        foto_perfil: fotoPerfil || null,
      })
      .eq("id", motoristaId)
      .select("*")

    setSalvando(false)

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    if (!data || data.length === 0) {
      setErro("Não foi possível salvar no Supabase.")
      return
    }

    preencherCampos(data[0])

    localStorage.setItem("motoristaNome", data[0].nome || "")
    localStorage.setItem("motoristaTelefone", data[0].telefone || "")
    localStorage.setItem("tipoVeiculoMotorista", data[0].tipo_caminhao || "")

    alert("Perfil salvo no Supabase.")
  }

  function sairDaConta() {
    localStorage.removeItem("motoristaLogado")
    localStorage.removeItem("flatauto_motorista_id")
    localStorage.removeItem("flatauto_motorista_email")
    localStorage.removeItem("tipoVeiculoMotorista")
    localStorage.removeItem("motoristaNome")
    localStorage.removeItem("motoristaEmail")
    localStorage.removeItem("motoristaTelefone")

    window.location.replace("/")
  }

  return (
    <main className="min-h-screen bg-[#020507] px-4 py-5 text-white">
      <div className="mx-auto max-w-[480px] space-y-5 pb-8">
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

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="rounded-[28px] border border-white/10 bg-[#10171b] p-5 text-center">
          <div className="relative mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-[#ffc400] text-black">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Foto do motorista" className="h-full w-full object-cover" />
              ) : (
                <UserRound size={56} />
              )}
            </div>

            <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#ffc400] text-black shadow-lg">
              <Camera size={20} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(evento) => escolherFoto(evento.target.files?.[0])}
              />
            </label>
          </div>

          <h2 className="mt-5 text-2xl font-black">
            {texto(nome)}
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Dados reais do motorista e veículo.
          </p>
        </section>

        {carregando ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171b] p-6 text-center">
            <p className="text-sm font-bold text-white/60">Carregando perfil do Supabase...</p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-white/10 bg-[#10171b] p-4">
              <h3 className="mb-4 text-lg font-black text-[#ffc400]">
                Dados do Motorista
              </h3>

              <div className="space-y-3">
                <Campo titulo="Nome" valor={nome} onChange={setNome} />
                <Campo titulo="E-mail" valor={email} onChange={setEmail} disabled />
                <Campo titulo="Telefone" valor={telefone} onChange={setTelefone} />
                <Campo titulo="CPF" valor={cpf} onChange={setCpf} />
                <Campo titulo="Região" valor={regiao} onChange={setRegiao} />
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
                <Campo titulo="Tipo de veículo" valor={tipoVeiculo} onChange={setTipoVeiculo} placeholder="Moto, carro, van ou caminhão" />
                <Campo titulo="Modelo" valor={modelo} onChange={setModelo} />
                <Campo titulo="Placa" valor={placa} onChange={(valor) => setPlaca(valor.toUpperCase())} />
                <Campo titulo="Capacidade" valor={capacidade} onChange={setCapacidade} />
              </div>
            </div>

            <button
              type="button"
              onClick={salvarPerfil}
              disabled={salvando}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc400] text-base font-black text-black disabled:opacity-60"
            >
              <Save size={20} />
              {salvando ? "Salvando..." : "Salvar perfil"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={sairDaConta}
          className="h-14 w-full rounded-2xl border border-red-500/30 bg-red-500/10 text-base font-black text-red-300"
        >
          Sair da conta
        </button>
      </div>
    </main>
  )
}

function Campo({
  titulo,
  valor,
  onChange,
  placeholder,
  disabled,
}: {
  titulo: string
  valor: string
  onChange: (valor: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-[#0b1014] p-4">
      <p className="text-xs font-black uppercase text-white/45">
        {titulo}
      </p>

      <input
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        placeholder={placeholder || "Não informado"}
        disabled={disabled}
        className="mt-1 w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-white/25 disabled:text-white/45"
      />
    </label>
  )
}
