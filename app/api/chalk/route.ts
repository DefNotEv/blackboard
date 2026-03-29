import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getBoardsForSchoolFromStore } from "@/lib/boards-store";
import { listOpenPositions } from "@/lib/paper-trading-server";
import { getPaperState } from "@/lib/paper-trading-state";
import { getUserSchool } from "@/lib/user-school";

type ChalkRequest = {
  message?: unknown;
};

const MODEL = "gemini-2.5-flash";

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY in environment." },
        { status: 500 },
      );
    }

    const user = await currentUser();
    const school = getUserSchool(user);

    if (!school) {
      return Response.json(
        {
          error:
            "Choose your school first so Chalk can analyze campus-specific boards.",
        },
        { status: 400 },
      );
    }

    const boards = await getBoardsForSchoolFromStore(school.universityId);
    if (boards.length === 0) {
      return Response.json(
        {
          error:
            "No boards are available for your school yet. Add some and try again.",
        },
        { status: 400 },
      );
    }

    const body = (await request.json()) as ChalkRequest;
    const message =
      typeof body.message === "string" && body.message.trim().length > 0
        ? body.message.trim()
        : "Which campus trades look most interesting right now?";
    const openPositions = user?.id
      ? (await listOpenPositions(await getPaperState(user.id))).map((row) => ({
          boardId: row.boardId,
          title: row.board.title,
          side: row.position.side,
          qty: row.position.qty,
          avgEntryCents: row.position.avgEntryCents,
          markCents: row.position.side === "yes" ? row.board.yesPct : 100 - row.board.yesPct,
          unrealizedCents: row.unrealizedCents,
        }))
      : [];

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are Chalk, a campus trading assistant for Blackboard.
Provide educational analysis only, not guaranteed returns or personalized financial advice.

User context:
- school: ${school.universityName} (${school.universityId})

Campus boards:
${JSON.stringify(boards)}

User open positions:
${JSON.stringify(openPositions)}

User question:
${message}

Response rules:
- Return plain text in friendly markdown (no JSON, no code blocks).
- Start with a 1-line disclaimer.
- Give "Top ideas" as 2-4 bullets tied to specific campus boards by title.
- For each idea include: why it may be interesting, one key risk, and a suggested sizing caution.
- If data is thin, say exactly what extra info would improve confidence.
- End with 2 follow-up questions for the user.
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const answer = (result.text ?? "").trim();
    if (!answer) {
      return Response.json(
        { error: "Chalk did not return a response." },
        { status: 502 },
      );
    }

    return Response.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
