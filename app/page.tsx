"use client"

import { useState } from "react"
import TelaBloqueio from "./cliente/components/TelaBloqueio"
import PainelClienteMobile from "./cliente/components/PainelClienteMobile"
type TipoConta = "cliente" | "motorista"

type CadastroBase = {
  nome: string
  email: string
  senha: string
  tipo: TipoConta
  empresa?: boolean
}

const imagens = {
  logo: "/logo.png",
  google: "/logo_google.png",
  fundoLogin: "/bg-web.png",
  fundoMotorista: "/bgmotorista.png",

  rapido: "/rapido.png",
  seguranca: "/confianca.png",
  confiavel: "/confibilidade.png",

  fotoPerfilCadastro: "/foto_perfil_cadastro.png",
  nomePerfil: "/nome_perfil.png",
  modeloCaminhao: "/modelo_caminhao.png",
  placa: "/placa.png",
  capacidade: "/capacidade.png",
  regiao: "/regiao.png",
  documento: "/documento.png",
  cnh: "/cnh.png",

  telefoneWhatsapp: "/telefone_whatsapp.png",
  empresaCliente: "/empresa_cliente.png",
  origemFrete: "/origem_frete.png",
  destinoEntrega: "/destino_entrega.png",
  tipoCarga: "/tipo_carga.png",

  inicioIcon: "/inicio.png",
  solicitaFreteIcon: "/solicita_frete.png",
  minhasViagensIcon: "/caminhao_preto.png",
  motoristasIcon: "/localizacao_preta.png",
  pagamentoIcon: "/pagamento.png",
  perfilIcon: "/nome_perfil.png",
  ajudaIcon: "/ajuda.png",
  configuracaoIcon: "/configuracao.png",
  indiqueGanheIcon: "/indique_ganhe.png",
  notificacaoIcon: "/notificacao.png",
  estimativaIcon: "/estimativa.png",
  motoristaProximoIcon: "/motorista_proximo.png",
  tempoMedioIcon: "/tempo_medio.png",
  statusFreteIcon: "/status_frete.png",
  caminhaoPreto: "/caminhao_preto.png",
}

function isMobile() {
  if (typeof window === "undefined") return false

  const userAgentMobile = /Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(navigator.userAgent)
  const larguraMobile = window.innerWidth <= 768
  const mediaMobile = window.matchMedia("(max-width: 768px)").matches

  return userAgentMobile || larguraMobile || mediaMobile
}

