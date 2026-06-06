import { NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

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

    const buffer = Buffer.from(await arquivo.arrayBuffer())

    const worker = await createWorker("por")
    const resultado = await worker.recognize(buffer)
    await worker.terminate()

    const textoEncontrado = resultado.data.text || ""

    const ceps = textoEncontrado.match(/\d{5}-?\d{3}/g) || []

    const linhas = textoEncontrado
      .split("\n")
      .map((linha) => linha.trim())
      .filter(Boolean)

    const linhasEndereco = linhas.filter((linha) =>
      /rua|avenida|av\.|rodovia|estrada|bairro|cep|nº|numero|número/i.test(linha)
    )

    const dadosExtraidos = {
      localSaida: linhasEndereco[0] || "",
      cepOrigem: ceps[0] || "",
      destinoFinal: linhasEndereco[1] || "",
      cepDestino: ceps[1] || "",
      textoEncontrado,
      nomeArquivo: arquivo.name,
    }

    return NextResponse.json(dadosExtraidos)
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao ler a nota fiscal com OCR." },
      { status: 500 }
    )
  }
}