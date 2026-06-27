"use client"

import { useEffect, useState } from "react"
import {
  X,
  Truck,
  Bike,
  Car,
  Bus,
  Save,
  Palette,
  CalendarDays,
  FileText,
  UserRound,
  ClipboardList,
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

const tiposVeiculo = ["Moto", "Carro", "Fiorino", "Van", "VUC", "Truck", "Toco", "Carreta"]

type Motorista = {
  id: string
  nome: string | null
}

function IconeTipo({ tipo, size = 18 }: { tipo: string; size?: number }) {
  if (tipo === "Moto") return <Bike size={size} />
  if (tipo === "Carro") return <Car size={size} />
  if (tipo === "Fiorino" || tipo === "Van") return <Bus size={size} />
  return <Truck size={size} />
}

export default function NovoVeiculoModal({ ui, fechar, aoSalvar }: any) {
  const [tipo, setTipo] = useState("Moto")
  const [placa, setPlaca] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [ano, setAno] = useState("")
  const [cor, setCor] = useState("")
  const [capacidadeKg, setCapacidadeKg] = useState("")
  const [motoristaId, setMotoristaId] = useState("")
  const [ativo, setAtivo] = useState("true")
  const [observacoes, setObservacoes] = useState("")
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"

    carregarMotoristas()

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  async function carregarMotoristas() {
    setCarregandoMotoristas(true)
    setErro("")

    const { data, error } = await supabase
      .from("motoristas")
      .select("id,nome")
      .order("nome", { ascending: true })

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      setMotoristas([])
      setCarregandoMotoristas(false)
      return
    }

    setMotoristas((data || []) as Motorista[])
    setCarregandoMotoristas(false)
  }

  async function salvarVeiculo() {
    if (!tipo.trim()) {
      setErro("Selecione o tipo do veículo.")
      return
    }

    if (!placa.trim()) {
      setErro("Preencha a placa do veículo.")
      return
    }

    setSalvando(true)
    setErro("")

    const anoNumero = Number(ano)
    const capacidadeNumero = Number(String(capacidadeKg).replace(",", "."))

    const { error } = await supabase.from("veiculos").insert({
      motorista_id: motoristaId || null,
      tipo_veiculo: tipo.trim(),
      marca: marca.trim() || null,
      modelo: modelo.trim() || null,
      ano: Number.isFinite(anoNumero) && anoNumero > 0 ? anoNumero : null,
      placa: placa.trim(),
      cor: cor.trim() || null,
      capacidade_kg:
        Number.isFinite(capacidadeNumero) && capacidadeNumero > 0 ? capacidadeNumero : null,
      ativo: ativo === "true",
      created_at: new Date().toISOString(),
    })

    setSalvando(false)

    if (error) {
      setErro(`Erro Supabase: ${error.message}`)
      return
    }

    if (typeof aoSalvar === "function") {
      await aoSalvar()
    }

    fechar()
  }

  const motoristaSelecionado = motoristas.find((motorista) => motorista.id === motoristaId)

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border sm:max-w-[950px] sm:rounded-[30px] ${ui.card}`}>
        <header className={`flex items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-5 ${ui.linha}`}>
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Novo Veículo</h2>
            <p className={`mt-1 text-xs sm:text-sm ${ui.textoFraco}`}>
              Cadastre um veículo real da frota e vincule a um motorista quando quiser.
            </p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 ${ui.card2}`}>
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <SelectCampo
                ui={ui}
                label="Tipo do veículo"
                value={tipo}
                onChange={setTipo}
                options={tiposVeiculo.map((item) => ({ value: item, label: item }))}
                icon={<IconeTipo tipo={tipo} />}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Campo ui={ui} icon={<FileText size={18} />} label="Placa" placeholder="Ex: ABC-1234" value={placa} onChange={setPlaca} />
                <Campo ui={ui} icon={<Truck size={18} />} label="Marca" placeholder="Ex: Honda, Fiat, Mercedes" value={marca} onChange={setMarca} />
                <Campo ui={ui} icon={<Truck size={18} />} label="Modelo" placeholder="Ex: CG 160, Fiorino, VUC" value={modelo} onChange={setModelo} />
                <Campo ui={ui} icon={<CalendarDays size={18} />} label="Ano" placeholder="Ex: 2024" value={ano} onChange={setAno} />
                <Campo ui={ui} icon={<Palette size={18} />} label="Cor" placeholder="Ex: Branco" value={cor} onChange={setCor} />
                <Campo ui={ui} icon={<Truck size={18} />} label="Capacidade KG" placeholder="Ex: 800" value={capacidadeKg} onChange={setCapacidadeKg} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectCampo
                  ui={ui}
                  label="Motorista vinculado"
                  value={motoristaId}
                  onChange={setMotoristaId}
                  options={[
                    { value: "", label: carregandoMotoristas ? "Carregando..." : "Sem motorista vinculado" },
                    ...motoristas.map((motorista) => ({
                      value: motorista.id,
                      label: motorista.nome || "Motorista sem nome",
                    })),
                  ]}
                  icon={<UserRound size={18} />}
                />

                <SelectCampo
                  ui={ui}
                  label="Status"
                  value={ativo}
                  onChange={setAtivo}
                  options={[
                    { value: "true", label: "Disponível / Ativo" },
                    { value: "false", label: "Inativo / Manutenção" },
                  ]}
                  icon={<ClipboardList size={18} />}
                />
              </div>

              {motoristas.length === 0 && !carregandoMotoristas && (
                <p className="text-xs font-bold text-[#d4af37]">
                  Nenhum motorista cadastrado ainda. O veículo pode ser salvo sem motorista e vinculado depois.
                </p>
              )}

              <div>
                <label className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                  Observações
                </label>

                <div className={`flex min-h-[105px] gap-3 rounded-2xl border px-4 py-3 ${ui.card2}`}>
                  <ClipboardList size={18} className="mt-1 text-[#d4af37]" />
                  <textarea
                    value={observacoes}
                    onChange={(event) => setObservacoes(event.target.value)}
                    placeholder="Observação visual por enquanto. Depois podemos criar uma coluna para salvar isso."
                    className="min-h-[80px] flex-1 resize-none bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <aside className={`rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37] text-white">
                <IconeTipo tipo={tipo} size={28} />
              </div>

              <h3 className="mt-5 text-xl font-black">Resumo do veículo</h3>

              <div className={`mt-5 space-y-3 border-t pt-5 ${ui.linha}`}>
                <ResumoLinha label="Tipo" valor={tipo} />
                <ResumoLinha label="Placa" valor={placa || "A preencher"} />
                <ResumoLinha label="Modelo" valor={modelo || "A preencher"} />
                <ResumoLinha label="Motorista" valor={motoristaSelecionado?.nome || "Não vinculado"} />
                <ResumoLinha label="Status" valor={ativo === "true" ? "Disponível" : "Inativo"} />
              </div>

              {erro && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-400">
                  {erro}
                </div>
              )}

              <button
                onClick={salvarVeiculo}
                disabled={salvando}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={19} />
                {salvando ? "Salvando..." : "Salvar Veículo"}
              </button>

              <button onClick={fechar} className={`mt-3 h-12 w-full rounded-xl border font-bold ${ui.card2}`}>
                Cancelar
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

function Campo({ ui, icon, label, placeholder, value, onChange }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 ${ui.card2}`}>
        <span className="text-[#d4af37]">{icon}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  )
}

function SelectCampo({ ui, label, value, onChange, options, icon }: any) {
  return (
    <label>
      <span className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}>
        {label}
      </span>

      <div className={`flex h-12 items-center gap-3 rounded-2xl border px-4 ${ui.card2}`}>
        <span className="text-[#d4af37]">{icon}</span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          {options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value} className="bg-black text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

function ResumoLinha({ label, valor }: any) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="opacity-60">{label}</span>
      <strong className="max-w-[180px] text-right text-xs sm:text-sm">{valor}</strong>
    </div>
  )
}
