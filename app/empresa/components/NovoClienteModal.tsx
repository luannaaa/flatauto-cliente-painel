"use client"

import { useEffect, useState } from "react"
import {
  X,
  Save,
  Building2,
  UserRound,
  Phone,
  Mail,
  MapPin,
  FileText,
  ClipboardList,
} from "lucide-react"

type TipoCliente = "Empresa" | "Pessoa física"
type StatusCliente = "Ativo" | "Inativo"

type NovoCliente = {
  nome: string
  responsavel: string
  tipo: TipoCliente
  documento: string
  telefone: string
  email: string
  cidade: string
  status: StatusCliente
}

type Props = {
  ui: any
  fechar: () => void
  salvar: (cliente: NovoCliente) => void
}

export default function NovoClienteModal({ ui, fechar, salvar }: Props) {
  const [tipo, setTipo] = useState<TipoCliente>("Empresa")
  const [nome, setNome] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [documento, setDocumento] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [status, setStatus] = useState<StatusCliente>("Ativo")
  const [observacoes, setObservacoes] = useState("")

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  function salvarCliente() {
    if (!nome.trim()) {
      alert("Preencha o nome do cliente.")
      return
    }

    salvar({
      nome: nome.trim(),
      responsavel: responsavel.trim() || nome.trim(),
      tipo,
      documento: documento.trim() || "Não informado",
      telefone: telefone.trim() || "Não informado",
      email: email.trim() || "Não informado",
      cidade: cidade.trim() || estado.trim() || "Não informado",
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border sm:max-w-[980px] sm:rounded-[30px] ${ui.card}`}>
        <header className={`flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-5 ${ui.linha}`}>
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Novo Cliente</h2>
            <p className={`mt-1 text-xs sm:text-sm ${ui.textoFraco}`}>
              Cadastre clientes e empresas atendidas pela transportadora.
            </p>
          </div>

          <button onClick={fechar} className={`rounded-xl border p-2.5 ${ui.card2}`}>
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectCampo
                  ui={ui}
                  label="Tipo de cliente"
                  value={tipo}
                  onChange={setTipo}
                  options={["Empresa", "Pessoa física"]}
                  icon={tipo === "Empresa" ? <Building2 size={18} /> : <UserRound size={18} />}
                />

                <SelectCampo
                  ui={ui}
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={["Ativo", "Inativo"]}
                  icon={<ClipboardList size={18} />}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Campo ui={ui} icon={<Building2 size={18} />} label="Nome / Empresa" placeholder="Ex: Mercado Central" value={nome} onChange={setNome} />
                <Campo ui={ui} icon={<UserRound size={18} />} label="Responsável" placeholder="Ex: Carlos Silva" value={responsavel} onChange={setResponsavel} />
                <Campo ui={ui} icon={<FileText size={18} />} label="CPF ou CNPJ" placeholder="Ex: 12.345.678/0001-90" value={documento} onChange={setDocumento} />
                <Campo ui={ui} icon={<Phone size={18} />} label="Telefone / WhatsApp" placeholder="Ex: (81) 99999-9999" value={telefone} onChange={setTelefone} />
                <Campo ui={ui} icon={<Mail size={18} />} label="E-mail" placeholder="Ex: contato@email.com" value={email} onChange={setEmail} />
                <Campo ui={ui} icon={<MapPin size={18} />} label="CEP" placeholder="Ex: 50000-000" value={cep} onChange={setCep} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Campo ui={ui} icon={<MapPin size={18} />} label="Rua" placeholder="Rua / Avenida" value={rua} onChange={setRua} />
                <Campo ui={ui} icon={<MapPin size={18} />} label="Número" placeholder="Ex: 120" value={numero} onChange={setNumero} />
                <Campo ui={ui} icon={<MapPin size={18} />} label="Bairro" placeholder="Ex: Boa Viagem" value={bairro} onChange={setBairro} />
                <Campo ui={ui} icon={<MapPin size={18} />} label="Cidade" placeholder="Ex: Recife - PE" value={cidade} onChange={setCidade} />
                <Campo ui={ui} icon={<MapPin size={18} />} label="Estado" placeholder="Ex: PE" value={estado} onChange={setEstado} />
              </div>

              <div>
                <label className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}>
                  Observações
                </label>

                <div className={`flex min-h-[105px] gap-3 rounded-2xl border px-4 py-3 ${ui.card2}`}>
                  <ClipboardList size={18} className="mt-1 text-[#ffc400]" />
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: cliente recorrente, prefere WhatsApp, endereço principal de coleta..."
                    className="min-h-[80px] flex-1 resize-none bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <aside className={`rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc400] text-black">
                {tipo === "Empresa" ? <Building2 size={28} /> : <UserRound size={28} />}
              </div>

              <h3 className="mt-5 text-xl font-black">Resumo do cliente</h3>
              <p className={`mt-2 text-sm ${ui.textoFraco}`}>
                Depois o backend vai salvar esse cadastro no banco e conectar com as entregas.
              </p>

              <div className={`mt-5 space-y-3 border-t pt-5 ${ui.linha}`}>
                <ResumoLinha label="Nome" valor={nome || "A preencher"} />
                <ResumoLinha label="Tipo" valor={tipo} />
                <ResumoLinha label="Documento" valor={documento || "A preencher"} />
                <ResumoLinha label="Telefone" valor={telefone || "A preencher"} />
                <ResumoLinha label="Cidade" valor={cidade || "A preencher"} />
                <ResumoLinha label="Status" valor={status} />
              </div>

              <button
                onClick={salvarCliente}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black"
              >
                <Save size={19} />
                Salvar Cliente
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
        <span className="text-[#ffc400]">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
        <span className="text-[#ffc400]">{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          {options.map((option: string) => (
            <option key={option} value={option} className="bg-black text-white">
              {option}
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
