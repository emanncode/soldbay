import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/** Inbox that receives public site questions. Override with QUESTIONS_INBOX in env. */
const QUESTIONS_INBOX =
  process.env.QUESTIONS_INBOX?.trim() || "olajubajeifeoluwa93@gmail.com"

/**
 * Forward question to inbox via FormSubmit (no SMTP setup required).
 * First use may require confirming the address once at formsubmit.co.
 */
async function forwardQuestionEmail(input: {
  name: string
  email: string
  question: string
}): Promise<{ ok: boolean; detail?: string }> {
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(QUESTIONS_INBOX)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          message: input.question,
          _subject: `Soldbay question from ${input.name}`,
          _replyto: input.email,
          _template: "table",
        }),
      },
    )

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return { ok: false, detail: text.slice(0, 200) || res.statusText }
    }
    return { ok: true }
  } catch (error) {
    console.error("Question email forward error:", error)
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "forward failed",
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const question = typeof body.question === "string" ? body.question.trim() : ""

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
    }
    if (!question || question.length < 10) {
      return NextResponse.json(
        { error: "Please enter a question (at least 10 characters)." },
        { status: 400 },
      )
    }
    if (question.length > 2000) {
      return NextResponse.json(
        { error: "Question is too long (max 2000 characters)." },
        { status: 400 },
      )
    }

    const created = await prisma.siteQuestion.create({
      data: { name, email, question },
    })

    const emailResult = await forwardQuestionEmail({ name, email, question })
    if (!emailResult.ok) {
      // Question is still stored — log and continue so the user isn't blocked
      console.error(
        "Question saved but email forward failed:",
        emailResult.detail,
        "inbox:",
        QUESTIONS_INBOX,
      )
    }

    return NextResponse.json(
      {
        id: created.id,
        emailed: emailResult.ok,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create question error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
