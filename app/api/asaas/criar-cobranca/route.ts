import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const nome = body.nome || "Cliente FlatAuto"
    const cpfCnpj = body.cpfCnpj || "12345678909"
    const valor = body.valor || 50

    const apiKey = process.env.ASAAS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { erro: "ASAAS_API_KEY não configurada no .env.local" },
        { status: 500 }
      )
    }

    const clienteResponse = await fetch("https://api.asaas.com/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
      body: JSON.stringify({
        name: nome,
        cpfCnpj,
      }),
    })

    const cliente = await clienteResponse.json()

    if (!clienteResponse.ok) {
      return NextResponse.json(
        { erro: "Erro ao criar cliente no Asaas", detalhes: cliente },
        { status: 400 }
      )
    }

    const cobrancaResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
      body: JSON.stringify({
        customer: cliente.id,
        billingType: "PIX",
        value: valor,
        dueDate: new Date().toISOString().split("T")[0],
        description: "Frete FlatAuto",
      }),
    })

    const cobranca = await cobrancaResponse.json()

    if (!cobrancaResponse.ok) {
      return NextResponse.json(
        { erro: "Erro ao criar cobrança no Asaas", detalhes: cobranca },
        { status: 400 }
      )
    }

    return NextResponse.json({
      sucesso: true,
      cliente,
      cobranca,
    })
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro interno ao criar cobrança", detalhes: String(error) },
      { status: 500 }
    )
  }
}