export const freteAoVivo = {
  codigo: "FLA-1024",
  cliente: "Auto Peças Brasil",
  empresa: "Auto Peças Brasil",
  motorista: "Carlos Henrique",
  veiculo: "VUC",
  tipoVeiculo: "caminhao" as const,
  placa: "RTA-4H22",

  status: "em_rota",
  statusTexto: "Em rota",
  valor: "R$ 380,00",

  previsao: "18 min",
  distancia: "7,4 km",
  progresso: 65,

  origem: "Av. Paulista",
  destino: "Moema",

  notaFiscal: "NF-e 000123",
  coletaPrevista: "14:30",
  entregaPrevista: "15:10",

  posicaoAtual: "Av. Brigadeiro Luís Antônio",
  ultimaAtualizacao: "Atualizado agora",
}

export const etapasFrete = [
  { id: "solicitado", titulo: "Solicitado", texto: "Frete criado pelo cliente." },
  { id: "aceito", titulo: "Aceito", texto: "Motorista aceitou a corrida." },
  { id: "coleta", titulo: "Coleta", texto: "Motorista está indo buscar a carga." },
  { id: "em_rota", titulo: "Em rota", texto: "Carga em transporte." },
  { id: "entregue", titulo: "Entregue", texto: "Entrega concluída." },
]

export function etapaAtiva(status: string, etapaId: string) {
  const ordem = ["solicitado", "aceito", "coleta", "em_rota", "entregue"]
  return ordem.indexOf(etapaId) <= ordem.indexOf(status)
}