import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const busca = searchParams.get("q")

  if (!busca || busca.length < 3) {
    return NextResponse.json([])
  }

  try {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        busca
      )}&countrycodes=br&limit=5`,
      {
        headers: {
          "User-Agent": "FlatAuto",
        },
      }
    )

    const dados = await resposta.json()

    return NextResponse.json(dados)
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao buscar localização." },
      { status: 500 }
    )
  }
}