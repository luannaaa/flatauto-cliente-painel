import { NextResponse } from "next/server"

type TipoVeiculo = "moto" | "carro" | "van" | "caminhao" | "truck" | "carreta"

const PRECOS: Record<TipoVeiculo, { base: number; km: number; minimo: number }> = {
  moto: { base: 8, km: 2.5, minimo: 15 },
  carro: { base: 12, km: 3.5, minimo: 25 },
  van: { base: 25, km: 5.5, minimo: 60 },
  caminhao: { base: 45, km: 8, minimo: 120 },
  truck: { base: 70, km: 11, minimo: 180 },
  carreta: { base: 120, km: 16, minimo: 300 },
}

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const raioTerraKm = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return raioTerraKm * c
}

async function buscarCoordenadas(endereco: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    endereco
  )}&limit=1&countrycodes=br`

  const resposta = await fetch(url, {
    headers: {
      "User-Agent": "FlatAuto/1.0",
    },
  })

  const dados = await resposta.json()

  if (!dados || !dados[0]) return null

  return {
    lat: Number(dados[0].lat),
    lon: Number(dados[0].lon),
  }
}

function normalizarTipoVeiculo(tipo: string): TipoVeiculo {
  const texto = String(tipo || "").toLowerCase()

  if (texto.includes("moto")) return "moto"
  if (texto.includes("carro")) return "carro"
  if (texto.includes("van")) return "van"
  if (texto.includes("truck")) return "truck"
  if (texto.includes("carreta")) return "carreta"
  if (texto.includes("caminh")) return "caminhao"

  return "carro"
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const origem = body.origem || body.cep_origem
    const destino = body.destino || body.cep_destino
    const tipoVeiculo = normalizarTipoVeiculo(body.tipo_transporte || body.tipo_veiculo)

    if (!origem || !destino) {
      return NextResponse.json({ erro: "Informe origem e destino." }, { status: 400 })
    }

    const coordenadaOrigem = await buscarCoordenadas(origem)
    const coordenadaDestino = await buscarCoordenadas(destino)

    if (!coordenadaOrigem || !coordenadaDestino) {
      return NextResponse.json(
        { erro: "Não foi possível calcular a distância." },
        { status: 400 }
      )
    }

    const distanciaKm = calcularDistanciaKm(
      coordenadaOrigem.lat,
      coordenadaOrigem.lon,
      coordenadaDestino.lat,
      coordenadaDestino.lon
    )

    const tabela = PRECOS[tipoVeiculo]
    const valorCalculado = tabela.base + distanciaKm * tabela.km
    const valorTotal = Math.max(valorCalculado, tabela.minimo)

    const valorMotorista = valorTotal * 0.8
    const valorEmpresa = valorTotal * 0.2

    return NextResponse.json({
      tipo_veiculo: tipoVeiculo,
      distancia_km: Number(distanciaKm.toFixed(2)),
      valor_total: Number(valorTotal.toFixed(2)),
      valor_motorista: Number(valorMotorista.toFixed(2)),
      valor_empresa: Number(valorEmpresa.toFixed(2)),
      taxa_base: tabela.base,
      preco_por_km: tabela.km,
      valor_minimo: tabela.minimo,
    })
  } catch {
    return NextResponse.json({ erro: "Erro ao calcular frete." }, { status: 500 })
  }
}