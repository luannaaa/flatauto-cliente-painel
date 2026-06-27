"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  X,
  Check,
  MapPin,
  CalendarDays,
  Clock,
  DollarSign,
  ClipboardList,
  Navigation,
  Save,
  FileSearch,
  Package,
  Truck,
  Bike,
  Car,
  Bus,
} from "lucide-react";

type TipoEndereco = "origem" | "destino";

type ViaCepResposta = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

type SugestaoLocalizacao = {
  display_name?: string;
  lat?: string;
  lon?: string;
};

type ClienteSupabase = {
  id: string;
  empresa_id: string | null;
  nome: string | null;
  responsavel: string | null;
  tipo: string | null;
  documento: string | null;
  email: string | null;
  telefone: string | null;
  cidade: string | null;
  status: string | null;
};

const tiposTransporte = [
  "Motoboy",
  "Carro utilitário",
  "Fiorino / pequeno utilitário",
  "Van",
  "VUC",
  "Caminhão pequeno",
  "Caminhão médio",
];

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function formatarCep(valor: string) {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length > 5) {
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
  }

  return numeros;
}

function montarEndereco(dados: ViaCepResposta) {
  return [dados.logradouro, dados.bairro, dados.localidade, dados.uf]
    .filter(Boolean)
    .join(", ");
}

function IconeTransporte({
  tipo,
  size = 18,
}: {
  tipo?: string;
  size?: number;
}) {
  if (tipo === "Motoboy") return <Bike size={size} />;
  if (tipo === "Carro utilitário") return <Car size={size} />;
  if (tipo === "Fiorino / pequeno utilitário") return <Bus size={size} />;
  if (tipo === "Van") return <Bus size={size} />;
  return <Truck size={size} />;
}



function dataHojeInput() {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0];
}

function horaAtualInput() {
  const agora = new Date();
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  return `${hora}:${minuto}`;
}

