"use server"

import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk"

type Question = {
  question: string
  answer: string
  explanation: string
}

// type QA = {
//   question: string
//   answer: string
// }

type QA = {
  question: string
  answer: string
  score: number
  feedback: string
}


type EvaluatedQA = {
  question: string
  answer: string
  score: number
  feedback: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

const checkerGroq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY_ANSWER_CHECKER,
})

export async function generateQuestionsAction(
  field: string,
  specialty: string
): Promise<Question[]> {
  const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1)
  const specialtyLabel = specialty.charAt(0).toUpperCase() + specialty.slice(1)

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are a strict JSON generator and expert technical interviewer in ${fieldLabel}.

Rules:
- Output ONLY valid JSON
- Do NOT include markdown (no \`\`\`)
- Do NOT include explanations outside JSON
- Response must be directly parseable by JSON.parse()
          `.trim(),
        },
        {
          role: "user",
          content: `
Generate exactly 6 technical interview questions for:

Field: ${fieldLabel}
Specialty: ${specialtyLabel}

Difficulty distribution:
- 2 easy
- 2 medium
- 2 hard

Requirements:
- Open-ended only
- At least 2 scenario-based
- Real interview style

Return format:
[
  {
    "question": "string",
    "answer": "2-3 sentence answer",
    "explanation": "key concepts"
  }
]

Strict:
- No markdown
- No extra text
- Valid JSON only
          `.trim(),
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ""

    // 🔒 Sanitize
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    // 🔒 Extract JSON safely
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (!match) {
      console.error("RAW:", raw)
      throw new Error("No valid JSON array found")
    }

    const parsed: Question[] = JSON.parse(match[0])

    // 🔒 Basic validation
    if (!Array.isArray(parsed) || parsed.length !== 6) {
      throw new Error("Invalid question format")
    }

    return parsed
  } catch (err) {
    console.error("Generation failed:", err)
    throw new Error("Failed to generate questions")
  }
}




export async function checkAnswerAction(
  qaPairs: QA[]
): Promise<EvaluatedQA[]> {

  try {
    const response = await checkerGroq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an evaluator."
        },
        {
          role: "user",
          content: `
You are an expert interviewer.

Evaluate each question-answer pair.

Rules:
- Score must be between 0 and 5
- Feedback must explain WHY the answer is correct or incorrect with a fun tone
- Feedback must be at least 2 sentences
- Feedback must NEVER be null or empty
- Even if the answer is completely wrong or irrelevant, you MUST explain why

Return ONLY valid JSON. No extra text.

Format:
[
  {
    "question": string,
    "answer": string,
    "score": number,
    "feedback": string
  }
]

Evaluate:
${JSON.stringify(qaPairs)}
          `
        }
      ]
    })

    const text = response.choices[0]?.message?.content || "[]"

    let parsed: EvaluatedQA[] = []

    try {
      parsed = JSON.parse(text)
    } catch (err) {
      console.error("Invalid JSON from AI:", text)
      throw err
    }

    return parsed

  } catch (err) {
    console.error(err)
    throw err
  }
}




export async function saveSessionAction(
  field: string,
  domain: string,
  qa: QA[]
) {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()

  if (!user.data.user) {
    throw new Error("User not authenticated")
  }

  const total_questions = qa.length
  const correct_answers = qa.filter(q => q.score >= 3).length
  const score = qa.reduce((sum, q) => sum + q.score, 0)

  const { error } = await supabase.from("sessions").insert({
    user_id: user.data.user.id,
    field,
    domain,
    qa,
    score,
    total_questions,
    correct_answers
  })

  if (error) {
    console.error("Supabase insert error:", error)
    throw new Error("Failed to save session")
  }
}