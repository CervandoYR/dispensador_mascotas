// ============================================================
// PetFeeder Pro — Telegram Notification API Route
// ============================================================
// POST /api/telegram
// Forwards critical alerts to a Telegram chat via the Bot API.

import { type NextRequest } from "next/server";

interface TelegramRequestBody {
  chatId: string;
  botToken: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramRequestBody;

    // Validate required fields
    if (!body.chatId || !body.botToken || !body.message) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: chatId, botToken, message",
        },
        { status: 400 }
      );
    }

    // Send message via Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${body.botToken}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: body.chatId,
        text: `🐾 *PetFeeder Pro Alert*\n\n${body.message}`,
        parse_mode: "Markdown",
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return Response.json(
        {
          success: false,
          error: `Telegram API error: ${telegramData.description}`,
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("[Telegram API] Error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