function formatarDataBR(dataIso: string) {
  if (!dataIso) return "";

  const partes = dataIso.split("-");

  if (partes.length !== 3) return dataIso;

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

function formatarMoedaBR(valor: number | null | undefined) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return "R$ 0,00";
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function NovaEntregaModal({ ui, fechar }: any) {
  const [origem, setOrigem] = useState("");
  const [cepOrigem, setCepOrigem] = useState("");

  const [destino, setDestino] = useState("");
  const [cepDestino, setCepDestino] = useState("");

  const [data, setData] = useState(dataHojeInput());
  const [horario, setHorario] = useState(horaAtualInput());
  const [valor, setValor] = useState("R$ 0,00");
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [erroCalculoFrete, setErroCalculoFrete] = useState("");
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [valorMotorista, setValorMotorista] = useState<number | null>(null);
  const [valorEmpresa, setValorEmpresa] = useState<number | null>(null);
  const [descricaoCarga, setDescricaoCarga] = useState("");
  const [tipoTransporte, setTipoTransporte] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [largura, setLargura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [clientes, setClientes] = useState<ClienteSupabase[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [carregandoClientes, setCarregandoClientes] = useState(false);
  const [erroClientes, setErroClientes] = useState("");

  const inputNotaRef = useRef<HTMLInputElement | null>(null);
  const [arquivoNota, setArquivoNota] = useState<File | null>(null);
  const [lendoNota, setLendoNota] = useState(false);
  const [notaProcessada, setNotaProcessada] = useState(false);
  const [notaConfirmada, setNotaConfirmada] = useState(false);
  const [erroNota, setErroNota] = useState("");
  const [textoNota, setTextoNota] = useState("");

  const [sugestoesOrigem, setSugestoesOrigem] = useState<SugestaoLocalizacao[]>(
    [],
  );
  const [sugestoesDestino, setSugestoesDestino] = useState<
    SugestaoLocalizacao[]
  >([]);

  const [carregandoOrigem, setCarregandoOrigem] = useState(false);
  const [carregandoDestino, setCarregandoDestino] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSalvar, setMensagemSalvar] = useState("");

  useEffect(() => {
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, []);

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    const origemConsulta = cepOrigem.trim() || origem.trim();
    const destinoConsulta = cepDestino.trim() || destino.trim();

    if (!origemConsulta || !destinoConsulta) {
      setDistanciaKm(null);
      setValorMotorista(null);
      setValorEmpresa(null);
      setValor("R$ 0,00");
      setErroCalculoFrete("");
      return;
    }

    const timer = window.setTimeout(() => {
      calcularFreteAutomatico();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [origem, destino, cepOrigem, cepDestino]);

  async function carregarClientes() {
    setCarregandoClientes(true);
    setErroClientes("");

    const empresaId = localStorage.getItem("flatauto_empresa_id");

    if (!empresaId) {
      setClientes([]);
      setErroClientes("Empresa não encontrada. Saia e entre novamente.");
      setCarregandoClientes(false);
      return;
    }

    const { data, error } = await supabase
      .from("clientes_empresa")
      .select("id,empresa_id,nome,responsavel,tipo,documento,email,telefone,cidade,status")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false });

    if (error) {
      setClientes([]);
      setErroClientes(`Erro ao carregar clientes da empresa: ${error.message}`);
      setCarregandoClientes(false);
      return;
    }

    setClientes(Array.isArray(data) ? (data as ClienteSupabase[]) : []);
    setCarregandoClientes(false);
  }

  async function buscarCep(cepDigitado: string, tipo: TipoEndereco) {
    const cepLimpo = somenteNumeros(cepDigitado);

    if (cepLimpo.length !== 8) return;

    try {
      if (tipo === "origem") {
        setCarregandoOrigem(true);
      } else {
        setCarregandoDestino(true);
      }

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      const dados = (await resposta.json()) as ViaCepResposta;

      if (!resposta.ok || dados.erro) {
        alert("CEP não encontrado. Confira o número e tente novamente.");
        return;
      }

      const endereco = montarEndereco(dados);
      const cepFormatado = formatarCep(dados.cep || cepLimpo);

      if (tipo === "origem") {
        setCepOrigem(cepFormatado);
        setOrigem(endereco);
        setSugestoesOrigem([]);
      } else {
        setCepDestino(cepFormatado);
        setDestino(endereco);
        setSugestoesDestino([]);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setCarregandoOrigem(false);
      setCarregandoDestino(false);
    }
  }

  async function buscarEndereco(valorDigitado: string, tipo: TipoEndereco) {
    if (tipo === "origem") {
      setOrigem(valorDigitado);
    } else {
      setDestino(valorDigitado);
    }

    const numeros = somenteNumeros(valorDigitado);

    if (numeros.length === 8 && valorDigitado.length <= 9) {
      await buscarCep(valorDigitado, tipo);
      return;
    }

    if (valorDigitado.length < 3) {
      if (tipo === "origem") {
        setSugestoesOrigem([]);
      } else {
        setSugestoesDestino([]);
      }
      return;
    }

    try {
      if (tipo === "origem") {
        setCarregandoOrigem(true);
      } else {
        setCarregandoDestino(true);
      }

      const resposta = await fetch(
        `/api/localizacao?q=${encodeURIComponent(valorDigitado)}`,
      );
      const dados = await resposta.json();

      if (tipo === "origem") {
        setSugestoesOrigem(Array.isArray(dados) ? dados : []);
      } else {
        setSugestoesDestino(Array.isArray(dados) ? dados : []);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    } finally {
      setCarregandoOrigem(false);
      setCarregandoDestino(false);
    }
  }

  async function alterarCep(valorDigitado: string, tipo: TipoEndereco) {
    const cepFormatado = formatarCep(valorDigitado);

    if (tipo === "origem") {
      setCepOrigem(cepFormatado);
    } else {
      setCepDestino(cepFormatado);
    }

    if (somenteNumeros(cepFormatado).length === 8) {
      await buscarCep(cepFormatado, tipo);
    }
  }

  function selecionarSugestao(item: SugestaoLocalizacao, tipo: TipoEndereco) {
    if (tipo === "origem") {
      setOrigem(item.display_name || "");
      setSugestoesOrigem([]);
    } else {
      setDestino(item.display_name || "");
      setSugestoesDestino([]);
    }
  }

  async function lerNotaFiscal(file: File | null) {
    if (!file) return;

    setArquivoNota(file);
    setLendoNota(true);
    setNotaProcessada(false);
    setNotaConfirmada(false);
    setErroNota("");
    setTextoNota("");

    try {
      const formData = new FormData();
      formData.append("arquivo", file);

      const resposta = await fetch("/api/ler-nota", {
        method: "POST",
        body: formData,
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível ler a nota fiscal.");
      }

      const dados = await resposta.json();

      if (dados.localSaida) setOrigem(dados.localSaida);
      if (dados.cepOrigem) setCepOrigem(formatarCep(dados.cepOrigem));
      if (dados.destinoFinal) setDestino(dados.destinoFinal);
      if (dados.cepDestino) setCepDestino(formatarCep(dados.cepDestino));
      if (dados.textoEncontrado) setTextoNota(String(dados.textoEncontrado));

      setNotaProcessada(true);
    } catch (error) {
      console.error("Erro ao ler nota fiscal:", error);
      setErroNota(
        "Não conseguimos ler a nota fiscal. Você pode preencher os endereços manualmente.",
      );
    } finally {
      setLendoNota(false);
      if (inputNotaRef.current) {
        inputNotaRef.current.value = "";
      }
    }
  }

  function confirmarNotaFiscal() {
    setNotaConfirmada(true);
  }

  function limparNotaFiscal() {
    setArquivoNota(null);
    setLendoNota(false);
    setNotaProcessada(false);
    setNotaConfirmada(false);
    setErroNota("");
    setTextoNota("");

    setOrigem("");
    setCepOrigem("");
    setDestino("");
    setCepDestino("");
    setSugestoesOrigem([]);
    setSugestoesDestino([]);

    if (inputNotaRef.current) {
      inputNotaRef.current.value = "";
    }
  }

  const enderecoOrigemOk = Boolean(origem.trim() || cepOrigem.trim());
  const enderecoDestinoOk = Boolean(destino.trim() || cepDestino.trim());
  const notaConferidaOk =
    notaProcessada && enderecoOrigemOk && enderecoDestinoOk && !erroNota;

  async function calcularFreteAutomatico() {
    const origemConsulta = cepOrigem.trim() || origem.trim();
    const destinoConsulta = cepDestino.trim() || destino.trim();

    if (!origemConsulta || !destinoConsulta) return;

    try {
      setCalculandoFrete(true);
      setErroCalculoFrete("");

      const resposta = await fetch("/api/calcular-frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origem: origemConsulta,
          destino: destinoConsulta,
          cep_origem: cepOrigem.trim() || null,
          cep_destino: cepDestino.trim() || null,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados?.erro || "Não foi possível calcular o frete.");
      }

      setDistanciaKm(Number(dados.distancia_km || 0));
      setValorMotorista(Number(dados.valor_motorista || 0));
      setValorEmpresa(Number(dados.valor_empresa || 0));
      setValor(formatarMoedaBR(Number(dados.valor_total || 0)));
    } catch (error: any) {
      setDistanciaKm(null);
      setValorMotorista(null);
      setValorEmpresa(null);
      setValor("R$ 0,00");
      setErroCalculoFrete(
        error?.message || "Não foi possível calcular o frete.",
      );
    } finally {
      setCalculandoFrete(false);
    }
  }

  function numeroDecimal(valorTexto: string) {
    const limpo = String(valorTexto || "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const numero = Number(limpo);
    return Number.isFinite(numero) ? numero : null;
  }

  function valorMonetario(valorTexto: string) {
    const limpo = String(valorTexto || "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const numero = Number(limpo);
    return Number.isFinite(numero) ? numero : 0;
  }

  function gerarCodigoFrete() {
    const agora = new Date();
    const ano = String(agora.getFullYear()).slice(-2);
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    const aleatorio = Math.floor(Math.random() * 900 + 100);

    return `FT-${ano}${mes}${dia}-${hora}${minuto}-${aleatorio}`;
  }

  async function salvarEntrega() {
    if (salvando) return;

    setMensagemSalvar("");

    const empresaId = localStorage.getItem("flatauto_empresa_id");

    if (!empresaId) {
      setMensagemSalvar("Empresa não encontrada. Saia e entre novamente.");
      return;
    }

    if (!clienteId) {
      setMensagemSalvar("Selecione o cliente desta entrega.");
      return;
    }

    if (!origem.trim() || !destino.trim()) {
      setMensagemSalvar("Preencha origem e destino.");
      return;
    }

    if (!tipoTransporte.trim()) {
      setMensagemSalvar("Selecione o tipo de transporte.");
      return;
    }

    if (valorMonetario(valor) <= 0) {
      setMensagemSalvar("Aguarde o cálculo automático do valor do frete.");
      return;
    }

    setSalvando(true);

    const pesoNumero = numeroDecimal(peso);
    const alturaNumero = numeroDecimal(altura);
    const larguraNumero = numeroDecimal(largura);
    const comprimentoNumero = numeroDecimal(comprimento);

    const cubagemNumero =
      alturaNumero && larguraNumero && comprimentoNumero
        ? Number((alturaNumero * larguraNumero * comprimentoNumero).toFixed(3))
        : null;

    const valorNumero = valorMonetario(valor);

    const codigo = gerarCodigoFrete();

    const { data: freteCriado, error: erroFrete } = await supabase
      .from("fretes")
      .insert({
        empresa_id: empresaId,
        cliente_id: clienteId,
        motorista_id: null,
        codigo,
        origem: origem.trim(),
        destino: destino.trim(),
        cep_origem: cepOrigem.trim() || null,
        cep_destino: cepDestino.trim() || null,
        endereco_origem: origem.trim(),
        endereco_destino: destino.trim(),
        descricao_carga: descricaoCarga.trim() || "Carga geral",
        peso: pesoNumero,
        altura: alturaNumero,
        largura: larguraNumero,
        comprimento: comprimentoNumero,
        cubagem: cubagemNumero,
        valor: valor.trim() || null,
        valor_frete: valorNumero,
        tipo_carga: descricaoCarga.trim() || "Carga geral",
        tipo_transporte: tipoTransporte.trim(),
        status: "Aguardando",
        data_frete: data.trim() || null,
        data_entrega: null,
        horario: horario.trim() || null,
        documento_carga: arquivoNota?.name || null,
        observacoes: observacoes.trim() || null,
      })
      .select("id")
      .single();

    if (erroFrete || !freteCriado?.id) {
      setSalvando(false);
      setMensagemSalvar(
        `Erro Supabase: ${erroFrete?.message || "não foi possível salvar o frete."}`,
      );
      return;
    }

    const freteId = freteCriado.id;

    const { error: erroStatus } = await supabase.from("frete_status").insert({
      frete_id: freteId,
      status: "Aguardando",
      descricao: "Frete criado pela empresa",
    });

    if (erroStatus) {
      setSalvando(false);
      setMensagemSalvar(
        `Frete salvo, mas erro ao salvar status: ${erroStatus.message}`,
      );
      return;
    }

    const { error: erroHistorico } = await supabase
      .from("frete_historico")
      .insert({
        frete_id: freteId,
        motorista_id: null,
        acao: "Frete criado",
        observacao: "Entrega criada pela empresa",
      });

    if (erroHistorico) {
      setSalvando(false);
      setMensagemSalvar(
        `Frete salvo, mas erro ao salvar histórico: ${erroHistorico.message}`,
      );
      return;
    }

    window.dispatchEvent(new Event("fretesAtualizados"));
    setSalvando(false);
    fechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border sm:max-w-[980px] sm:rounded-[30px] ${ui.card}`}
      >
        <header
          className={`flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-5 ${ui.linha}`}
        >
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Nova Entrega</h2>
            <p className={`mt-1 text-xs sm:text-sm ${ui.textoFraco}`}>
              Digite CEP ou endereço. O sistema preenche automaticamente quando
              encontrar.
            </p>
          </div>

          <button
            onClick={fechar}
            className={`rounded-xl border p-2.5 sm:p-3 ${ui.card2}`}
          >
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.8fr]">
            <div className="space-y-4 sm:space-y-5">
              <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#ffc400]/50 bg-[#ffc400]/15 px-4 font-black text-[#ffc400] transition hover:bg-[#ffc400]/20">
                <FileSearch size={22} />
                {lendoNota ? "Lendo nota fiscal..." : "Ler nota fiscal"}
                <input
                  ref={inputNotaRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                  onChange={(event) =>
                    lerNotaFiscal(event.target.files?.[0] || null)
                  }
                  className="hidden"
                />
              </label>

              {(arquivoNota || lendoNota || notaProcessada || erroNota) && (
                <NotaFiscalCard
                  ui={ui}
                  nomeArquivo={arquivoNota?.name || "Nota fiscal"}
                  lendo={lendoNota}
                  ok={notaConferidaOk}
                  erro={erroNota}
                  origemOk={enderecoOrigemOk}
                  destinoOk={enderecoDestinoOk}
                  origem={origem || cepOrigem}
                  destino={destino || cepDestino}
                  textoNota={textoNota}
                  confirmado={notaConfirmada}
                  onConfirmar={confirmarNotaFiscal}
                  onLimpar={limparNotaFiscal}
                />
              )}

              <div>
                <ClienteSelect
                  ui={ui}
                  label="Cliente"
                  value={clienteId}
                  onChange={setClienteId}
                  clientes={clientes}
                  carregando={carregandoClientes}
                />

                {erroClientes && (
                  <p className="mt-2 text-xs font-bold text-red-400">
                    {erroClientes}
                  </p>
                )}

                {!carregandoClientes && clientes.length === 0 && !erroClientes && (
                  <p className="mt-2 text-xs font-bold text-[#ffc400]">
                    Nenhum cliente da empresa cadastrado ainda. Cadastre em Empresa &gt; Clientes antes de salvar a entrega.
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <Campo
                    ui={ui}
                    icon={<MapPin size={18} className="text-green-500" />}
                    label="Origem"
                    placeholder="Digite CEP ou endereço de origem"
                    value={origem}
                    onChange={(valor: string) =>
                      buscarEndereco(valor, "origem")
                    }
                  />

                  {carregandoOrigem && (
                    <p className="mt-2 text-xs font-bold text-[#ffc400]">
                      Buscando origem...
                    </p>
                  )}

                  {sugestoesOrigem.length > 0 && (
                    <Sugestoes
                      sugestoes={sugestoesOrigem}
                      onSelecionar={(item) =>
                        selecionarSugestao(item, "origem")
                      }
                    />
                  )}
                </div>

                <div>
                  <Campo
                    ui={ui}
                    icon={<MapPin size={18} className="text-red-500" />}
                    label="Destino"
                    placeholder="Digite CEP ou endereço de destino"
                    value={destino}
                    onChange={(valor: string) =>
                      buscarEndereco(valor, "destino")
                    }
                  />

                  {carregandoDestino && (
                    <p className="mt-2 text-xs font-bold text-[#ffc400]">
                      Buscando destino...
                    </p>
                  )}

                  {sugestoesDestino.length > 0 && (
                    <Sugestoes
                      sugestoes={sugestoesDestino}
                      onSelecionar={(item) =>
                        selecionarSugestao(item, "destino")
                      }
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <Campo
                  ui={ui}
                  icon={<MapPin size={18} />}
                  label="CEP de origem"
                  placeholder="Ex: 01001-000"
                  value={cepOrigem}
                  onChange={(valor: string) => alterarCep(valor, "origem")}
                />

                <Campo
                  ui={ui}
                  icon={<MapPin size={18} />}
                  label="CEP de destino"
                  placeholder="Ex: 01310-000"
                  value={cepDestino}
                  onChange={(valor: string) => alterarCep(valor, "destino")}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <CampoDataBR
                  ui={ui}
                  icon={<CalendarDays size={18} />}
                  label="Data da coleta"
                  placeholder="Selecione a data"
                  value={data}
                  onChange={setData}
                />

                <Campo
                  ui={ui}
                  icon={<Clock size={18} />}
                  label="Horário"
                  placeholder="Digite o horário"
                  value={horario}
                  onChange={setHorario}
                  type="time"
                />

                <Campo
                  ui={ui}
                  icon={<DollarSign size={18} />}
                  label="Valor automático"
                  placeholder="R$ 0,00"
                  value={calculandoFrete ? "Calculando..." : valor}
                  onChange={() => {}}
                  readOnly
                />
              </div>

              {(calculandoFrete ||
                distanciaKm !== null ||
                erroCalculoFrete) && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${ui.card2}`}
                >
                  {calculandoFrete ? (
                    <p className="font-bold text-[#ffc400]">
                      Calculando distância e valor do frete...
                    </p>
                  ) : erroCalculoFrete ? (
                    <p className="font-bold text-red-400">{erroCalculoFrete}</p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-3">
                      <p>
                        <strong>Distância:</strong> {distanciaKm?.toFixed(2)} km
                      </p>
                      <p>
                        <strong>Motorista:</strong>{" "}
                        {formatarMoedaBR(valorMotorista)}
                      </p>
                      <p>
                        <strong>Empresa:</strong>{" "}
                        {formatarMoedaBR(valorEmpresa)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-4 sm:gap-4">
                <Campo
                  ui={ui}
                  icon={<Truck size={18} />}
                  label="Peso"
                  placeholder="Ex: 80 kg"
                  value={peso}
                  onChange={setPeso}
                />

                <Campo
                  ui={ui}
                  icon={<ClipboardList size={18} />}
                  label="Altura"
                  placeholder="Ex: 1,20 m"
                  value={altura}
                  onChange={setAltura}
                />

                <Campo
                  ui={ui}
                  icon={<ClipboardList size={18} />}
                  label="Largura"
                  placeholder="Ex: 0,80 m"
                  value={largura}
                  onChange={setLargura}
                />

                <Campo
                  ui={ui}
                  icon={<ClipboardList size={18} />}
                  label="Comprimento"
                  placeholder="Ex: 1,50 m"
                  value={comprimento}
                  onChange={setComprimento}
                />
              </div>

              <Campo
                ui={ui}
                icon={<Package size={18} />}
                label="Descrição da carga"
                placeholder="Ex: caixas, documentos, mercadorias..."
                value={descricaoCarga}
                onChange={setDescricaoCarga}
              />

              <SelectCampo
                ui={ui}
                label="Tipo de transporte"
                value={tipoTransporte}
                onChange={setTipoTransporte}
                options={tiposTransporte}
              />

              <div>
                <label
                  className={`mb-2 block text-sm font-bold ${ui.textoFraco}`}
                >
                  Observações da entrega
                </label>

                <div
                  className={`flex min-h-[96px] gap-3 rounded-2xl border px-4 py-3 sm:min-h-[110px] ${ui.card2}`}
                >
                  <ClipboardList size={18} className="mt-1 text-[#ffc400]" />
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: carga frágil, precisa de ajudante, entregar até 16h..."
                    className="min-h-[72px] flex-1 resize-none bg-transparent text-sm outline-none sm:min-h-[85px]"
                  />
                </div>
              </div>
            </div>

            <aside className={`rounded-[24px] border p-4 sm:p-5 ${ui.card2}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffc400] text-black sm:h-14 sm:w-14">
                <Navigation size={26} />
              </div>

              <h3 className="mt-4 text-lg font-black sm:mt-5 sm:text-xl">
                Resumo rápido
              </h3>

              <p className={`mt-2 text-sm ${ui.textoFraco}`}>
                Ao salvar, a entrega será gravada no Supabase e aparecerá na
                lista.
              </p>

              <div
                className={`mt-4 space-y-3 border-t pt-4 sm:mt-5 sm:pt-5 ${ui.linha}`}
              >
                <ResumoLinha label="Status inicial" valor="Aguardando" />
                <ResumoLinha
                  label="Cliente"
                  valor={
                    clientes.find((cliente) => cliente.id === clienteId)?.nome ||
                    "Selecione o cliente"
                  }
                />
                <ResumoLinha label="Origem" valor={origem || "A preencher"} />
                <ResumoLinha label="Destino" valor={destino || "A preencher"} />
                <ResumoLinha
                  label="Carga"
                  valor={descricaoCarga || "Carga geral"}
                />
                <ResumoLinha label="Peso" valor={peso || "A preencher"} />
                <ResumoLinha
                  label="Cubagem"
                  valor={
                    altura || largura || comprimento
                      ? `${altura || "0"} x ${largura || "0"} x ${comprimento || "0"}`
                      : "A preencher"
                  }
                />
                <ResumoLinha label="Valor total" valor={valor} />
                {distanciaKm !== null && (
                  <ResumoLinha
                    label="Distância"
                    valor={`${distanciaKm.toFixed(2)} km`}
                  />
                )}
                {valorMotorista !== null && (
                  <ResumoLinha
                    label="Motorista"
                    valor={formatarMoedaBR(valorMotorista)}
                  />
                )}
                {valorEmpresa !== null && (
                  <ResumoLinha
                    label="Empresa"
                    valor={formatarMoedaBR(valorEmpresa)}
                  />
                )}
                <ResumoLinha
                  label="Transporte"
                  valor={
                    <span className="flex items-center justify-end gap-2">
                      <IconeTransporte tipo={tipoTransporte} size={16} />
                      {tipoTransporte || "A definir"}
                    </span>
                  }
                />
              </div>

              {mensagemSalvar && (
                <p className="mt-5 rounded-xl border border-[#ffc400]/30 bg-[#ffc400]/10 p-3 text-center text-xs font-bold text-[#ffc400]">
                  {mensagemSalvar}
                </p>
              )}

              <button
                type="button"
                onClick={salvarEntrega}
                disabled={salvando}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] font-black text-black disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6"
              >
                <Save size={19} />
                {salvando ? "Salvando..." : "Salvar Entrega"}
              </button>

              <button
                onClick={fechar}
                className={`mt-3 h-12 w-full rounded-xl border font-bold ${ui.card2}`}
              >
                Cancelar
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotaFiscalCard({
  ui,
  nomeArquivo,
  lendo,
  ok,
  erro,
  origemOk,
  destinoOk,
  origem,
  destino,
  textoNota,
  confirmado,
  onConfirmar,
  onLimpar,
}: any) {
  return (
    <div className={`rounded-2xl border p-4 ${ui.card2}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[#ffc400]">
            Conferência da nota fiscal
          </p>
          <h3 className="mt-1 text-sm font-black">{nomeArquivo}</h3>
          <p className={`mt-1 text-xs ${ui.textoFraco}`}>
            {lendo
              ? "Lendo a nota e tentando preencher origem e destino..."
              : erro
                ? erro
                : ok
                  ? confirmado
                    ? "Nota confirmada. Esses endereços serão mantidos na entrega."
                    : "Endereços encontrados. Clique no ✓ para confirmar ou no X para apagar e tentar de novo."
                  : "Nota lida. Confira os campos antes de salvar."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!lendo && (
            <>
              <button
                type="button"
                onClick={onLimpar}
                title="Apagar dados da nota"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/45 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
              >
                <X size={22} strokeWidth={3} />
              </button>

              <button
                type="button"
                onClick={onConfirmar}
                disabled={!ok}
                title="Confirmar dados da nota"
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                  ok
                    ? "border-green-500/45 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/25"
                }`}
              >
                <Check size={22} strokeWidth={3} />
              </button>
            </>
          )}

          {lendo && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ffc400]/40 bg-[#ffc400]/10 text-xl text-[#ffc400]">
              …
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/10 p-3">
          <p className="text-xs font-black text-white/45">Origem</p>
          <p className="mt-1 text-sm font-bold">
            {origemOk ? origem : "Não encontrada"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-3">
          <p className="text-xs font-black text-white/45">Destino</p>
          <p className="mt-1 text-sm font-bold">
            {destinoOk ? destino : "Não encontrado"}
          </p>
        </div>
      </div>

      {textoNota && (
        <details className="mt-3 rounded-xl border border-white/10 bg-black/10 p-3">
          <summary className="cursor-pointer text-xs font-black text-[#ffc400]">
            Ver texto lido da nota
          </summary>
          <p className="mt-2 max-h-28 overflow-y-auto whitespace-pre-wrap text-xs opacity-70">
            {textoNota}
          </p>
        </details>
      )}
    </div>
  );
}



function ClienteSelect({
  ui,
  label,
  value,
  onChange,
  clientes,
  carregando,
}: any) {
  return (
    <label>
      <span
        className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}
      >
        {label}
      </span>

      <div
        className={`flex h-11 items-center gap-3 rounded-2xl border px-3 sm:h-12 sm:px-4 ${ui.card2}`}
      >
        <span className="text-[#ffc400]">
          <ClipboardList size={18} />
        </span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          <option value="" className="bg-black text-white">
            {carregando ? "Carregando clientes..." : "Selecione o cliente"}
          </option>

          {clientes.map((cliente: ClienteSupabase) => (
            <option key={cliente.id} value={cliente.id} className="bg-black text-white">
              {cliente.nome || cliente.responsavel || cliente.documento || cliente.email || cliente.telefone || "Cliente sem nome"}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}



function CampoDataBR({
  ui,
  icon,
  label,
  placeholder,
  value,
  onChange,
}: any) {
  return (
    <label>
      <span
        className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}
      >
        {label}
      </span>

      <div
        className={`relative flex h-11 items-center gap-3 rounded-2xl border px-3 sm:h-12 sm:px-4 ${ui.card2}`}
      >
        <span className="text-[#ffc400]">{icon}</span>

        <input
          type="text"
          value={formatarDataBR(value)}
          readOnly
          placeholder={placeholder}
          className="pointer-events-none w-full bg-transparent text-sm outline-none"
        />

        <input
          type="date"
          lang="pt-BR"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </label>
  );
}

function Campo({
  ui,
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: any) {
  return (
    <label>
      <span
        className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}
      >
        {label}
      </span>

      <div
        className={`flex h-11 items-center gap-3 rounded-2xl border px-3 sm:h-12 sm:px-4 ${ui.card2}`}
      >
        <span className="text-[#ffc400]">{icon}</span>
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-sm outline-none ${readOnly ? "cursor-not-allowed opacity-90" : ""}`}
        />
      </div>
    </label>
  );
}

function SelectCampo({ ui, label, value, onChange, options }: any) {
  return (
    <label>
      <span
        className={`mb-2 block text-xs font-bold sm:text-sm ${ui.textoFraco}`}
      >
        {label}
      </span>

      <div
        className={`flex h-11 items-center gap-3 rounded-2xl border px-3 sm:h-12 sm:px-4 ${ui.card2}`}
      >
        <span className="text-[#ffc400]">
          <IconeTransporte tipo={value} size={18} />
        </span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          <option value="" className="bg-black text-white">
            Selecione o tipo de transporte
          </option>

          {options.map((option: string) => (
            <option key={option} value={option} className="bg-black text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Sugestoes({
  sugestoes,
  onSelecionar,
}: {
  sugestoes: SugestaoLocalizacao[];
  onSelecionar: (item: SugestaoLocalizacao) => void;
}) {
  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-[#ffc400]/25 bg-black/80">
      {sugestoes.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelecionar(item)}
          className="w-full border-b border-white/10 px-4 py-3 text-left text-xs text-white/80 last:border-b-0"
        >
          📍 {item.display_name}
        </button>
      ))}
    </div>
  );
}

function ResumoLinha({ label, valor }: any) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="opacity-60">{label}</span>
      <strong className="max-w-[180px] text-right text-xs sm:text-sm">
        {valor}
      </strong>
    </div>
  );
}
