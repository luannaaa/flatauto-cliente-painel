import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const arquivo = formData.get("arquivo") as File | null

    if (!arquivo) {
      return NextResponse.json(
        { erro: "Nenhum arquivo enviado." },
        { status: 400 }
      )
    }

    const dadosExtraidos = {
      localSaida: "AVENIDA DAS NAÇÕES, 1250 - CURITIBA - PR",
      cepOrigem: "81200-260",
      destinoFinal: "RUA DAS FLORES, 320 - SÃO JOSÉ DOS PINHAIS - PR",
      cepDestino: "83005-120",
      textoEncontrado:
        "Leitura de teste concluída. Palavras-chave encontradas: EMITENTE, DESTINATÁRIO, ENDEREÇO e CEP.",
      nomeArquivo: arquivo.name,
    }

    return NextResponse.json(dadosExtraidos)
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao processar a nota fiscal." },
      { status: 500 }
    )
  }
}