export default function Home() {
  const [screen, setScreen] = useState<
    "login" | "cadastro" | "cadastroMotorista" | "cadastroCliente" | "painelCliente" | "bloqueado"
  >("login")

  const [mostrarEscolhaTipo, setMostrarEscolhaTipo] = useState(false)
  const [salvandoTipo, setSalvandoTipo] = useState(false)

  const [cadastroBase, setCadastroBase] = useState<CadastroBase>({
    nome: "",
    email: "",
    senha: "",
    tipo: "cliente",
    empresa: false,
  })


  function bloquearSeForComputador() {
    if (!isMobile()) {
      setScreen("bloqueado")
      return true
    }

    return false
  }

  function loginComGoogle() {
    if (bloquearSeForComputador()) return
    alert("Google entra depois. Agora estamos testando sem banco.")
  }

  function entrarNoPainelMobile() {
    if (!isMobile()) {
      setScreen("bloqueado")
      return
    }

    // IMPORTANTE:
    // Antes estava usando window.location.href = "/cliente".
    // Isso fazia abrir outra página e pedir login de novo.
    // Agora entra direto no painel dentro da mesma tela.
    setScreen("painelCliente")
  }

  function finalizarCadastroVisual() {
    if (!isMobile()) {
      setScreen("bloqueado")
      return
    }

    if (cadastroBase.tipo === "motorista") {
      localStorage.setItem("motoristaLogado", "true")
      localStorage.setItem("tipoVeiculoMotorista", "caminhao")
      window.location.href = "/motorista"
      return
    }

    // Cliente entra direto no painel sem pedir login de novo
    setScreen("painelCliente")
  }

  function salvarTipoGoogle(tipo: "cliente" | "motorista") {
    setSalvandoTipo(true)
    setTimeout(() => {
      setMostrarEscolhaTipo(false)
      setSalvandoTipo(false)

      if (tipo === "cliente") {
        entrarNoPainelMobile()
      } else {
        setCadastroBase((atual) => ({ ...atual, tipo: "motorista" }))
        setScreen("cadastroMotorista")
      }
    }, 400)
  }

  function abrirCadastroMotorista(dados: CadastroBase) {
    setCadastroBase(dados)
    setScreen("cadastroMotorista")
  }

  function abrirCadastroCliente(dados: CadastroBase) {
    setCadastroBase(dados)
    setScreen("cadastroCliente")
  }

  function voltarParaCadastro() {
    setScreen("cadastro")
  }

  if (screen === "bloqueado") {
    return <TelaBloqueio onVoltar={() => setScreen("login")} />
  }

  if (screen === "painelCliente") {
    return (
      <PainelClienteMobile
        nomeCompleto={cadastroBase.nome || "Cliente"}
        onSair={() => {
          setScreen("login")
        }}
      />
    )
  }

  if (screen === "cadastroMotorista") {
    return (
      <CadastroMotoristaWeb
        dadosBase={cadastroBase}
        onVoltar={voltarParaCadastro}
        onCancelar={() => setScreen("login")}
        onCadastroFinalizado={finalizarCadastroVisual}
      />
    )
  }

  if (screen === "cadastroCliente") {
    return (
      <CadastroClienteCompleto
        dadosBase={cadastroBase}
        onVoltar={voltarParaCadastro}
        onCancelar={() => setScreen("login")}
        onCadastroFinalizado={finalizarCadastroVisual}
      />
    )
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-black text-white">
      {mostrarEscolhaTipo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-[430px] rounded-xl border border-white/20 bg-[#080b0f] p-7 shadow-[0_0_60px_rgba(255,196,0,0.25)]">
            <h2 className="text-center text-2xl font-bold">Como você quer entrar?</h2>

            <p className="mt-3 text-center text-gray-300">
              Escolha se deseja acessar como cliente ou motorista.
            </p>

            <button
              type="button"
              onClick={() => salvarTipoGoogle("cliente")}
              disabled={salvandoTipo}
              className="mt-6 h-14 w-full rounded-xl bg-[#ffc400] font-bold text-black shadow-[0_0_30px_rgba(255,196,0,0.6)]"
            >
              Cliente
            </button>

            <button
              type="button"
              onClick={() => salvarTipoGoogle("motorista")}
              disabled={salvandoTipo}
              className="mt-4 h-14 w-full rounded-xl border border-[#ffc400] bg-black/60 font-bold text-[#ffc400]"
            >
              Motorista
            </button>
          </div>
        </div>
      )}

      {/* MOBILE LOGIN / CADASTRO */}
      <section className="relative block min-h-screen overflow-y-auto px-6 py-8 md:hidden">
        <img
          src={imagens.fundoLogin}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[430px] flex-col justify-center">
          <img
            src={imagens.logo}
            alt="Flat Auto"
            className="mx-auto h-[95px] w-[300px] object-contain drop-shadow-[0_0_35px_rgba(255,196,0,0.8)]"
          />

          <div className="mt-6 text-center">
            <h1 className="text-[32px] font-bold leading-tight">
              Fretes rápidos, com{" "}
              <span className="text-[#ffc400]">segurança</span> e{" "}
              <span className="text-[#ffc400]">confiança.</span>
            </h1>

            <p className="mt-4 text-[17px] leading-relaxed text-white/70">
              A plataforma inteligente de fretes que conecta você ao motorista mais próximo.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-white/20 bg-[#080b0f]/85 p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md">
            {screen === "login" ? (
              <>
                <h2 className="text-center text-[28px] font-bold">Entrar</h2>
                <p className="mt-2 text-center text-[16px] text-gray-300">
                  Acesse sua conta para continuar
                </p>

                <LoginForm
                  onGoogle={loginComGoogle}
                  onCadastro={() => setScreen("cadastro")}
                  onLoginSuccess={entrarNoPainelMobile}
                  setScreen={setScreen}
                />
              </>
            ) : (
              <>
                <h2 className="text-center text-[28px] font-bold">Criar conta</h2>
                <p className="mt-2 text-center text-[16px] text-gray-300">
                  Escolha cliente ou motorista
                </p>

                <CadastroForm
                  onVoltar={() => setScreen("login")}
                  onAbrirMotorista={abrirCadastroMotorista}
                  onAbrirCliente={abrirCadastroCliente}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* WEB LOGIN / CADASTRO */}
      <section className="relative hidden min-h-screen w-full overflow-hidden md:block">
        <img
          src={imagens.fundoLogin}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/90" />

        <div className="relative z-10 grid min-h-screen grid-cols-[1.02fr_0.98fr]">
          <section className="relative flex flex-col px-[5vw] pt-[5vh] pb-[120px]">
            <img
              src={imagens.logo}
              alt="Flat Auto"
              className="h-[150px] w-[520px] object-contain object-left drop-shadow-[0_0_45px_rgba(255,196,0,0.9)]"
            />

            <div className="mt-[5vh]">
              <h1 className="max-w-[590px] text-[46px] font-bold leading-[1.12]">
                Fretes rápidos, <br />
                com <span className="text-[#ffc400]">segurança</span> <br />
                e <span className="text-[#ffc400]">confiança.</span>
              </h1>

              <p className="mt-6 max-w-[560px] text-[20px] leading-relaxed text-gray-200">
                A plataforma inteligente de fretes que conecta você ao motorista mais próximo.
              </p>

              <div className="mt-10 grid max-w-[560px] grid-cols-3 gap-8">
                <InfoIconCard
                  icon={imagens.rapido}
                  title="Rápido"
                  text="Solicite fretes com agilidade."
                />

                <InfoIconCard
                  icon={imagens.seguranca}
                  title="Seguro"
                  text="Motoristas e dados protegidos."
                />

                <InfoIconCard
                  icon={imagens.confiavel}
                  title="Confiável"
                  text="Mais controle em cada viagem."
                />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-[5vw] pb-[70px]">
            <div className="w-full max-w-[560px] rounded-xl border border-white/25 bg-[#080b0f]/80 p-10 shadow-[0_0_70px_rgba(0,0,0,0.95)] backdrop-blur-md">
              {screen === "login" ? (
                <>
                  <h2 className="text-center text-[34px] font-bold">Entrar na sua conta</h2>
                  <p className="mt-3 text-center text-[18px] text-gray-300">
                    Acesse sua conta para continuar
                  </p>

                  <LoginForm
                    onGoogle={loginComGoogle}
                    onCadastro={() => setScreen("cadastro")}
                    onLoginSuccess={entrarNoPainelMobile}
                    setScreen={setScreen}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-center text-[34px] font-bold">Criar sua conta</h2>
                  <p className="mt-3 text-center text-[18px] text-gray-300">
                    Preencha os dados para se cadastrar
                  </p>

                  <CadastroForm
                    onVoltar={() => setScreen("login")}
                    onAbrirMotorista={abrirCadastroMotorista}
                    onAbrirCliente={abrirCadastroCliente}
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function LoginForm({
  onGoogle,
  onCadastro,
  onLoginSuccess,
  setScreen,
}: {
  onGoogle: () => void
  onCadastro: () => void
  onLoginSuccess: () => void
  setScreen: (screen: "bloqueado") => void
}) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [loading, setLoading] = useState(false)

  function entrarComEmail() {
    if (loading) return

    const emailLimpo = email.trim().toLowerCase()
    const senhaLimpa = senha.trim()

    setMensagem("")

   // LOGIN EMPRESA TESTE
if (
  emailLimpo === "luanacat249@gmail.com" &&
  senhaLimpa === "12345678"
) {
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

    // CAMPOS VAZIOSg
    if (!emailLimpo || !senhaLimpa) {
      setMensagem("Digite e-mail e senha para testar.")
      return
    }

    // CLIENTE NO COMPUTADOR = BLOQUEADO
    if (!isMobile()) {
      setScreen("bloqueado")
      return
    }

    // CLIENTE NO CELULAR = ENTRA NORMAL
    setLoading(true)

    setTimeout(() => {
      setMensagem("Login liberado sem banco por enquanto.")
      setLoading(false)
      onLoginSuccess()
    }, 400)
  }

  const inputClass =
    "h-16 w-full rounded-lg border border-white/20 bg-[#070a0d]/85 px-5 text-lg text-white outline-none placeholder:text-gray-400"

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        entrarComEmail()
      }}
      className="w-full"
    >
      <button
        type="button"
        onClick={onGoogle}
        className="mt-9 flex h-16 w-full items-center justify-center gap-4 rounded-lg bg-white text-lg font-bold text-black"
      >
        <img src={imagens.google} className="h-7 w-7 object-contain" alt="" />
        Entrar com Google
      </button>

      <div className="my-8 flex items-center gap-5">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-base text-gray-400">ou</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        placeholder="Digite seu e-mail"
      />

      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        type="password"
        className={`mt-4 ${inputClass}`}
        placeholder="Digite sua senha"
      />

      {mensagem && (
        <p className="mt-4 text-center text-sm font-bold text-[#ffc400]">{mensagem}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 h-16 w-full touch-manipulation rounded-lg bg-[#ffc400] text-xl font-bold text-black shadow-[0_0_30px_rgba(255,196,0,0.65)]"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="mt-7 text-center text-base text-gray-300">
        Ainda não tem uma conta?{" "}
        <button type="button" onClick={onCadastro} className="font-bold text-[#ffc400]">
          Cadastre-se
        </button>
      </p>
    </form>
  )
}

function CadastroForm({
  onVoltar,
  onAbrirMotorista,
  onAbrirCliente,
}: {
  onVoltar: () => void
  onAbrirMotorista: (dados: CadastroBase) => void
  onAbrirCliente: (dados: CadastroBase) => void
}) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipo, setTipo] = useState<TipoConta>("cliente")
  const [empresa, setEmpresa] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState("")

  async function cadastrar() {
    if (loading) return

    setMensagem("")

    if (!nome || !email || !senha) {
      setMensagem("Preencha nome, e-mail e senha.")
      return
    }

    if (tipo === "motorista") {
      onAbrirMotorista({
        nome,
        email,
        senha,
        tipo,
      })
      return
    }

    onAbrirCliente({
      nome,
      email,
      senha,
      tipo: "cliente",
      empresa,
    })
  }

  const inputClass =
    "h-16 w-full rounded-lg border border-white/20 bg-[#070a0d]/85 px-5 text-lg text-white outline-none placeholder:text-gray-400"

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        cadastrar()
      }}
      className="w-full"
    >
      <div className="mt-9 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTipo("cliente")}
          className={`h-16 rounded-xl border text-lg font-bold transition ${
            tipo === "cliente"
              ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
              : "border-white/20 bg-black/40 text-white"
          }`}
        >
          Cliente
        </button>

        <button
          type="button"
          onClick={() => {
            setTipo("motorista")
            setEmpresa(false)
          }}
          className={`h-16 rounded-xl border text-lg font-bold transition ${
            tipo === "motorista"
              ? "border-[#ffc400] bg-[#ffc400] text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
              : "border-white/20 bg-black/40 text-white"
          }`}
        >
          Motorista
        </button>
      </div>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className={`mt-5 ${inputClass}`}
        placeholder="Nome completo"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`mt-4 ${inputClass}`}
        placeholder="Digite seu e-mail"
      />

      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        type="password"
        className={`mt-4 ${inputClass}`}
        placeholder="Crie uma senha"
      />

      {tipo === "cliente" && (
        <button
          type="button"
          onClick={() => setEmpresa(!empresa)}
          className={`mt-4 flex h-14 w-full items-center justify-between rounded-xl border px-5 text-left font-bold ${
            empresa
              ? "border-[#ffc400] bg-[#ffc400]/10 text-[#ffc400]"
              : "border-white/20 bg-black/40 text-white/70"
          }`}
        >
          <span>Tenho empresa</span>
          <span>{empresa ? "Sim" : "Não"}</span>
        </button>
      )}

      {mensagem && (
        <p className="mt-4 text-center text-sm font-bold text-[#ffc400]">{mensagem}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 h-14 w-full touch-manipulation rounded-xl bg-[#ffc400] text-[17px] font-bold text-black shadow-[0_0_30px_rgba(255,196,0,0.6)]"
      >
        {loading
          ? "Cadastrando..."
          : tipo === "motorista"
            ? "Criar cadastro de motorista"
            : "Criar conta de cliente"}
      </button>

      <button
        type="button"
        onClick={onVoltar}
        className="mt-4 h-14 w-full rounded-xl border border-[#ffc400] bg-black/60 text-[17px] font-bold text-[#ffc400]"
      >
        Voltar para login
      </button>
    </form>
  )
}

function CadastroClienteCompleto({
  dadosBase,
  onVoltar,
  onCancelar,
  onCadastroFinalizado,
}: {
  dadosBase: CadastroBase
  onVoltar: () => void
  onCancelar: () => void
  onCadastroFinalizado: () => void
}) {
  const ehEmpresa = Boolean(dadosBase.empresa)

  const [nome, setNome] = useState(dadosBase.nome)
  const [nomeEmpresa, setNomeEmpresa] = useState("")
  const [endereco, setEndereco] = useState("")
  const [documento, setDocumento] = useState("")
  const [nomeResponsavel, setNomeResponsavel] = useState(dadosBase.nome)
  const [telefone, setTelefone] = useState("")
  const [tipoFrete, setTipoFrete] = useState("")
  const [tipoCarga, setTipoCarga] = useState("")
  const [origemFrete, setOrigemFrete] = useState("")
  const [destinoEntrega, setDestinoEntrega] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [documentoCliente, setDocumentoCliente] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState("")

  const opcoesTipoCarga = [
    ["mercadorias", "Mercadorias"],
    ["alimentos", "Alimentos"],
    ["equipamentos", "Equipamentos"],
    ["mudancas-moveis", "Mudanças e móveis"],
    ["eletrodomesticos", "Eletrodomésticos"],
    ["itens-frageis", "Itens frágeis"],
    ["outros", "Outros"],
  ]

  const opcoesTipoFrete = [
    ["moto", "Moto"],
    ["carro", "Carro"],
    ["van", "Van"],
    ["caminhao", "Caminhão"],
  ]

  async function finalizarCadastroCliente() {
    setMensagem("")

    if (ehEmpresa) {
      if (
        !nomeEmpresa ||
        !endereco ||
        !documento ||
        !nomeResponsavel ||
        !telefone ||
        !tipoFrete ||
        !tipoCarga ||
        !destinoEntrega
      ) {
        setMensagem("Preencha os dados principais da empresa.")
        return
      }
    } else {
      if (!nome || !endereco || !documento || !telefone || !tipoFrete || !tipoCarga || !destinoEntrega) {
        setMensagem("Preencha os dados principais do cliente.")
        return
      }
    }

    setLoading(true)

    setTimeout(() => {
      setMensagem("Cadastro criado com sucesso! Banco entra depois.")
      setLoading(false)
      setTimeout(() => {
        onCadastroFinalizado()
      }, 600)
    }, 500)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src={imagens.fundoMotorista}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-100"
      />

      <div className="absolute inset-0 z-0 bg-black/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/70 to-black md:bg-gradient-to-r md:from-black/45 md:via-black/30 md:to-black/80" />

      {/* CLIENTE MOBILE */}
      <section className="relative z-10 block min-h-screen overflow-y-auto px-6 py-8 md:hidden">
        <div className="mx-auto flex max-w-[430px] flex-col">
          <img
            src={imagens.logo}
            alt="Flat Auto"
            className="mx-auto h-[74px] w-[260px] object-contain drop-shadow-[0_0_35px_rgba(255,196,0,0.75)]"
          />

          <div className="mt-7 text-center">
            <h1 className="text-[30px] font-bold leading-tight">
              {ehEmpresa ? "Cadastro de Empresa" : "Cadastro de Cliente"}
            </h1>

            <p className="mt-2 text-[17px] leading-relaxed text-white/65">
              Preencha seus dados para solicitar fretes com agilidade
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="relative rounded-xl border-2 border-[#ffc400] bg-[#ffc400]/10 p-5 text-left shadow-[0_0_28px_rgba(255,196,0,0.35)] backdrop-blur-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc400]/40 bg-[#ffc400]/15">
                <img src={imagens.nomePerfil} alt="" className="h-8 w-8 object-contain" />
              </div>

              <p className="mt-4 text-xl font-bold text-white">
                {ehEmpresa ? "Empresa" : "Cliente"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Contrate fretes com segurança
              </p>

              <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ffc400] text-lg font-black text-black">
                ✓
              </span>
            </button>

            <button
              type="button"
              className="relative rounded-xl border border-white/15 bg-[#10151b]/70 p-5 text-left backdrop-blur-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <img src={imagens.solicitaFreteIcon} alt="" className="h-7 w-7 object-contain opacity-70" />
              </div>

              <p className="mt-4 text-xl font-bold text-white">Motorista</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Ofereça fretes e faça mais viagens
              </p>

              <span className="absolute right-4 top-4 h-7 w-7 rounded-full border border-white/20" />
            </button>
          </div>

          <div className="my-7 h-px w-full bg-white/10" />

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc400]/45 bg-[#ffc400]/10">
              <img
                src={ehEmpresa ? imagens.empresaCliente : imagens.documento}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </div>

            <div>
              <h2 className="text-[22px] font-bold leading-tight">
                {ehEmpresa ? "Complete o cadastro da empresa" : "Complete seu perfil de cliente"}
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Informe seus dados para continuar
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {ehEmpresa ? (
              <>
                <MobileDriverInput
                  icon={imagens.empresaCliente}
                  placeholder="Nome Empresa"
                  value={nomeEmpresa}
                  onChange={setNomeEmpresa}
                />

                <MobileDriverInput
                  icon={imagens.regiao}
                  placeholder="Endereço completo"
                  value={endereco}
                  onChange={setEndereco}
                />

                <MobileDriverInput
                  icon={imagens.documento}
                  placeholder="Documento (CPF ou Cartão CNPJ)"
                  value={documento}
                  onChange={setDocumento}
                />

                <MobileDriverInput
                  icon={imagens.nomePerfil}
                  placeholder="Nome Responsável"
                  value={nomeResponsavel}
                  onChange={setNomeResponsavel}
                />

                <MobileDriverInput
                  icon={imagens.telefoneWhatsapp}
                  placeholder="Telefone / WhatsApp"
                  value={telefone}
                  onChange={setTelefone}
                />

                <MobileClienteSelect
                  icon={imagens.modeloCaminhao}
                  value={tipoFrete}
                  onChange={setTipoFrete}
                  placeholder="Tipo de frete"
                  options={opcoesTipoFrete}
                />

                <MobileClienteSelect
                  icon={imagens.tipoCarga}
                  value={tipoCarga}
                  onChange={setTipoCarga}
                  placeholder="Tipo de carga"
                  options={opcoesTipoCarga}
                />

                <MobileDriverInput
                  icon={imagens.destinoEntrega}
                  placeholder="Destino da entrega"
                  value={destinoEntrega}
                  onChange={setDestinoEntrega}
                />

                <MobileDriverInput
                  icon={imagens.documento}
                  placeholder="Observações da carga/operação"
                  value={observacoes}
                  onChange={setObservacoes}
                />
              </>
            ) : (
              <>
                <MobileDriverInput
                  icon={imagens.nomePerfil}
                  placeholder="Nome completo"
                  value={nome}
                  onChange={setNome}
                />

                <MobileDriverInput
                  icon={imagens.regiao}
                  placeholder="Endereço completo"
                  value={endereco}
                  onChange={setEndereco}
                />

                <MobileDriverInput
                  icon={imagens.documento}
                  placeholder="Documento (CPF ou CNPJ)"
                  value={documento}
                  onChange={setDocumento}
                />

                <MobileDriverInput
                  icon={imagens.telefoneWhatsapp}
                  placeholder="Telefone / WhatsApp"
                  value={telefone}
                  onChange={setTelefone}
                />

                <MobileClienteSelect
                  icon={imagens.modeloCaminhao}
                  value={tipoFrete}
                  onChange={setTipoFrete}
                  placeholder="Tipo de frete"
                  options={opcoesTipoFrete}
                />

                <MobileClienteSelect
                  icon={imagens.tipoCarga}
                  value={tipoCarga}
                  onChange={setTipoCarga}
                  placeholder="Tipo de carga"
                  options={opcoesTipoCarga}
                />

                <MobileDriverInput
                  icon={imagens.destinoEntrega}
                  placeholder="Destino da entrega"
                  value={destinoEntrega}
                  onChange={setDestinoEntrega}
                />

                <MobileDriverInput
                  icon={imagens.documento}
                  placeholder="Observações da carga/operação"
                  value={observacoes}
                  onChange={setObservacoes}
                />
              </>
            )}
          </div>

          <div className="mt-6">
            <MobileUploadCard
              icon={imagens.documento}
              title="Documento"
              text="Envie seu documento para validar seu cadastro"
              file={documentoCliente}
              onChange={setDocumentoCliente}
            />
          </div>

          {mensagem && (
            <p className="mt-5 text-center text-sm font-bold text-[#ffc400]">
              {mensagem}
            </p>
          )}

          <button
            type="button"
            onClick={finalizarCadastroCliente}
            disabled={loading}
            className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#ffc400] text-[19px] font-black text-black shadow-[0_0_35px_rgba(255,196,0,0.55)]"
          >
            <span className="text-2xl">💾</span>
            {loading ? "Salvando..." : "Salvar cadastro"}
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="mt-6 h-12 w-full text-center text-[17px] font-bold text-[#ffc400]"
          >
            Voltar para login
          </button>
        </div>
      </section>

      {/* CLIENTE WEB */}
      <header className="relative z-10 hidden h-[86px] items-center justify-between border-b border-white/10 px-8 md:flex">
        <button
          type="button"
          onClick={onVoltar}
          className="flex items-center gap-3 text-lg font-bold text-white"
        >
          <span className="text-3xl text-[#ffc400]">←</span>
          Voltar para o login
        </button>

        <div className="flex items-center gap-8 text-white/85">
          <button type="button" className="flex items-center gap-2 text-base font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50">
              ?
            </span>
            Precisa de ajuda?
          </button>

          <button type="button" className="text-3xl leading-none text-white/80">
            ⋮
          </button>
        </div>
      </header>

      <section className="relative z-10 hidden min-h-[calc(100vh-86px)] grid-cols-[0.72fr_1.28fr] md:grid">
        <aside className="relative flex flex-col justify-center px-[4vw]">
          <img
            src={imagens.logo}
            alt="Flat Auto"
            className="mb-[8vh] h-[175px] w-[560px] object-contain object-left drop-shadow-[0_0_45px_rgba(255,196,0,0.95)]"
          />

          <h1 className="max-w-[470px] text-[48px] font-bold leading-[1.14]">
            Fretes rápidos, <br />
            com <span className="text-[#ffc400]">segurança</span> <br />
            e <span className="text-[#ffc400]">confiança.</span>
          </h1>

          <p className="mt-7 max-w-[430px] text-[22px] leading-relaxed text-white/90">
            A plataforma inteligente de fretes que conecta você ao motorista mais próximo.
          </p>

          <div className="mt-10 flex w-[340px] items-center gap-4 rounded-xl border border-white/15 bg-[#080b0f]/75 p-5 shadow-[0_0_35px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src={imagens.seguranca}
                alt=""
                className="h-12 w-12 object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.6)]"
              />
            </div>

            <div>
              <p className="text-xl font-bold text-white">Seus dados protegidos</p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                Segurança e privacidade em primeiro lugar.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center px-[4vw] py-9">
          <div className="w-full max-w-[960px] rounded-xl border border-white/20 bg-[#080b0f]/82 p-8 shadow-[0_0_70px_rgba(0,0,0,0.88)] backdrop-blur-md">
            <div className="mb-7 flex items-center gap-5">
              <IconBox icon={ehEmpresa ? imagens.empresaCliente : imagens.nomePerfil} active />

              <div>
                <h2 className="text-[32px] font-bold leading-none">
                  {ehEmpresa ? "Cadastro de Empresa" : "Cadastro de Cliente"}
                </h2>
                <p className="mt-2 text-lg text-white/75">
                  Preencha seus dados para criar sua conta
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {ehEmpresa ? (
                <>
                  <DriverField
                    icon={imagens.empresaCliente}
                    label="Nome Empresa"
                    placeholder="Digite o nome da empresa"
                    value={nomeEmpresa}
                    onChange={setNomeEmpresa}
                    dots
                  />

                  <DriverField
                    icon={imagens.regiao}
                    label="Endereço completo"
                    placeholder="Digite o endereço completo"
                    value={endereco}
                    onChange={setEndereco}
                    dots
                  />

                  <DriverField
                    icon={imagens.documento}
                    label="Documento (CPF ou Cartão CNPJ)"
                    placeholder="Digite CPF ou CNPJ"
                    value={documento}
                    onChange={setDocumento}
                    dots
                  />

                  <DriverField
                    icon={imagens.nomePerfil}
                    label="Nome Responsável"
                    placeholder="Digite o nome do responsável"
                    value={nomeResponsavel}
                    onChange={setNomeResponsavel}
                    dots
                  />

                  <DriverField
                    icon={imagens.telefoneWhatsapp}
                    label="Telefone / WhatsApp"
                    placeholder="Digite seu telefone"
                    value={telefone}
                    onChange={setTelefone}
                    dots
                  />

                  <ClienteSelect
                    icon={imagens.modeloCaminhao}
                    label="Tipo de frete"
                    value={tipoFrete}
                    onChange={setTipoFrete}
                    placeholder="Selecione o tipo de frete"
                    dots
                    options={opcoesTipoFrete}
                  />

                  <ClienteSelect
                    icon={imagens.tipoCarga}
                    label="Tipo de carga"
                    value={tipoCarga}
                    onChange={setTipoCarga}
                    placeholder="Selecione o tipo de carga"
                    dots
                    options={opcoesTipoCarga}
                  />

                  <DriverField
                    icon={imagens.destinoEntrega}
                    label="Destino da entrega"
                    placeholder="Digite o destino da entrega"
                    value={destinoEntrega}
                    onChange={setDestinoEntrega}
                    dots
                  />

                  <DriverField
                    icon={imagens.documento}
                    label="Observações"
                    placeholder="Descreva as particularidades da carga/operação"
                    value={observacoes}
                    onChange={setObservacoes}
                    dots
                  />
                </>
              ) : (
                <>
                  <DriverField
                    icon={imagens.nomePerfil}
                    label="Nome completo"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={setNome}
                    dots
                  />

                  <DriverField
                    icon={imagens.regiao}
                    label="Endereço completo"
                    placeholder="Digite seu endereço completo"
                    value={endereco}
                    onChange={setEndereco}
                    dots
                  />

                  <DriverField
                    icon={imagens.documento}
                    label="Documento (CPF ou CNPJ)"
                    placeholder="Digite CPF ou CNPJ"
                    value={documento}
                    onChange={setDocumento}
                    dots
                  />

                  <DriverField
                    icon={imagens.telefoneWhatsapp}
                    label="Telefone / WhatsApp"
                    placeholder="Digite seu telefone"
                    value={telefone}
                    onChange={setTelefone}
                    dots
                  />

                  <ClienteSelect
                    icon={imagens.modeloCaminhao}
                    label="Tipo de frete"
                    value={tipoFrete}
                    onChange={setTipoFrete}
                    placeholder="Selecione o tipo de frete"
                    dots
                    options={opcoesTipoFrete}
                  />

                  <ClienteSelect
                    icon={imagens.tipoCarga}
                    label="Tipo de carga"
                    value={tipoCarga}
                    onChange={setTipoCarga}
                    placeholder="Selecione o tipo de carga"
                    dots
                    options={opcoesTipoCarga}
                  />

                  <DriverField
                    icon={imagens.destinoEntrega}
                    label="Destino da entrega"
                    placeholder="Digite o destino da entrega"
                    value={destinoEntrega}
                    onChange={setDestinoEntrega}
                    dots
                  />

                  <DriverField
                    icon={imagens.documento}
                    label="Observações"
                    placeholder="Descreva as particularidades da carga/operação"
                    value={observacoes}
                    onChange={setObservacoes}
                    dots
                  />
                </>
              )}

              <DriverUpload
                icon={imagens.documento}
                label="Documento"
                placeholder="Envie seu documento"
                file={documentoCliente}
                onChange={setDocumentoCliente}
                dots
              />
            </div>

            {mensagem && (
              <p className="mt-5 text-center text-sm font-bold text-[#ffc400]">
                {mensagem}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-white/65">
                <span className="text-xl">🔒</span>
                <p>Suas informações estão seguras conosco.</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onCancelar}
                  className="h-12 rounded-lg border border-white/30 px-9 text-lg font-bold text-white"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={finalizarCadastroCliente}
                  disabled={loading}
                  className="h-12 rounded-lg bg-[#ffc400] px-12 text-lg font-bold text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

/* CADASTRO MOTORISTA APROVADO — NÃO ALTERAR */
function CadastroMotoristaWeb({
  dadosBase,
  onVoltar,
  onCancelar,
  onCadastroFinalizado,
}: {
  dadosBase: CadastroBase
  onVoltar: () => void
  onCancelar: () => void
  onCadastroFinalizado: () => void
}) {
  const [nome, setNome] = useState(dadosBase.nome)
  const [modeloCaminhao, setModeloCaminhao] = useState("")
  const [placaCaminhao, setPlacaCaminhao] = useState("")
  const [tipoCaminhao, setTipoCaminhao] = useState("")
  const [capacidadeCarga, setCapacidadeCarga] = useState("")
  const [regiaoAtuacao, setRegiaoAtuacao] = useState("")

  const [fotoMotorista, setFotoMotorista] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState("")
  const [documentoCaminhao, setDocumentoCaminhao] = useState<File | null>(null)
  const [cnhMotorista, setCnhMotorista] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState("")

  function escolherFotoMotorista(file: File | null) {
    setFotoMotorista(file)

    if (file) {
      setFotoPreview(URL.createObjectURL(file))
    } else {
      setFotoPreview("")
    }
  }

  async function finalizarCadastroMotorista() {
    setMensagem("")

    if (
      !nome ||
      !modeloCaminhao ||
      !placaCaminhao ||
      !tipoCaminhao ||
      !capacidadeCarga ||
      !regiaoAtuacao
    ) {
      setMensagem("Preencha todos os dados do motorista.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      setMensagem("Cadastro de motorista criado com sucesso! Banco entra depois.")
      setLoading(false)
      setTimeout(() => {
        onCadastroFinalizado()
      }, 600)
    }, 500)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src={imagens.fundoMotorista}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-100"
      />

      <div className="absolute inset-0 z-0 bg-black/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/70 to-black md:bg-gradient-to-r md:from-black/45 md:via-black/30 md:to-black/80" />

      {/* MOBILE */}
      <section className="relative z-10 block min-h-screen overflow-y-auto px-6 py-8 md:hidden">
        <div className="mx-auto flex max-w-[430px] flex-col">
          <img
            src={imagens.logo}
            alt="Flat Auto"
            className="mx-auto h-[74px] w-[260px] object-contain drop-shadow-[0_0_35px_rgba(255,196,0,0.75)]"
          />

          <div className="mt-7 text-center">
            <h1 className="text-[30px] font-bold leading-tight">
              Vamos completar seu cadastro
            </h1>

            <p className="mt-2 text-[17px] leading-relaxed text-white/65">
              Escolha o tipo de conta e preencha seus dados
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="relative rounded-xl border border-white/15 bg-[#10151b]/70 p-5 text-left backdrop-blur-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <img src={imagens.nomePerfil} alt="" className="h-7 w-7 object-contain opacity-70" />
              </div>

              <p className="mt-4 text-xl font-bold text-white">Cliente</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Contrate fretes com segurança
              </p>

              <span className="absolute right-4 top-4 h-7 w-7 rounded-full border border-white/20" />
            </button>

            <button
              type="button"
              className="relative rounded-xl border-2 border-[#ffc400] bg-[#ffc400]/10 p-5 text-left shadow-[0_0_28px_rgba(255,196,0,0.35)] backdrop-blur-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc400]/40 bg-[#ffc400]/15">
                <img
                  src={imagens.modeloCaminhao}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              </div>

              <p className="mt-4 text-xl font-bold text-white">Motorista</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Ofereça fretes e faça mais viagens
              </p>

              <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ffc400] text-lg font-black text-black">
                ✓
              </span>
            </button>
          </div>

          <div className="my-7 h-px w-full bg-white/10" />

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc400]/45 bg-[#ffc400]/10">
              <img src={imagens.documento} alt="" className="h-7 w-7 object-contain" />
            </div>

            <div>
              <h2 className="text-[22px] font-bold leading-tight">
                Complete seu perfil de motorista
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Informe os dados do seu caminhão e documentos
              </p>
            </div>
          </div>

          <label className="mt-5 flex min-h-[74px] cursor-pointer items-center gap-4 rounded-xl border border-[#ffc400]/25 bg-[#ffc400]/10 px-4 backdrop-blur-md">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ffc400]/35 bg-black/25">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto do motorista" className="h-full w-full object-cover" />
              ) : (
                <img
                  src={imagens.fotoPerfilCadastro}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="text-[17px] font-bold text-white">Foto do motorista</p>
              <p className="mt-1 text-sm text-white/55">
                {fotoMotorista ? fotoMotorista.name : "Toque para enviar uma foto"}
              </p>
            </div>

            <span className="text-2xl text-[#ffc400]">+</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) => escolherFotoMotorista(event.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          <div className="mt-6 space-y-3">
            <MobileDriverInput
              icon={imagens.nomePerfil}
              placeholder="Nome completo"
              value={nome}
              onChange={setNome}
            />

            <MobileDriverInput
              icon={imagens.modeloCaminhao}
              placeholder="Modelo do caminhão"
              value={modeloCaminhao}
              onChange={setModeloCaminhao}
            />

            <MobileDriverInput
              icon={imagens.placa}
              placeholder="Placa do caminhão"
              value={placaCaminhao}
              onChange={(valor) => setPlacaCaminhao(valor.toUpperCase())}
            />

            <MobileDriverSelect
              icon={imagens.modeloCaminhao}
              value={tipoCaminhao}
              onChange={setTipoCaminhao}
            />

            <MobileDriverInput
              icon={imagens.capacidade}
              placeholder="Capacidade de carga"
              value={capacidadeCarga}
              onChange={setCapacidadeCarga}
            />

            <MobileRegionSelect
              icon={imagens.regiao}
              value={regiaoAtuacao}
              onChange={setRegiaoAtuacao}
            />
          </div>

          <div className="mt-6 space-y-4">
            <MobileUploadCard
              icon={imagens.documento}
              title="Documento do caminhão"
              text="Envie o CRLV ou documento do veículo"
              file={documentoCaminhao}
              onChange={setDocumentoCaminhao}
            />

            <MobileUploadCard
              icon={imagens.cnh}
              title="CNH / Carteira de motorista"
              text="Envie sua CNH válida"
              file={cnhMotorista}
              onChange={setCnhMotorista}
            />
          </div>

          {mensagem && (
            <p className="mt-5 text-center text-sm font-bold text-[#ffc400]">
              {mensagem}
            </p>
          )}

          <button
            type="button"
            onClick={finalizarCadastroMotorista}
            disabled={loading}
            className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#ffc400] text-[19px] font-black text-black shadow-[0_0_35px_rgba(255,196,0,0.55)]"
          >
            <span className="text-2xl">💾</span>
            {loading ? "Salvando..." : "Salvar cadastro de motorista"}
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="mt-6 h-12 w-full text-center text-[17px] font-bold text-[#ffc400]"
          >
            Voltar para login
          </button>
        </div>
      </section>

      {/* WEB */}
      <header className="relative z-10 hidden h-[86px] items-center justify-between border-b border-white/10 px-8 md:flex">
        <button
          type="button"
          onClick={onVoltar}
          className="flex items-center gap-3 text-lg font-bold text-white"
        >
          <span className="text-3xl text-[#ffc400]">←</span>
          Voltar para o login
        </button>

        <div className="flex items-center gap-8 text-white/85">
          <button type="button" className="flex items-center gap-2 text-base font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50">
              ?
            </span>
            Precisa de ajuda?
          </button>

          <button type="button" className="text-3xl leading-none text-white/80">
            ⋮
          </button>
        </div>
      </header>

      <section className="relative z-10 hidden min-h-[calc(100vh-86px)] grid-cols-[0.72fr_1.28fr] md:grid">
        <aside className="relative flex flex-col justify-center px-[4vw]">
          <img
            src={imagens.logo}
            alt="Flat Auto"
            className="mb-[8vh] h-[175px] w-[560px] object-contain object-left drop-shadow-[0_0_45px_rgba(255,196,0,0.95)]"
          />

          <h1 className="max-w-[470px] text-[48px] font-bold leading-[1.14]">
            Fretes rápidos, <br />
            com <span className="text-[#ffc400]">segurança</span> <br />
            e <span className="text-[#ffc400]">confiança.</span>
          </h1>

          <p className="mt-7 max-w-[430px] text-[22px] leading-relaxed text-white/90">
            A plataforma inteligente de fretes que conecta você ao motorista mais próximo.
          </p>

          <div className="mt-10 flex w-[340px] items-center gap-4 rounded-xl border border-white/15 bg-[#080b0f]/75 p-5 shadow-[0_0_35px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#ffc400]/40 bg-[#ffc400]/10">
              <img
                src={imagens.seguranca}
                alt=""
                className="h-12 w-12 object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.6)]"
              />
            </div>

            <div>
              <p className="text-xl font-bold text-white">Seus dados protegidos</p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                Segurança e privacidade em primeiro lugar.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center px-[4vw] py-9">
          <div className="w-full max-w-[960px] rounded-xl border border-white/20 bg-[#080b0f]/82 p-8 shadow-[0_0_70px_rgba(0,0,0,0.88)] backdrop-blur-md">
            <div className="mb-7 flex items-center gap-5">
              <ProfilePhotoBox preview={fotoPreview} onChange={escolherFotoMotorista} />

              <div>
                <h2 className="text-[32px] font-bold leading-none">Cadastro de Motorista</h2>
                <p className="mt-2 text-lg text-white/75">
                  Preencha seus dados para criar sua conta
                </p>

                {fotoMotorista && (
                  <p className="mt-1 text-sm font-bold text-[#ffc400]">
                    Foto selecionada: {fotoMotorista.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <DriverField
                icon={imagens.nomePerfil}
                label="Nome completo"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={setNome}
              />

              <DriverField
                icon={imagens.modeloCaminhao}
                label="Modelo do caminhão"
                placeholder="Ex: Volvo FH 540"
                value={modeloCaminhao}
                onChange={setModeloCaminhao}
                dots
              />

              <DriverField
                icon={imagens.placa}
                label="Placa do caminhão"
                placeholder="Ex: ABC1D23"
                value={placaCaminhao}
                onChange={(valor) => setPlacaCaminhao(valor.toUpperCase())}
                dots
              />

              <DriverSelect
                icon={imagens.modeloCaminhao}
                label="Tipo de caminhão"
                value={tipoCaminhao}
                onChange={setTipoCaminhao}
                dots
              />

              <DriverField
                icon={imagens.capacidade}
                label="Capacidade de carga (toneladas)"
                placeholder="Ex: 25"
                value={capacidadeCarga}
                onChange={setCapacidadeCarga}
                dots
              />

              <DriverRegion
                icon={imagens.regiao}
                label="Região de atuação"
                value={regiaoAtuacao}
                onChange={setRegiaoAtuacao}
                dots
              />

              <DriverUpload
                icon={imagens.documento}
                label="Documentação do caminhão"
                placeholder="Envie os documentos do caminhão"
                file={documentoCaminhao}
                onChange={setDocumentoCaminhao}
                dots
              />

              <DriverUpload
                icon={imagens.cnh}
                label="CNH / Carteira de motorista"
                placeholder="Envie a foto ou PDF da sua CNH"
                file={cnhMotorista}
                onChange={setCnhMotorista}
                dots
              />
            </div>

            {mensagem && (
              <p className="mt-5 text-center text-sm font-bold text-[#ffc400]">
                {mensagem}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-white/65">
                <span className="text-xl">🔒</span>
                <p>Suas informações estão seguras conosco.</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onCancelar}
                  className="h-12 rounded-lg border border-white/30 px-9 text-lg font-bold text-white"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={finalizarCadastroMotorista}
                  disabled={loading}
                  className="h-12 rounded-lg bg-[#ffc400] px-12 text-lg font-bold text-black shadow-[0_0_25px_rgba(255,196,0,0.45)]"
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}


function PainelCliente({ onSair }: { onSair: () => void }) {
  const [nomeCompleto, setNomeCompleto] = useState("Cliente")
  const [origem, setOrigem] = useState("")
  const [destino, setDestino] = useState("")
  const [tipoCarga, setTipoCarga] = useState("")
  const [peso, setPeso] = useState("")
  const [dataHora, setDataHora] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [estimativa, setEstimativa] = useState("R$ 320,00 - R$ 450,00")
  const [tempo, setTempo] = useState("32 min")
  const [distancia, setDistancia] = useState("18,6 km")
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState(
    "Permita a localização para ver motoristas próximos."
  )
  const [localizacaoLiberada, setLocalizacaoLiberada] = useState(false)

  // Sem banco por enquanto: mantém nome padrão no painel.


  const iniciais =
    nomeCompleto
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte: string) => parte[0]?.toUpperCase())
      .join("") || "CL"

  function calcularFrete() {
    const origemTexto = origem.trim().toLowerCase()
    const destinoTexto = destino.trim().toLowerCase()

    if (
      (origemTexto.includes("recife") && destinoTexto.includes("joão pessoa")) ||
      (origemTexto.includes("recife") && destinoTexto.includes("joao pessoa")) ||
      (origemTexto.includes("joão pessoa") && destinoTexto.includes("recife")) ||
      (origemTexto.includes("joao pessoa") && destinoTexto.includes("recife"))
    ) {
      setEstimativa("R$ 320,00 - R$ 450,00")
      setTempo("2h 15min")
      setDistancia("121 km")
      return
    }

    if (origemTexto && destinoTexto) {
      setEstimativa("R$ 180,00 - R$ 260,00")
      setTempo("32 min")
      setDistancia("18,6 km")
      return
    }

    setEstimativa("R$ 320,00 - R$ 450,00")
    setTempo("32 min")
    setDistancia("18,6 km")
  }

  function pedirLocalizacao() {
    if (!navigator.geolocation) {
      setMensagemLocalizacao("Seu navegador não suporta geolocalização.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocalizacaoLiberada(true)
        setMensagemLocalizacao("Localização permitida. Exibindo motoristas ilustrativos próximos.")
      },
      () => {
        setLocalizacaoLiberada(false)
        setMensagemLocalizacao("Permissão negada. Mantendo visual ilustrativo.")
      }
    )
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="flex min-h-screen">
        <aside className="relative hidden w-[255px] overflow-hidden border-r border-white/10 bg-[#05070b] xl:flex xl:flex-col">
          <div className="pointer-events-none absolute bottom-0 left-0 h-[42%] w-full overflow-hidden">
            <img
              src={imagens.fundoLogin}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-bottom opacity-38"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05070b] via-[#05070b]/45 to-[#05070b]/96" />
          </div>

          <div className="relative z-10 flex h-full flex-col px-5 py-7">
            <img
              src={imagens.logo}
              alt="FlatAuto"
              className="h-[64px] w-[220px] object-contain object-left drop-shadow-[0_0_18px_rgba(255,196,0,0.18)]"
            />

            <nav className="mt-10 space-y-2">
              <SidebarItem icon={imagens.inicioIcon} label="Início" active />
              <SidebarItem icon={imagens.solicitaFreteIcon} label="Solicitar frete" />
              <SidebarItem icon={imagens.minhasViagensIcon} label="Minhas viagens" />
              <SidebarItem icon={imagens.motoristasIcon} label="Motoristas próximos" />
              <SidebarItem icon={imagens.pagamentoIcon} label="Pagamentos" />
              <SidebarItem icon={imagens.perfilIcon} label="Perfil" />
            </nav>

            <div className="mt-auto pt-6">
              <div className="border-t border-white/10 pt-6">
                <SidebarItem icon={imagens.ajudaIcon} label="Ajuda e suporte" small />
                <SidebarItem icon={imagens.configuracaoIcon} label="Configurações" small />
              </div>

              <div className="relative mt-6 overflow-hidden rounded-[18px] border border-[#ffc400]/18 bg-[#0a1018] p-4">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/82" />

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#ffc400]/25 bg-black/35">
                    <img src={imagens.seguranca} alt="Seguro" className="h-9 w-9 object-contain" />
                  </div>

                  <h3 className="mt-4 text-[18px] font-bold leading-tight text-white">
                    Seguro em toda a jornada
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Sua carga protegida do início ao fim.
                  </p>

                  <button className="mt-4 rounded-xl border border-[#ffc400]/70 px-4 py-2 text-sm font-semibold text-[#ffc400]">
                    Saiba mais
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onSair}
                className="mt-6 h-14 w-full rounded-[18px] border border-[#68131d] bg-[#2b0910] text-lg font-bold text-white"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1450px]">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-[34px] font-bold leading-none md:text-[46px]">
                  Olá, <span className="text-[#ffc400]">{nomeCompleto}</span>
                </h1>
                <p className="mt-3 text-base text-white/70 md:text-[18px]">
                  Solicite seu frete com rapidez e segurança.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="flex h-[58px] items-center gap-3 rounded-[16px] border border-[#ffc400]/60 bg-[#0b1017]/70 px-5 text-[16px] font-semibold text-[#ffc400]">
                  <img src={imagens.indiqueGanheIcon} alt="" className="h-5 w-5 object-contain" />
                  Indique e ganhe
                </button>

                <button className="flex h-[58px] w-[58px] items-center justify-center rounded-[14px] border border-[#162130] bg-[#090d14]/90">
                  <img src={imagens.notificacaoIcon} alt="" className="h-5 w-5 object-contain" />
                </button>

                <div className="flex items-center gap-3 rounded-[14px] border border-[#162130] bg-[#090d14]/90 px-3 py-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffc400] text-[16px] font-bold text-[#ffc400]">
                    {iniciais}
                  </div>

                  <div>
                    <p className="text-[17px] font-semibold text-white">{nomeCompleto}</p>
                    <p className="text-sm text-white/55">Cliente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.35fr]">
              <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ffc400]/12">
                    <img src={imagens.modeloCaminhao} alt="" className="h-8 w-8 object-contain" />
                  </div>

                  <h2 className="text-[22px] font-bold text-white">Solicitar frete</h2>
                </div>

                <div className="flex gap-4">
                  <div className="hidden pt-11 md:flex md:flex-col md:items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ffc400]/35 bg-[#ffc400]/10">
                      <img src={imagens.origemFrete} alt="" className="h-4 w-4 object-contain" />
                    </div>

                    <div className="my-2 h-14 w-[2px] rounded-full bg-[#ffc400]" />

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ffc400]/35 bg-[#ffc400]/10">
                      <img src={imagens.destinoEntrega} alt="" className="h-4 w-4 object-contain" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <InputLabel label="Origem">
                      <input
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                        placeholder="Digite o endereço de origem"
                        className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none placeholder:text-white/25"
                      />
                    </InputLabel>

                    <InputLabel label="Destino">
                      <input
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        placeholder="Digite o endereço de destino"
                        className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none placeholder:text-white/25"
                      />
                    </InputLabel>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputLabel label="Tipo de carga">
                        <select
                          value={tipoCarga}
                          onChange={(e) => setTipoCarga(e.target.value)}
                          className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none"
                        >
                          <option value="">Selecione o tipo de carga</option>
                          <option value="leve">Carga leve</option>
                          <option value="media">Carga média</option>
                          <option value="pesada">Carga pesada</option>
                        </select>
                      </InputLabel>

                      <InputLabel label="Peso estimado (t)">
                        <input
                          value={peso}
                          onChange={(e) => setPeso(e.target.value)}
                          placeholder="Ex.: 5,0"
                          className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none placeholder:text-white/25"
                        />
                      </InputLabel>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputLabel label="Data / Hora">
                        <input
                          type="datetime-local"
                          value={dataHora}
                          onChange={(e) => setDataHora(e.target.value)}
                          className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none"
                        />
                      </InputLabel>

                      <InputLabel label="Observações (opcional)">
                        <input
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Ex.: carga frágil, empilhadeira..."
                          className="h-14 w-full rounded-xl border border-[#1e2a3d] bg-[#101723] px-4 text-white outline-none placeholder:text-white/25"
                        />
                      </InputLabel>
                    </div>

                    <button
                      type="button"
                      onClick={calcularFrete}
                      className="mt-2 h-[58px] w-full rounded-xl bg-[#ffc400] text-[20px] font-bold text-black shadow-[0_0_30px_rgba(255,196,0,0.25)]"
                    >
                      Solicitar frete
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div className="relative min-h-[430px] overflow-hidden rounded-[16px] border border-[#1d2837] bg-[#0c121b]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,196,0,0.08),transparent_20%),radial-gradient(circle_at_78%_66%,rgba(255,196,0,0.07),transparent_18%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,auto,44px_44px,44px_44px]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a111b] via-[#0c1320] to-[#0b121c]" />

                  <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-between p-5">
                    <div className="flex flex-1 items-center justify-center rounded-[14px] border border-dashed border-[#263347] bg-black/10 text-center">
                      <div>
                        <p className="text-[20px] font-semibold text-white/70">Espaço reservado para o mapa</p>
                        <p className="mt-2 text-sm text-white/40">Aqui entraremos com o Google Maps na próxima etapa.</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 rounded-[14px] border border-[#1c2738] bg-[#0a111a]/90 p-5 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-white/45">Distância</p>
                        <p className="mt-1 text-[24px] font-bold text-[#ffc400]">{distancia}</p>
                      </div>

                      <div>
                        <p className="text-sm text-white/45">Tempo estimado</p>
                        <p className="mt-1 text-[24px] font-bold text-[#ffc400]">{tempo}</p>
                      </div>

                      <div>
                        <p className="text-sm text-white/45">Estimativa</p>
                        <p className="mt-1 text-[24px] font-bold text-[#ffc400]">{estimativa}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-white">Localização</h3>
                  <p className="mt-2 text-white/65">{mensagemLocalizacao}</p>
                </div>

                <button
                  type="button"
                  onClick={pedirLocalizacao}
                  className="rounded-[16px] border border-[#ffc400]/60 bg-[#0b1017]/70 px-5 py-3 font-semibold text-[#ffc400]"
                >
                  {localizacaoLiberada ? "Localização permitida" : "Permitir localização"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ResumoCard
                icon={imagens.estimativaIcon}
                titulo="Estimativa"
                destaque={estimativa}
                subtitulo="Valor estimado do frete"
                tag="Faixa de preço"
              />

              <ResumoCard
                icon={imagens.motoristaProximoIcon}
                titulo="Motoristas próximos"
                destaque="47"
                subtitulo="Disponíveis na sua região"
                tag="Ativos agora"
              />

              <ResumoCard
                icon={imagens.tempoMedioIcon}
                titulo="Tempo médio"
                destaque="32 min"
                subtitulo="Tempo médio até a coleta"
                tag="Para coleta"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.18fr_1fr_1fr]">
              <TabelaPedidos />
              <ListaMotoristas />

              <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <h3 className="text-[20px] font-bold text-white">Status do frete</h3>

                <div className="mt-5 flex min-h-[270px] flex-col items-center justify-center rounded-[14px] border border-[#303a49] bg-[#0c121b] p-6 text-center">
                  <img src={imagens.statusFreteIcon} alt="" className="mb-4 h-14 w-14 object-contain" />

                  <p className="text-[24px] font-semibold leading-tight text-white">
                    Você ainda não possui fretes em andamento.
                  </p>

                  <p className="mt-3 max-w-[260px] text-white/55">
                    Solicite um frete e acompanhe o status aqui.
                  </p>

                  <button className="mt-6 rounded-xl border border-[#ffc400]/70 px-6 py-3 font-semibold text-[#ffc400]">
                    Solicitar frete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function SidebarItem({
  icon,
  label,
  active = false,
  small = false,
}: {
  icon: string
  label: string
  active?: boolean
  small?: boolean
}) {
  return (
    <button
      type="button"
      className={`group flex w-full items-center gap-4 rounded-[18px] border px-4 text-left transition-all duration-200 ${
        small ? "mt-2 h-[52px]" : "h-[54px]"
      } ${
        active
          ? "border-[#ffc400]/70 bg-[#ffc400]/10 text-[#ffc400] shadow-[0_0_16px_rgba(255,196,0,0.08)]"
          : "border-transparent bg-transparent text-white/90 hover:border-[#ffc400]/35 hover:bg-[#ffc400]/8 hover:text-[#ffc400]"
      }`}
    >
      <img
        src={icon}
        alt=""
        className={`h-5 w-5 object-contain transition-all duration-200 ${
          active
            ? "[filter:brightness(0)_saturate(100%)_invert(77%)_sepia(96%)_saturate(1052%)_hue-rotate(359deg)_brightness(102%)_contrast(102%)]"
            : "opacity-90 group-hover:[filter:brightness(0)_saturate(100%)_invert(77%)_sepia(96%)_saturate(1052%)_hue-rotate(359deg)_brightness(102%)_contrast(102%)]"
        }`}
      />
      <span className={`${small ? "text-[15px]" : "text-[17px]"} font-semibold`}>
        {label}
      </span>
    </button>
  )
}

function ResumoCard({
  icon,
  titulo,
  destaque,
  subtitulo,
  tag,
}: {
  icon: string
  titulo: string
  destaque: string
  subtitulo: string
  tag?: string
}) {
  return (
    <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="flex items-start gap-4">
        <img src={icon} alt="" className="h-14 w-14 object-contain" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[18px] font-bold text-white">{titulo}</p>
            {tag ? (
              <span className="rounded-full bg-[#ffc400]/12 px-2 py-1 text-xs font-medium text-[#ffc400]">
                {tag}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-[19px] font-bold text-white sm:text-[20px]">{destaque}</p>
          <p className="mt-2 text-sm text-white/55">{subtitulo}</p>
        </div>
      </div>
    </div>
  )
}

function TabelaPedidos() {
  return (
    <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[20px] font-bold text-white">Últimos pedidos</h3>
        <button className="text-sm font-semibold text-[#ffc400]">Ver todos</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/8 text-sm text-white/45">
              <th className="pb-4 font-medium">Origem / Destino</th>
              <th className="pb-4 font-medium">Data</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Valor</th>
            </tr>
          </thead>

          <tbody className="text-[15px]">
            <tr className="border-b border-white/6">
              <td className="py-4 text-white">São Paulo - SP → Campinas - SP</td>
              <td className="py-4 text-white/65">12/05/2025 08:30</td>
              <td className="py-4">
                <span className="rounded-full bg-[#103d28] px-3 py-1 text-sm text-[#7ef0ab]">
                  Concluído
                </span>
              </td>
              <td className="py-4 text-white">R$ 380,00</td>
            </tr>

            <tr className="border-b border-white/6">
              <td className="py-4 text-white">Guarulhos - SP → Sorocaba - SP</td>
              <td className="py-4 text-white/65">08/05/2025 14:20</td>
              <td className="py-4">
                <span className="rounded-full bg-[#103d28] px-3 py-1 text-sm text-[#7ef0ab]">
                  Concluído
                </span>
              </td>
              <td className="py-4 text-white">R$ 420,00</td>
            </tr>

            <tr>
              <td className="py-4 text-white">São Paulo - SP → Santos - SP</td>
              <td className="py-4 text-white/65">04/05/2025 09:15</td>
              <td className="py-4">
                <span className="rounded-full bg-[#4b1b1b] px-3 py-1 text-sm text-[#ff8f8f]">
                  Cancelado
                </span>
              </td>
              <td className="py-4 text-white/60">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-sm text-white/35">
        Seus dados estão protegidos com segurança e privacidade.
      </p>
    </div>
  )
}

function ListaMotoristas() {
  return (
    <div className="rounded-[18px] border border-[#1a2330] bg-[#08111b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[20px] font-bold text-white">Motoristas próximos</h3>
        <button className="text-sm font-semibold text-[#ffc400]">Ver todos</button>
      </div>

      <div className="space-y-4">
        <MotoristaItem iniciais="CA" nome="Carlos Alberto" info="12 viagens • 98%" distancia="1,2 km" />
        <MotoristaItem iniciais="JF" nome="João Ferreira" info="8 viagens • 97%" distancia="1,8 km" />
        <MotoristaItem iniciais="ML" nome="Marcos Lima" info="15 viagens • 99%" distancia="2,3 km" />
      </div>
    </div>
  )
}

function MotoristaItem({
  iniciais,
  nome,
  info,
  distancia,
}: {
  iniciais: string
  nome: string
  info: string
  distancia: string
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-[#233041] bg-[#0c121b] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffc400]/50 text-sm font-bold text-[#ffc400]">
          {iniciais}
        </div>
        <div>
          <p className="font-semibold text-white">{nome}</p>
          <p className="text-sm text-white/55">{info}</p>
        </div>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/75">
        {distancia}
      </span>
    </div>
  )
}

function InputLabel({ label, children }: { label: string; children: any }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium text-white">{label}</span>
      {children}
    </label>
  )
}

function InfoIconCard({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="flex flex-col items-start">
      <img
        src={icon}
        alt=""
        className="h-16 w-16 object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.65)]"
      />

      <h3 className="mt-3 text-lg font-bold text-[#ffc400]">{title}</h3>

      <p className="mt-1 max-w-[150px] text-sm leading-relaxed text-gray-200">{text}</p>
    </div>
  )
}

function IconBox({ icon, active = false }: { icon: string; active?: boolean }) {
  return (
    <div
      className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-lg border ${
        active
          ? "border-[#ffc400]/35 bg-[#ffc400]/10"
          : "border-white/10 bg-white/[0.055]"
      }`}
    >
      <img
        src={icon}
        alt=""
        className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(255,196,0,0.35)]"
      />
    </div>
  )
}

function ProfilePhotoBox({
  preview,
  onChange,
}: {
  preview: string
  onChange: (file: File | null) => void
}) {
  return (
    <label className="relative flex h-[68px] w-[68px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#ffc400]/35 bg-[#ffc400]/10 transition hover:bg-[#ffc400]/15">
      {preview ? (
        <img
          src={preview}
          alt="Foto do motorista"
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={imagens.fotoPerfilCadastro}
          alt=""
          className="h-9 w-9 object-contain drop-shadow-[0_0_10px_rgba(255,196,0,0.45)]"
        />
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  )
}

function DotsButton() {
  return (
    <button
      type="button"
      className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-2xl leading-none text-white/65"
    >
      ⋯
    </button>
  )
}

function DriverField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  dots = false,
}: {
  icon: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  dots?: boolean
}) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] items-end gap-4">
      <IconBox icon={icon} />

      <label className="block">
        <span className="mb-2 block text-base font-bold text-white">{label}</span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-[48px] w-full rounded-lg border border-white/15 bg-[#10151b]/90 px-4 text-base text-white outline-none placeholder:text-white/45 focus:border-[#ffc400]/70"
        />
      </label>

      {dots ? <DotsButton /> : <div className="w-[48px]" />}
    </div>
  )
}

function DriverSelect({
  icon,
  label,
  value,
  onChange,
  dots = false,
}: {
  icon: string
  label: string
  value: string
  onChange: (value: string) => void
  dots?: boolean
}) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] items-end gap-4">
      <IconBox icon={icon} />

      <label className="block">
        <span className="mb-2 block text-base font-bold text-white">{label}</span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[48px] w-full rounded-lg border border-white/15 bg-[#10151b]/90 px-4 text-base text-white outline-none focus:border-[#ffc400]/70"
        >
          <option value="">Selecione o tipo de caminhão</option>
          <option value="bau">Baú</option>
          <option value="carroceria">Carroceria aberta</option>
          <option value="toco">Toco</option>
          <option value="truck">Truck</option>
          <option value="bitruck">Bitruck</option>
          <option value="carreta">Carreta</option>
          <option value="refrigerado">Refrigerado</option>
          <option value="guincho">Guincho</option>
        </select>
      </label>

      {dots ? <DotsButton /> : <div className="w-[48px]" />}
    </div>
  )
}

function DriverRegion({
  icon,
  label,
  value,
  onChange,
  dots = false,
}: {
  icon: string
  label: string
  value: string
  onChange: (value: string) => void
  dots?: boolean
}) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] items-end gap-4">
      <IconBox icon={icon} />

      <label className="block">
        <span className="mb-2 block text-base font-bold text-white">{label}</span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[48px] w-full rounded-lg border border-white/15 bg-[#10151b]/90 px-4 text-base text-white outline-none focus:border-[#ffc400]/70"
        >
          <option value="">Selecione sua região</option>
          <option value="sao-paulo-sp">São Paulo / SP</option>
          <option value="recife-pe">Recife / PE</option>
          <option value="rio-de-janeiro-rj">Rio de Janeiro / RJ</option>
          <option value="belo-horizonte-mg">Belo Horizonte / MG</option>
          <option value="curitiba-pr">Curitiba / PR</option>
          <option value="outra">Outra região</option>
        </select>
      </label>

      {dots ? <DotsButton /> : <div className="w-[48px]" />}
    </div>
  )
}

function ClienteSelect({
  icon,
  label,
  value,
  onChange,
  placeholder,
  options,
  dots = false,
}: {
  icon: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[][]
  dots?: boolean
}) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] items-end gap-4">
      <IconBox icon={icon} />

      <label className="block">
        <span className="mb-2 block text-base font-bold text-white">{label}</span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[48px] w-full rounded-lg border border-white/15 bg-[#10151b]/90 px-4 text-base text-white outline-none focus:border-[#ffc400]/70"
        >
          <option value="">{placeholder}</option>

          {options.map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      </label>

      {dots ? <DotsButton /> : <div className="w-[48px]" />}
    </div>
  )
}

function DriverUpload({
  icon,
  label,
  placeholder,
  file,
  onChange,
  dots = false,
}: {
  icon: string
  label: string
  placeholder: string
  file: File | null
  onChange: (file: File | null) => void
  dots?: boolean
}) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] items-end gap-4">
      <IconBox icon={icon} />

      <label className="block">
        <span className="mb-2 block text-base font-bold text-white">{label}</span>

        <div className="flex h-[48px] items-center overflow-hidden rounded-lg border border-white/15 bg-[#10151b]/90">
          <div className="flex-1 px-4 text-base text-white/50">
            {file ? file.name : placeholder}
          </div>

          <div className="relative h-full">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => onChange(event.target.files?.[0] || null)}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            />

            <button
              type="button"
              className="h-full border-l border-[#ffc400]/35 px-5 font-bold text-[#ffc400]"
            >
              ⤴ Selecionar arquivos
            </button>
          </div>
        </div>
      </label>

      {dots ? <DotsButton /> : <div className="w-[48px]" />}
    </div>
  )
}

function MobileDriverInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex h-[58px] items-center gap-4 rounded-xl border border-white/15 bg-[#10151b]/70 px-4 backdrop-blur-md">
      <img src={icon} alt="" className="h-6 w-6 object-contain opacity-70" />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
      />
    </div>
  )
}

function MobileDriverSelect({
  icon,
  value,
  onChange,
}: {
  icon: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex h-[58px] items-center gap-4 rounded-xl border border-white/15 bg-[#10151b]/70 px-4 backdrop-blur-md">
      <img src={icon} alt="" className="h-6 w-6 object-contain opacity-70" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full flex-1 bg-transparent text-[16px] text-white outline-none"
      >
        <option value="">Tipo de caminhão</option>
        <option value="bau">Baú</option>
        <option value="carroceria">Carroceria aberta</option>
        <option value="toco">Toco</option>
        <option value="truck">Truck</option>
        <option value="bitruck">Bitruck</option>
        <option value="carreta">Carreta</option>
        <option value="refrigerado">Refrigerado</option>
        <option value="guincho">Guincho</option>
      </select>

      <span className="text-2xl text-white/50">⌄</span>
    </div>
  )
}

function MobileRegionSelect({
  icon,
  value,
  onChange,
}: {
  icon: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex h-[58px] items-center gap-4 rounded-xl border border-white/15 bg-[#10151b]/70 px-4 backdrop-blur-md">
      <img src={icon} alt="" className="h-6 w-6 object-contain opacity-70" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full flex-1 bg-transparent text-[16px] text-white outline-none"
      >
        <option value="">Cidade / região de atuação</option>
        <option value="sao-paulo-sp">São Paulo / SP</option>
        <option value="recife-pe">Recife / PE</option>
        <option value="rio-de-janeiro-rj">Rio de Janeiro / RJ</option>
        <option value="belo-horizonte-mg">Belo Horizonte / MG</option>
        <option value="curitiba-pr">Curitiba / PR</option>
        <option value="outra">Outra região</option>
      </select>

      <span className="text-2xl text-white/50">⌄</span>
    </div>
  )
}

function MobileClienteSelect({
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  icon: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[][]
}) {
  return (
    <div className="flex h-[58px] items-center gap-4 rounded-xl border border-white/15 bg-[#10151b]/70 px-4 backdrop-blur-md">
      <img src={icon} alt="" className="h-6 w-6 object-contain opacity-70" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full flex-1 bg-transparent text-[16px] text-white outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map(([valueOption, labelOption]) => (
          <option key={valueOption} value={valueOption}>
            {labelOption}
          </option>
        ))}
      </select>

      <span className="text-2xl text-white/50">⌄</span>
    </div>
  )
}

function MobileUploadCard({
  icon,
  title,
  text,
  file,
  onChange,
}: {
  icon: string
  title: string
  text: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <label className="flex min-h-[92px] cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-[#10151b]/55 px-5 py-4 backdrop-blur-md">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <img src={icon} alt="" className="h-7 w-7 object-contain opacity-75" />
      </div>

      <div className="flex-1">
        <p className="text-[18px] font-bold text-white">{title}</p>
        <p className="mt-1 text-sm text-white/55">{file ? file.name : text}</p>
      </div>

      <div className="text-center text-[#ffc400]">
        <div className="text-3xl leading-none">☁</div>
        <p className="mt-1 text-sm font-bold">Enviar</p>
      </div>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
        className="hidden"
      />
    </label>
  )
}