"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  ShieldCheck,
  Sun,
  Moon,
  LockKeyhole,
  PlugZap,
  BarChart3,
  Map,
} from "lucide-react"

type Tema = "dark" | "light"
type Permissao = "Administrador" | "Operador" | "Visualizador"

type Usuario = {
  id: string
  nome: string
  email: string
  permissao: Permissao
}

export default function ConfiguracoesPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [empresaId, setEmpresaId] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [nomeEmpresa, setNomeEmpresa] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [telefone, setTelefone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [endereco, setEndereco] = useState("")
  const [responsavel, setResponsavel] = useState("")

  const [nomeUsuario, setNomeUsuario] = useState("")
  const [emailUsuario, setEmailUsuario] = useState("")
  const [permissaoUsuario, setPermissaoUsuario] = useState<Permissao>("Operador")

  useEffect(() => {
    function carregarTema() {
      const temaSalvo = localStorage.getItem("temaEmpresa")
      setTema(temaSalvo === "light" || temaSalvo === "claro" ? "light" : "dark")
    }

    carregarTema()
    carregarEmpresa()

    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  async function carregarEmpresa() {
    setCarregando(true)
    setErro("")

    const idSalvo = localStorage.getItem("flatauto_empresa_id")
    const dadosSalvos = localStorage.getItem("flatauto_empresa_dados")
    const emailSalvo =
      localStorage.getItem("flatauto_empresa_email") ||
      localStorage.getItem("flatauto_usuario_email")

    let idParaBuscar = idSalvo || ""
    let emailParaBuscar = emailSalvo || ""

    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos)

        idParaBuscar = idParaBuscar || dados.id || ""
        emailParaBuscar = emailParaBuscar || dados.email || ""

        preencherCamposEmpresa(dados)
      } catch {
        localStorage.removeItem("flatauto_empresa_dados")
      }
    }

    if (!idParaBuscar && !emailParaBuscar) {
      setErro("Empresa não encontrada no login.")
      setCarregando(false)
      return
    }

    let consulta = supabase
      .from("empresas")
      .select("id,nome_empresa,email,telefone,cnpj,logo_empresa,responsavel,foto_documento,created_at")

    if (idParaBuscar) {
      consulta = consulta.eq("id", idParaBuscar)
    } else {
      consulta = consulta.eq("email", emailParaBuscar.trim().toLowerCase())
    }

    const { data, error } = await consulta.maybeSingle()

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setCarregando(false)
      return
    }

    if (data) {
      preencherCamposEmpresa(data)

      localStorage.setItem("flatauto_empresa_logada", "true")
      localStorage.setItem("flatauto_empresa_dados", JSON.stringify(data))

      if (data.id) {
        localStorage.setItem("flatauto_empresa_id", data.id)
        setEmpresaId(data.id)
      }

      if (data.email) {
        localStorage.setItem("flatauto_empresa_email", data.email)
        localStorage.setItem("flatauto_usuario_email", data.email)
      }
    }

    setUsuarios([])
    setCarregando(false)
  }

  function preencherCamposEmpresa(data: any) {
    setEmpresaId(data.id || "")
    setNomeEmpresa(data.nome_empresa || "")
    setCnpj(data.cnpj || "")
    setTelefone(data.telefone || "")
    setWhatsapp(data.telefone || "")
    setEmail(data.email || "")
    setEndereco(data.endereco || "")
    setResponsavel(data.responsavel || "")
  }

  function trocarTema(novoTema: Tema) {
    setTema(novoTema)
    localStorage.setItem("temaEmpresa", novoTema)
    window.dispatchEvent(new Event("temaEmpresaAtualizado"))
  }

  async function salvarEmpresa() {
    if (!empresaId) {
      alert("Empresa não encontrada no login.")
      return
    }

    const { data, error } = await supabase
      .from("empresas")
      .update({
        nome_empresa: nomeEmpresa.trim() || null,
        cnpj: cnpj.trim() || null,
        telefone: telefone.trim() || null,
        email: email.trim() || null,
        responsavel: responsavel.trim() || null,
      })
      .eq("id", empresaId)
      .select("id,nome_empresa,email,telefone,cnpj,logo_empresa,responsavel,foto_documento,created_at")
      .maybeSingle()

    if (error) {
      alert(`Erro Supabase: ${error.message}`)
      return
    }

    if (data) {
      preencherCamposEmpresa(data)
      localStorage.setItem("flatauto_empresa_dados", JSON.stringify(data))
      alert("Dados da empresa salvos.")
    }
  }

  function convidarUsuario() {
    if (!nomeUsuario.trim() || !emailUsuario.trim()) {
      alert("Preencha nome e e-mail do usuário.")
      return
    }

    const novoUsuario: Usuario = {
      id: String(Date.now()),
      nome: nomeUsuario.trim(),
      email: emailUsuario.trim(),
      permissao: permissaoUsuario,
    }

    setUsuarios((lista) => [novoUsuario, ...lista])
    setNomeUsuario("")
    setEmailUsuario("")
    setPermissaoUsuario("Operador")
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow-[0_18px_45px_rgba(80,60,20,0.10)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">Configurações</h1>
          <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
            Dados reais da empresa conectados ao Supabase.
          </p>
        </header>

        {erro && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            {erro}
          </div>
        )}

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
            <Titulo icon={<Building2 size={30} />} titulo="Dados da empresa" texto="Informações principais cadastradas no Supabase." ui={ui} />

            {carregando ? (
              <p className={`mt-6 text-sm ${ui.textoFraco}`}>Carregando dados reais...</p>
            ) : (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Campo ui={ui} label="Nome da empresa" value={nomeEmpresa} onChange={setNomeEmpresa} icon={<Building2 size={18} />} />
                  <Campo ui={ui} label="CNPJ" value={cnpj} onChange={setCnpj} icon={<ShieldCheck size={18} />} />
                  <Campo ui={ui} label="Telefone" value={telefone} onChange={setTelefone} icon={<Phone size={18} />} />
                  <Campo ui={ui} label="WhatsApp" value={whatsapp} onChange={setWhatsapp} icon={<Phone size={18} />} />
                  <Campo ui={ui} label="E-mail" value={email} onChange={setEmail} icon={<Mail size={18} />} />
                  <Campo ui={ui} label="Responsável" value={responsavel} onChange={setResponsavel} icon={<ShieldCheck size={18} />} />
                  <Campo ui={ui} label="Endereço" value={endereco} onChange={setEndereco} icon={<MapPin size={18} />} />
                </div>

                <button
                  onClick={salvarEmpresa}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black sm:w-fit sm:px-5"
                >
                  <Save size={18} />
                  Salvar alterações
                </button>
              </>
            )}
          </div>

          <div className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
            <Titulo icon={claro ? <Sun size={30} /> : <Moon size={30} />} titulo="Tema do sistema" texto="Essa configuração vale para toda a área Empresa." ui={ui} />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => trocarTema("light")} className={`rounded-2xl border p-4 text-left ${claro ? "border-[#ffc400] bg-[#ffc400]/15" : ui.card2}`}>
                <Sun className="text-[#ffc400]" />
                <h3 className="mt-3 font-black">Modo claro</h3>
                <p className={`mt-1 text-sm ${ui.textoFraco}`}>Visual branco e dourado.</p>
              </button>

              <button onClick={() => trocarTema("dark")} className={`rounded-2xl border p-4 text-left ${!claro ? "border-[#ffc400] bg-[#ffc400]/15" : ui.card2}`}>
                <Moon className="text-[#ffc400]" />
                <h3 className="mt-3 font-black">Modo escuro</h3>
                <p className={`mt-1 text-sm ${ui.textoFraco}`}>Visual preto com amarelo.</p>
              </button>
            </div>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <p className={`text-sm font-bold ${ui.textoFraco}`}>Tema atual</p>
              <p className="mt-1 text-xl font-black">{claro ? "Modo claro" : "Modo escuro"}</p>
            </div>
          </div>
        </section>

        <section className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <Titulo icon={<UserPlus size={30} />} titulo="Usuários e permissões" texto="Estrutura pronta para permissões reais." ui={ui} />

            <div className={`grid w-full gap-3 rounded-2xl border p-4 lg:max-w-[520px] ${ui.card2}`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <CampoSimples ui={ui} placeholder="Nome do usuário" value={nomeUsuario} onChange={setNomeUsuario} />
                <CampoSimples ui={ui} placeholder="E-mail do usuário" value={emailUsuario} onChange={setEmailUsuario} />
              </div>

              <select value={permissaoUsuario} onChange={(e) => setPermissaoUsuario(e.target.value as Permissao)} className={`h-12 rounded-xl border px-4 text-sm font-bold outline-none ${ui.card}`}>
                <option value="Administrador" className="bg-black text-white">Administrador</option>
                <option value="Operador" className="bg-black text-white">Operador</option>
                <option value="Visualizador" className="bg-black text-white">Visualizador</option>
              </select>

              <button onClick={convidarUsuario} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black">
                <UserPlus size={18} />
                Convidar usuário
              </button>
            </div>
          </div>

          <div className="mt-6">
            {usuarios.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-6 text-center ${ui.card2}`}>
                <p className={`text-sm ${ui.textoFraco}`}>
                  Nenhum usuário adicional cadastrado ainda.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {usuarios.map((usuario) => (
                  <article key={usuario.id} className={`rounded-[24px] border p-4 ${ui.card2}`}>
                    <h3 className="font-black">{usuario.nome}</h3>
                    <p className={`mt-1 text-sm ${ui.textoFraco}`}>{usuario.email}</p>
                    <span className="mt-2 inline-block rounded-full bg-[#ffc400]/15 px-3 py-1 text-xs font-black text-[#ffc400]">
                      {usuario.permissao}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <CardInfo ui={ui} icon={<LockKeyhole size={28} />} titulo="Segurança" texto="Estrutura pronta para senha, 2FA e sessões." />
          <CardInfo ui={ui} icon={<PlugZap size={28} />} titulo="Integrações" texto="CRM, Analytics e Mapa preparados para API/token." />
          <CardInfo ui={ui} icon={<BarChart3 size={28} />} titulo="Relatórios" texto="Relatórios alimentados pelas entregas reais." />
          <CardInfo ui={ui} icon={<Map size={28} />} titulo="Mapa" texto="Mapa preparado para localização real dos motoristas." />
        </section>
      </div>
    </main>
  )
}

function Titulo({ icon, titulo, texto, ui }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-black">{titulo}</h2>
        <p className={`text-sm ${ui.textoFraco}`}>{texto}</p>
      </div>
    </div>
  )
}

function Campo({ ui, label, value, onChange, icon }: any) {
  return (
    <label>
      <span className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>{label}</span>
      <div className={`flex h-12 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
        <span className="text-[#ffc400]">{icon}</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
      </div>
    </label>
  )
}

function CampoSimples({ ui, placeholder, value, onChange }: any) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`h-12 rounded-xl border px-4 text-sm font-bold outline-none ${ui.card}`} />
  )
}

function CardInfo({ ui, icon, titulo, texto }: any) {
  return (
    <article className={`rounded-[26px] border p-5 ${ui.card}`}>
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-black">{titulo}</h3>
          <p className={`mt-2 text-sm ${ui.textoFraco}`}>{texto}</p>
        </div>
      </div>
    </article>
  )
}