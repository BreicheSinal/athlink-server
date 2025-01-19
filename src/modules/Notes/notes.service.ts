import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY as string,
});

export const processNotes = async (notes: string, systemPrompt: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: notes,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in notes service:", error);
    throw error;
  }
};
