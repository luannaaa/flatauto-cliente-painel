"use client"

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const banners = ["/carosel3.png", "/carosel2.png", "/coleta1.png"]
const yellow = "#ffc400"

type PainelClienteMobileProps = {
  nomeCompleto: string
  onSair: () => void
}

type AbaMenu = "inicio" | "buscar" | "meusFretes" | "perfil"

function pegarPrimeiroNome(nomeCompleto: string) {
  return nomeCompleto.trim().split(" ").filter(Boolean)[0] || "Cliente"
}

export default function PainelClienteMobile({ nomeCompleto }: PainelClienteMobileProps) {
  const router = useRouter()
  const nome = useMemo(() => pegarPrimeiroNome(nomeCompleto), [nomeCompleto])
  const [fotoPerfil, setFotoPerfil] = useState("/foto_perfil_cadastro.png")
  const [bannerAtual, setBannerAtual] = useState(0)
  const [abaAtiva, setAbaAtiva] = useState<AbaMenu>("inicio")

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerAtual((atual) => (atual + 1) % banners.length)
    }, 5200)

    return () => clearInterval(timer)
  }, [])

  function trocarFoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setFotoPerfil(URL.createObjectURL(file))
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="mx-auto w-full max-w-[430px] px-4 pb-32 pt-7">
        <header className="flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="FlatAuto"
            width={145}
            height={46}
            className="w-[145px]"
            style={{ height: "auto" }}
            priority
          />

          <div className="flex items-center gap-5">
            <div className="relative">
              <BellIcon size={29} color="rgba(255,255,255,.65)" />
              <span className="absolute right-0 top-0 h-[8px] w-[8px] rounded-full bg-[#ffc400]" />
            </div>

            <label className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#ffc400] p-[2px]">
              <Image
                src={fotoPerfil}
                alt="Perfil"
                width={42}
                height={42}
                className="h-full w-full rounded-full object-cover"
              />
              <input type="file" accept="image/*" onChange={trocarFoto} className="hidden" />
            </label>
          </div>
        </header>

        <section className="mt-9">
          <h1 className="text-[34px] font-black leading-tight">
            Olá, {nome}! 👋
          </h1>

          <p className="mt-3 max-w-[330px] text-[17px] leading-relaxed text-white/60">
             Encontre o frete ideal para suas entregas com praticidade e segurança.
          </p>
        </section>

        <button
          onClick={() => router.push("/cliente/marcar-frete")}
          className="mt-8 block w-full overflow-hidden rounded-[26px] bg-[#080808] text-left shadow-[0_0_35px_rgba(0,0,0,0.9)] transition active:scale-[0.98]"
        >
          <Image
            key={banners[bannerAtual]}
            src={banners[bannerAtual]}
            alt="Banner"
            width={900}
            height={430}
            priority
            className="w-full rounded-[26px] object-contain"
            style={{ height: "auto" }}
          />

          <div className="-mt-7 flex justify-center gap-2 pb-4">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all ${
                  bannerAtual === index ? "w-7 bg-[#ffc400]" : "w-2 bg-white/35"
                }`}
              />
            ))}
          </div>
        </button>

        <section className="mt-5 grid grid-cols-4 gap-2.5">
          <Card
            label={<>Solicitar<br />entrega</>}
            icon={<TruckImageIcon tipo="dourado" destaque />}
            onClick={() => router.push("/cliente/marcar-frete")}
          />

          <Card
            label={<>Meus<br />fretes</>}
            icon={<FileIcon />}
            onClick={() => router.push("/cliente/meus-fretes")}
          />

          <Card
            label="Favoritos"
            icon={<StarIcon />}
            onClick={() => router.push("/cliente/favoritos")}
          />

          <Card
            label="Suporte"
            icon={<HeadsetIcon />}
            onClick={() => router.push("/cliente/suporte")}
          />
        </section>

        <MiniDashboard />

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[22px] font-black">Fretes recentes</h2>
            <button
              onClick={() => router.push("/cliente/meus-fretes")}
              className="text-[14px] font-bold text-[#ffc400]"
            >
              Ver todos ›
            </button>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#080808]">
            <Frete
              id="#1287"
              type="yellow"
              icon={<PinIcon />}
              origem="São Paulo - SP"
              destino="Campinas - SP"
              valor="R$ 1.250,00"
              status="Em andamento"
              solicitado="10:20"
              retirado="11:00"
              entregue="Pendente"
            />

            <Frete
              id="#1286"
              type="green"
              icon={<CheckIcon />}
              origem="Rio de Janeiro - RJ"
              destino="Belo Horizonte - MG"
              valor="R$ 980,00"
              status="Concluído"
              solicitado="08:40"
              retirado="09:15"
              entregue="13:30"
            />

            <Frete
              id="#1285"
              type="blue"
              icon={<TruckImageIcon tipo="azul" />}
              origem="Curitiba - PR"
              destino="São Paulo - SP"
              valor="R$ 1.430,00"
              status="A caminho"
              solicitado="07:55"
              retirado="08:35"
              entregue="Pendente"
            />
          </div>
        </section>

        <section className="mt-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#080808] p-5 shadow-[0_0_25px_rgba(0,0,0,0.65)]">
          <div className="flex items-center gap-4">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-[#ffc400]/40 bg-[#ffc400]/15 text-[#ffc400]">
              <HeadsetIcon />
            </div>

            <div>
              <h3 className="text-[16px] font-bold">Precisa de ajuda?</h3>
              <p className="mt-1 text-xs text-white/55">
                Fale com nossa equipe de suporte.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/cliente/suporte")}
            className="rounded-2xl border border-[#ffc400] px-3 py-2 text-sm font-bold text-[#ffc400]"
          >
            Falar ›
          </button>
        </section>

        <BottomMenu
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          irPara={(rota) => router.push(rota)}
        />
      </div>
    </main>
  )
}

function MiniDashboard() {
  return (
    <section className="mt-6 rounded-[24px] border border-white/10 bg-[#080808] p-4 shadow-[0_0_25px_rgba(0,0,0,0.65)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[20px] font-black">Resumo da conta</h2>
        <span className="rounded-full border border-[#ffc400]/35 bg-[#ffc400]/10 px-3 py-1 text-[11px] font-bold text-[#ffc400]">
          Este mês
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResumoCard titulo="Total gasto" valor="R$ 3.660" detalhe="em fretes" cor="yellow" />
        <ResumoCard titulo="Fretes" valor="3" detalhe="solicitados" cor="blue" />
        <ResumoCard titulo="Andamento" valor="2" detalhe="em rota" cor="orange" />
        <ResumoCard titulo="Concluídos" valor="1" detalhe="finalizado" cor="green" />
      </div>
    </section>
  )
}

function ResumoCard({
  titulo,
  valor,
  detalhe,
  cor,
}: {
  titulo: string
  valor: string
  detalhe: string
  cor: "yellow" | "blue" | "orange" | "green"
}) {
  const cores = {
    yellow: "text-[#ffc400]",
    blue: "text-[#1687ff]",
    orange: "text-orange-400",
    green: "text-[#22c55e]",
  }

  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-3">
      <p className="text-[11px] font-bold text-white/50">{titulo}</p>
      <p className={`mt-1 text-[22px] font-black leading-none ${cores[cor]}`}>{valor}</p>
      <p className="mt-1 text-[11px] text-white/45">{detalhe}</p>
    </div>
  )
}

function Card({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[104px] flex-col items-center justify-center rounded-[22px] border border-white/10 bg-[#070707] p-2.5 text-center shadow-[0_0_25px_rgba(0,0,0,0.65)] transition active:scale-95"
    >
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#ffc400]/35 bg-[#ffc400]/15 text-[#ffc400]">
        {icon}
      </div>

      <span className="mt-2 text-[13px] font-bold leading-tight">
        {label}
      </span>
    </button>
  )
}

function Frete({
  id,
  icon,
  origem,
  destino,
  valor,
  status,
  type,
  solicitado,
  retirado,
  entregue,
}: {
  id: string
  icon: ReactNode
  origem: string
  destino: string
  valor: string
  status: string
  solicitado: string
  retirado: string
  entregue: string
  type: "yellow" | "green" | "blue"
}) {
  const cores = {
    yellow: {
      cor: "#ffc400",
      fundo: "rgba(255,196,0,0.16)",
      borda: "rgba(255,196,0,0.42)",
      barra: "#ffc400",
    },
    green: {
      cor: "#22c55e",
      fundo: "rgba(34,197,94,0.16)",
      borda: "rgba(34,197,94,0.46)",
      barra: "#22c55e",
    },
    blue: {
      cor: "#1687ff",
      fundo: "rgba(22,135,255,0.16)",
      borda: "rgba(22,135,255,0.46)",
      barra: "#1687ff",
    },
  }

  const c = cores[type]

  return (
    <div className="relative border-b border-white/10 px-4 py-4 last:border-b-0">
      <span
        className="absolute left-0 top-5 h-[76px] w-1.5 rounded-full"
        style={{ backgroundColor: c.barra }}
      />

      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="flex min-w-0 gap-3">
          <div
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border"
            style={{
              color: c.cor,
              backgroundColor: c.fundo,
              borderColor: c.borda,
            }}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold text-white/35">{id}</p>
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{
                  color: c.cor,
                  backgroundColor: c.fundo,
                  borderColor: c.borda,
                }}
              >
                {status}
              </span>
            </div>

            <h3 className="mt-1 truncate text-[14px] font-black leading-tight">{origem}</h3>
            <p className="mt-0.5 truncate text-[12px] text-white/55">{destino}</p>
          </div>
        </div>

        <p className="shrink-0 text-[15px] font-black" style={{ color: c.cor }}>
          {valor}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 pl-3">
        <HoraCard titulo="Solicitado" valor={solicitado} />
        <HoraCard titulo="Retirado" valor={retirado} />
        <HoraCard titulo="Entregue" valor={entregue} />
      </div>
    </div>
  )
}

function HoraCard({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-white/[0.035] px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-wide text-white/35">{titulo}</p>
      <p className="mt-1 text-[11px] font-black text-white/80">{valor}</p>
    </div>
  )
}

function BottomMenu({
  abaAtiva,
  setAbaAtiva,
  irPara,
}: {
  abaAtiva: AbaMenu
  setAbaAtiva: (aba: AbaMenu) => void
  irPara: (rota: string) => void
}) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex h-[82px] w-[calc(100%-24px)] max-w-[430px] -translate-x-1/2 items-center justify-between rounded-[28px] border border-white/10 bg-[#07090d] px-5 shadow-[0_0_35px_rgba(0,0,0,0.9)]">
      <Menu
        icon={<HomeIcon />}
        label="Início"
        active={abaAtiva === "inicio"}
        onClick={() => setAbaAtiva("inicio")}
      />

      <Menu
        icon={<SearchIcon />}
        label="Buscar"
        active={abaAtiva === "buscar"}
        onClick={() => {
          setAbaAtiva("buscar")
          irPara("/cliente/buscar")
        }}
      />

      <button
        onClick={() => irPara("/cliente/marcar-frete")}
        className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#ffc400] text-[38px] font-black leading-none text-black shadow-[0_0_30px_rgba(255,196,0,0.55)] transition active:scale-95"
      >
        +
      </button>

      <Menu
        icon={<ClipboardIcon />}
        label="Meus Fretes"
        active={abaAtiva === "meusFretes"}
        onClick={() => {
          setAbaAtiva("meusFretes")
          irPara("/cliente/meus-fretes")
        }}
      />

      <Menu
        icon={<UserIcon />}
        label="Perfil"
        active={abaAtiva === "perfil"}
        onClick={() => {
          setAbaAtiva("perfil")
          irPara("/cliente/perfil")
        }}
      />
    </nav>
  )
}

function Menu({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-[64px] flex-col items-center justify-center gap-1 text-center transition-all duration-200 active:scale-95"
    >
      <div
        className={`transition-all duration-200 ${
          active
            ? "scale-110 text-[#ffc400] drop-shadow-[0_0_10px_rgba(255,196,0,0.65)]"
            : "text-white/50"
        }`}
      >
        {icon}
      </div>
      <span className={`text-[11px] leading-tight transition-all duration-200 ${active ? "font-bold text-[#ffc400]" : "text-white/50"}`}>
        {label}
      </span>
    </button>
  )
}

function SvgBase({ children, size = 30, color = "currentColor" }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

function TruckImageIcon({
  tipo = "dourado",
  destaque = false,
}: {
  tipo?: "dourado" | "azul"
  destaque?: boolean
}) {
  return (
    <img
      src={tipo === "azul" ? "/caminhao_azul.png" : "/modelo_caminhao.png"}
      alt=""
      className="h-10 w-10 scale-110 object-contain"
    />
  )
}

function FileIcon() {
  return <SvgBase><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h4" /></SvgBase>
}

function StarIcon() {
  return <SvgBase><path d="M12 3.5l2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8z" /></SvgBase>
}

function HeadsetIcon() {
  return <SvgBase><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4a2 2 0 0 0 2 2h1v-6H5" /><path d="M20 13v4a2 2 0 0 1-2 2h-1v-6h2" /></SvgBase>
}

function BellIcon({ size = 30, color = yellow }: any) {
  return <SvgBase size={size} color={color}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></SvgBase>
}

function PinIcon() {
  return <SvgBase><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.2" /></SvgBase>
}

function CheckIcon() {
  return <SvgBase><path d="M20 6L9 17l-5-5" /><path d="M12 22a10 10 0 1 0-9.5-13" /></SvgBase>
}

function CalendarIcon() {
  return <SvgBase size={14} color="rgba(255,255,255,.45)"><path d="M4 5h16v15H4z" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></SvgBase>
}

function HomeIcon() {
  return <SvgBase><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></SvgBase>
}

function SearchIcon() {
  return <SvgBase><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></SvgBase>
}

function ClipboardIcon() {
  return (
    <SvgBase size={31}>
      <path d="M8 5h8" />
      <path d="M9 3h6v4H9z" />
      <path d="M6 6h12v15H6z" />
      <path d="M9 12h6" />
      <path d="M9 16h5" />
    </SvgBase>
  )
}

function UserIcon() {
  return <SvgBase><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></SvgBase>
}
