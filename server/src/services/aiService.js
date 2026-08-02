const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

/* -------------------------------------------------------------------------- */
/*                           Crisis Safety Detection                           */
/* -------------------------------------------------------------------------- */

const CRISIS_PATTERNS = [
    /\bkill myself\b/i,
    /\bsuicid(e|al)\b/i,
    /\bend my life\b/i,
    /\bwant to die\b/i,
    /\bself[\s-]?harm\b/i,
    /\bhurt(ing)? myself\b/i,
];

function containsCrisisLanguage(content) {
    return CRISIS_PATTERNS.some((pattern) => pattern.test(content));
}

function getCrisisSafetyReflection() {
    return {
        summary:
            "Thank you for writing this down. It sounds like you're carrying something really heavy today.",

        emotions: ["Distressed"],

        reflectionQuestions: [],

        positiveObservation:
            "Writing honestly about painful feelings takes courage.",

        suggestion:
            "If you're feeling unsafe or thinking about hurting yourself, please reach out to someone you trust or contact a local crisis support service immediately. You don't have to go through this alone.",
    };
}

/* -------------------------------------------------------------------------- */
/*                              Response Schema                               */
/* -------------------------------------------------------------------------- */

const reflectionSchema = {
    type: Type.OBJECT,

    properties: {
        summary: {
            type: Type.STRING,
        },

        emotions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
        },

        reflectionQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
        },

        positiveObservation: {
            type: Type.STRING,
        },

        suggestion: {
            type: Type.STRING,
        },
    },

    required: [
        "summary",
        "emotions",
        "reflectionQuestions",
        "positiveObservation",
        "suggestion",
    ],
};

/* -------------------------------------------------------------------------- */
/*                              Mirror Personality                            */
/* -------------------------------------------------------------------------- */

const SYSTEM_INSTRUCTION = `
You are Mirror — a warm, emotionally present friend reading someone's private journal.

Voice:
- Write like a real person who knows them, not a report. Use contractions (you're, that's, I'm noticing).
- Vary your sentence rhythm — mix short and long sentences. Don't open every response the same way.
- Quote back a specific phrase or detail they actually wrote, when it helps them feel truly heard.
- A little warmth goes further than a lot of analysis. Let genuine care come through, not clinical distance.
- You may use a single emoji occasionally, only when it fits naturally (e.g. after a genuinely warm line) — never more than one, never forced, never in every section.

Mirror is NOT a therapist, psychologist, motivational speaker, or AI assistant.
Never diagnose, lecture, judge, invent facts, or exaggerate emotions.
Never use generic phrases like "it sounds like," "that must be tough," or "stay positive" as an opener — vary how you begin.

Base everything only on today's journal entry. Return ONLY valid JSON.

Generate:
1. summary — 2-3 sentences, feels like a friend reflecting your day back to you, in their own words
2. emotions — 2 to 4 emotions, only ones actually supported by the entry
3. reflectionQuestions — 1 to 3 questions that come from real curiosity about *this specific entry*, not generic prompts
4. positiveObservation — one genuine, specific observation — not generic praise
5. suggestion — one small, realistic next step, not life-changing advice
`;

/* -------------------------------------------------------------------------- */
/*                         Generate AI Reflection                             */
/* -------------------------------------------------------------------------- */

async function generateReflection(content) {

    if (containsCrisisLanguage(content)) {
        return getCrisisSafetyReflection();
    }

    try {

        console.log(`Using Gemini model: ${MODEL}`);

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: content,

            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: reflectionSchema,
            },
        });

        const reflection = JSON.parse(response.text.trim());

        return reflection;

    } catch (error) {

        console.error("Gemini Error:", error);

        if (error.status === 429) {
            throw new Error("AI rate limit exceeded. Please try again later.");
        }

        if (error.status === 503) {
            throw new Error("AI service is temporarily busy. Please try again in a few moments.");
        }

        throw new Error("Failed to generate AI reflection.");
    }
}

module.exports = {
    generateReflection,
};