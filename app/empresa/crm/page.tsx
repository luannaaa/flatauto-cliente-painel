"use client"

import { useEffect, useState } from "react"
import {
  PlugZap,
  CircleAlert,
  Settings,
  Users,
  Package,
  RefreshCw,
  X,
  ArrowRight,
} from "lucide-react"

type Tema = "dark" | "light"

const crms = ["Kommo CRM", "HubSpot", "RD Station", "PipeRun", "Outro CRM"]

export default function CrmPage() {
  const [tema, setTema] = useState<Tema>("dark")
  const [crmSelecionado, setCrmSelecionado] = useState("")
  const [modalAberto, setModalAberto] = useState(false)

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

  const claro = tema === "light"

  const ui = {
    pagina: claro ? "bg-[#f6f0df] text-black" : "bg-[#020507] text-white",
    card: claro
      ? "border-[#dfd0a5] bg-white/90 shadow-[0_18px_45px_rgba(80,60,20,0.10)]"
      : "border-white/10 bg-[#10171b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.30)]",
    card2: claro ? "border-[#dfd0a5] bg-[#f7f0dc]" : "border-white/10 bg-white/[0.045]",
    textoFraco: claro ? "text-black/55" : "text-white/60",
  }

  function abrirConexao() {
    if (!crmSelecionado) {
      alert("Selecione um CRM primeiro.")
      return
    }

    setModalAberto(true)
  }

  return (
    <main className={`min-h-screen px-4 py-5 sm:px-6 lg:px-10 ${ui.pagina}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-black text-[#ffc400]">Área da Empresa</p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">CRM</h1>
          <p className={`mt-2 max-w-2xl text-sm ${ui.textoFraco}`}>
            Estrutura preparada para conectar CRM externo futuramente.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Resumo ui={ui} titulo="Clientes" valor="—" icon={<Users />} />
          <Resumo ui={ui} titulo="Entregas" valor="—" icon={<Package />} />
          <Resumo ui={ui} titulo="Sincronização" valor="Off" icon={<RefreshCw />} />
          <Resumo ui={ui} titulo="Status" valor="Aguardando" icon={<PlugZap />} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={`rounded-[30px] border p-5 sm:p-7 ${ui.card}`}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
              <PlugZap size={34} />
            </div>

            <h2 className="mt-6 text-2xl font-black">Conectar CRM</h2>

            <p className={`mt-2 text-sm ${ui.textoFraco}`}>
              Nenhum CRM está conectado. Essa tela fica pronta para integração futura por API ou OAuth.
            </p>

            <div className="mt-6 space-y-4">
              <label>
                <span className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                  Selecionar CRM
                </span>

                <select
                  value={crmSelecionado}
                  onChange={(e) => setCrmSelecionado(e.target.value)}
                  className={`h-12 w-full rounded-2xl border px-4 text-sm font-bold outline-none ${ui.card2}`}
                >
                  <option value="" className="bg-black text-white">
                    Escolha uma opção
                  </option>

                  {crms.map((crm) => (
                    <option key={crm} value={crm} className="bg-black text-white">
                      {crm}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={abrirConexao}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"
              >
                <PlugZap size={19} />
                Conectar CRM
              </button>
            </div>
          </div>

          <aside className={`rounded-[30px] border p-5 sm:p-7 ${ui.card}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                <CircleAlert size={26} />
              </div>

              <div>
                <h3 className="text-xl font-black">Status da conexão</h3>
                <p className={`text-sm ${ui.textoFraco}`}>Nenhum CRM conectado</p>
              </div>
            </div>

            <div className={`mt-6 rounded-2xl border p-4 ${ui.card2}`}>
              <p className="font-black">Preparado para backend/API</p>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                A conexão real poderá usar token, OAuth ou API do CRM escolhido.
              </p>
            </div>

            <div className={`mt-4 rounded-2xl border p-4 ${ui.card2}`}>
              <div className="flex items-center gap-2 font-black">
                <Settings size={18} className="text-[#ffc400]" />
                O que poderá ser sincronizado
              </div>

              <ul className={`mt-3 space-y-2 text-sm ${ui.textoFraco}`}>
                <li>• Clientes cadastrados</li>
                <li>• Entregas solicitadas</li>
                <li>• Histórico de oportunidades</li>
                <li>• Status de negociação</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-[28px] border p-5 ${ui.card}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Conectar CRM</h2>

              <button onClick={() => setModalAberto(false)} className={`rounded-xl border p-2 ${ui.card2}`}>
                <X size={20} />
              </button>
            </div>

            <p className={`mt-4 text-sm ${ui.textoFraco}`}>
              Você selecionou <strong>{crmSelecionado}</strong>. A integração real será feita depois com
              autorização, token ou API do CRM.
            </p>

            <div className={`mt-5 rounded-2xl border p-4 ${ui.card2}`}>
              <p className="font-black">Estrutura pronta</p>
              <p className={`mt-1 text-sm ${ui.textoFraco}`}>
                Esta etapa ainda não conecta dados reais. Ela apenas prepara o fluxo visual de conexão.
              </p>
            </div>

            <button
              onClick={() => {
                alert("Integração preparada. A conexão real será configurada na publicação.")
                setModalAberto(false)
              }}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"
            >
              Continuar
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function Resumo({ titulo, valor, icon, ui }: any) {
  return (
    <div className={`rounded-[24px] border p-5 ${ui.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-bold ${ui.textoFraco}`}>{titulo}</p>
          <h2 className="mt-3 text-2xl font-black">{valor}</h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-[#ffc400] ${ui.card2}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}