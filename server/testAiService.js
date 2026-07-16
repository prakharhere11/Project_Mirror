require("dotenv").config();

const { generateReflection } = require("./src/services/aiService");

async function test() {
  try {
    const result = await generateReflection(
      "Today was a really good day. I finally understood how React hooks work after weeks of confusion, and I felt genuinely proud of myself."
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}

test();