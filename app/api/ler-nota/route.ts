import { NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

function limparTexto(texto: string) {
  return texto
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n")
    .trim()
}

function pegarPrimeiroCep(texto: string) {
  const ceps = texto.match(/\d{5}-?\d{3}/g) || []
  return ceps[0] || ""
}

function pegarTodosCeps(texto: string) {
  return texto.match(/\d{5}-?\d{3}/g) || []
}

function acharLinhaDepoisDe(linhas: string[], palavra: string) {
  const index = linhas.findIndex((linha) =>
    linha.toLowerCase().includes(palavra.toLowerCase())
  )

  if (index === -1) return ""

  for (let i = index + 1; i < linhas.length; i++) {
    const linha = linhas[i]

    if (
      linha &&
      !/nome|razão|cnpj|cpf|data|bairro|município|municipio|uf|cep/i.test(linha)
    ) {
      return linha
    }
  }

  return ""
}

function acharEnderecoDestinatario(texto: string) {
  const match = texto.match(/ENDEREÇO\s*\n?(.+?)(?:\n|BAIRRO|MUNICÍPIO|MUNICIPIO|UF|CEP)/i)
  return match?.[1]?.trim() || ""
}

function acharMunicipioDestinatario(texto: string) {
  const match = texto.match(/MUNIC[IÍ]PIO\s*\n?(.+?)(?:\n|UF|CEP)/i)
  return match?.[1]?.trim() || ""
}

function acharEnderecoEmitente(linhas: string[]) {
  const linhaComCep = linhas.find((linha) =>
    /\d{5}-?\d{3}/.test(linha) && !/destinat|remetente/i.test(linha)
  )

  if (!linhaComCep) return ""

  const index = linhas.indexOf(linhaComCep)
  const anterior1 = linhas[index - 1] || ""
  const anterior2 = linhas[index - 2] || ""

  const partes = [anterior2, anterior1, linhaComCep].filter(Boolean)

  return partes.join(" - ")
}

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

    const textoEncontrado = limparTexto(resultado.data.text || "")

    const linhas = textoEncontrado
      .split("\n")
      .map((linha) => linha.trim())
      .filter(Boolean)

    const ceps = pegarTodosCeps(textoEncontrado)

    const enderecoEmitente = acharEnderecoEmitente(linhas)
    const enderecoDestinatario = acharEnderecoDestinatario(textoEncontrado)
    const municipioDestinatario = acharMunicipioDestinatario(textoEncontrado)

    const dadosExtraidos = {
      localSaida: enderecoEmitente || acharLinhaDepoisDe(linhas, "IDENTIFICAÇÃO DO EMITENTE"),
      cepOrigem: ceps[0] || "",
      destinoFinal: [enderecoDestinatario, municipioDestinatario].filter(Boolean).join(" - "),
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