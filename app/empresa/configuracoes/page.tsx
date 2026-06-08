"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  ShieldCheck,
  UserRound,
  Eye,
  Sun,
  Moon,
  LockKeyhole,
  PlugZap,
  BarChart3,
  Map,
  Trash2,
} from "lucide-react"

type Tema = "dark" | "light"
type Permissao = "Administrador" | "Operador" | "Visualizador"

type Usuario = {
  id: number
  nome: string
  email: string
  permissao: Permissao
}

const usuariosIniciais: Usuario[] = [
  {
    id: 1,
    nome: "Luana Silva",
    email: "admin@flatauto.com",
    permissao: "Administrador",
  },
  {
    id: 2,
    nome: "Equipe Operacional",
    email: "operador@empresa.com",
    permissao: "Operador",
  },
]

export default function ConfiguracoesPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais)

  const [nomeEmpresa, setNomeEmpresa] = useState("Transportes Silva LTDA")
  const [cnpj, setCnpj] = useState("12.345.678/0001-90")
  const [telefone, setTelefone] = useState("(81) 99999-9999")
  const [whatsapp, setWhatsapp] = useState("(81) 98888-8888")
  const [email, setEmail] = useState("contato@empresa.com")
  const [endereco, setEndereco] = useState("Recife - PE")

  const [nomeUsuario, setNomeUsuario] = useState("")
  const [emailUsuario, setEmailUsuario] = useState("")
  const [permissaoUsuario, setPermissaoUsuario] =
    useState<Permissao>("Operador")

  useEffect(() => {
    function carregarTema() {
      const temaSalvo = localStorage.getItem("temaEmpresa")
      setTema(temaSalvo === "light" || temaSalvo === "claro" ? "light" : "dark")
    }

    carregarTema()
    window.addEventListener("storage", carregarTema)
    window.addEventListener("temaEmpresaAtualizado", carregarTema)

    return () => {
      window.removeEventListener("storage", carregarTema)
      window.removeEventListener("temaEmpresaAtualizado", carregarTema)
    }
  }, [])

  function trocarTema(novoTema: Tema) {
    setTema(novoTema)
    localStorage.setItem("temaEmpresa", novoTema)
    window.dispatchEvent(new Event("temaEmpresaAtualizado"))
  }

  function salvarEmpresa() {
    alert("Dados da empresa salvos visualmente. Depois vamos ligar no backend.")
  }

  function convidarUsuario() {
    if (!nomeUsuario || !emailUsuario) {
      alert("Preencha nome e e-mail do usuário.")
      return
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: nomeUsuario,
      email: emailUsuario,
      permissao: permissaoUsuario,
    }

    setUsuarios((lista) => [novoUsuario, ...lista])
    setNomeUsuario("")
    setEmailUsuario("")
    setPermissaoUsuario("Operador")
  }

  function removerUsuario(id: number) {
    const confirmar = confirm("Deseja remover este usuário?")
    if (!confirmar) return

    setUsuarios((lista) => lista.filter((usuario) => usuario.id !== id))
  }

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow-[0_18px_45px_rgba(80,60,20,0.10)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro
      ? "border-[#dfd0a5] bg-[#f7f0dc]"
      : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
    linha: claro ? "border-[#dfd0a5]" : "border-white/10",
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">
            Configurações
          </h1>
          <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
            Gerencie dados da empresa, usuários, permissões, tema e integrações.
          </p>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                <Building2 size={30} />
              </div>

              <div>
                <h2 className="text-xl font-black">Dados da empresa</h2>
                <p className={`text-sm ${ui.textoFraco}`}>
                  Informações principais da transportadora.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Campo ui={ui} label="Nome da empresa" value={nomeEmpresa} onChange={setNomeEmpresa} icon={<Building2 size={18} />} />
              <Campo ui={ui} label="CNPJ" value={cnpj} onChange={setCnpj} icon={<ShieldCheck size={18} />} />
              <Campo ui={ui} label="Telefone" value={telefone} onChange={setTelefone} icon={<Phone size={18} />} />
              <Campo ui={ui} label="WhatsApp" value={whatsapp} onChange={setWhatsapp} icon={<Phone size={18} />} />
              <Campo ui={ui} label="E-mail" value={email} onChange={setEmail} icon={<Mail size={18} />} />
              <Campo ui={ui} label="Endereço" value={endereco} onChange={setEndereco} icon={<MapPin size={18} />} />
            </div>

            <button
              onClick={salvarEmpresa}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black sm:w-fit sm:px-5"
            >
              <Save size={18} />
              Salvar alterações
            </button>
          </div>

          <div className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                {claro ? <Sun size={30} /> : <Moon size={30} />}
              </div>

              <div>
                <h2 className="text-xl font-black">Tema do sistema</h2>
                <p className={`text-sm ${ui.textoFraco}`}>
                  Essa configuração vale para toda a área Empresa.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => trocarTema("light")}
                className={`rounded-2xl border p-4 text-left ${
                  claro ? "border-[#ffc400] bg-[#ffc400]/15" : ui.card2
                }`}
              >
                <Sun className="text-[#ffc400]" />
                <h3 className="mt-3 font-black">Modo claro</h3>
                <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                  Visual branco e dourado.
                </p>
              </button>

              <button
                onClick={() => trocarTema("dark")}
                className={`rounded-2xl border p-4 text-left ${
                  !claro ? "border-[#ffc400] bg-[#ffc400]/15" : ui.card2
                }`}
              >
                <Moon className="text-[#ffc400]" />
                <h3 className="mt-3 font-black">Modo escuro</h3>
                <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                  Visual preto com amarelo.
                </p>
              </button>
            </div>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <p className={`text-sm font-bold ${ui.textoFraco}`}>Tema atual</p>
              <p className="mt-1 text-xl font-black">
                {claro ? "Modo claro" : "Modo escuro"}
              </p>
            </div>
          </div>
        </section>

        <section className={`rounded-[30px] border p-5 sm:p-6 ${ui.card}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                  <UserPlus size={30} />
                </div>

                <div>
                  <h2 className="text-xl font-black">Usuários e permissões</h2>
                  <p className={`text-sm ${ui.textoFraco}`}>
                    Convide pessoas para acessar a área da empresa.
                  </p>
                </div>
              </div>
            </div>

            <div className={`grid w-full gap-3 rounded-2xl border p-4 lg:max-w-[520px] ${ui.card2}`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <CampoSimples ui={ui} placeholder="Nome do usuário" value={nomeUsuario} onChange={setNomeUsuario} />
                <CampoSimples ui={ui} placeholder="E-mail do usuário" value={emailUsuario} onChange={setEmailUsuario} />
              </div>

              <select
                value={permissaoUsuario}
                onChange={(e) => setPermissaoUsuario(e.target.value as Permissao)}
                className={`h-12 rounded-xl border px-4 text-sm font-bold outline-none ${ui.card}`}
              >
                <option value="Administrador" className="bg-black text-white">Administrador</option>
                <option value="Operador" className="bg-black text-white">Operador</option>
                <option value="Visualizador" className="bg-black text-white">Visualizador</option>
              </select>

              <button
                onClick={convidarUsuario}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"
              >
                <UserPlus size={18} />
                Convidar usuário
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {usuarios.map((usuario) => (
              <article key={usuario.id} className={`rounded-[24px] border p-4 ${ui.card2}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                      {usuario.permissao === "Administrador" ? (
                        <ShieldCheck size={25} />
                      ) : usuario.permissao === "Operador" ? (
                        <UserRound size={25} />
                      ) : (
                        <Eye size={25} />
                      )}
                    </div>

                    <div>
                      <h3 className="font-black">{usuario.nome}</h3>
                      <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                        {usuario.email}
                      </p>
                      <PermissaoTag permissao={usuario.permissao} />
                    </div>
                  </div>

                  <button
                    onClick={() => removerUsuario(usuario.id)}
                    className="rounded-xl p-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <CardInfo
            ui={ui}
            icon={<LockKeyhole size={28} />}
            titulo="Segurança"
            texto="Alterar senha, autenticação em dois fatores e sessões ativas serão conectados ao backend depois."
          />

          <CardInfo
            ui={ui}
            icon={<PlugZap size={28} />}
            titulo="Integrações"
            texto="CRM, Analytics e Mapa ficam preparados para usar API/token quando a integração real for definida."
          />

          <CardInfo
            ui={ui}
            icon={<BarChart3 size={28} />}
            titulo="Relatórios"
            texto="Os relatórios serão alimentados pelas entregas reais, filtros de data e exportações."
          />

          <CardInfo
            ui={ui}
            icon={<Map size={28} />}
            titulo="Mapa"
            texto="O mapa está visual agora e depois receberá a localização real dos motoristas."
          />
        </section>
      </div>
    </main>
  )
}

function Campo({ ui, label, value, onChange, icon }: any) {
  return (
    <label>
      <span className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-12 items-center gap-3 rounded-xl border px-4 ${ui.card2}`}>
        <span className="text-[#ffc400]">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
      </div>
    </label>
  )
}

function CampoSimples({ ui, placeholder, value, onChange }: any) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-12 rounded-xl border px-4 text-sm font-bold outline-none ${ui.card}`}
    />
  )
}

function PermissaoTag({ permissao }: { permissao: Permissao }) {
  const classe =
    permissao === "Administrador"
      ? "bg-[#ffc400]/15 text-[#ffc400]"
      : permissao === "Operador"
      ? "bg-sky-500/15 text-sky-500"
      : "bg-green-500/15 text-green-500"

  return (
    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black ${classe}`}>
      {permissao}
    </span>
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