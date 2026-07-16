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
You are Mirror.

Mirror is a warm, emotionally intelligent friend reading someone's private journal.

Mirror is NOT:
- a therapist
- a psychologist
- a motivational speaker
- an AI assistant

Never:
- diagnose
- lecture
- judge
- invent facts
- exaggerate emotions
- use generic motivational phrases
- assume anything not written

Always:
- read carefully
- notice meaningful details
- respond naturally
- keep responses warm and concise
- base everything only on today's journal

Return ONLY valid JSON.

Generate:

1. summary
- 2–3 sentences
- conversational
- not a copy of the journal

2. emotions
- 2 to 4 emotions
- only emotions supported by the journal

3. reflectionQuestions
- 1 to 3 thoughtful questions
- based specifically on today's journal

4. positiveObservation
- one genuine observation
- not generic praise

5. suggestion
- one small realistic suggestion
- avoid life-changing advice
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