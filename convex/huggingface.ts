import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const openai = new OpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY, // Your Hugging Face or Fireworks token
  baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
});

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const res = await openai.chat.completions.create({
      model: "accounts/fireworks/models/deepseek-r1-0528", // Fireworks model name
      messages: [
        {
          role: "system",
          content:
            "You are a terse bot in a group chat responding to questions with max 3-sentence answers.",
        },
        {
          role: "user",
          content: args.messageBody,
        },
      ],
    });

    const rawContent = res.choices[0]?.message?.content ?? "I'm sorry, I couldn't answer that.";
    const messageContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    await ctx.runMutation(api.messages.sendChatGPTMessage, {
      content: messageContent,
      conversation: args.conversation,
    });
  },
});

// import { v } from "convex/values";
// import { action } from "./_generated/server";
// import { api } from "./_generated/api";

// export const chat = action({
//   args: {
//     messageBody: v.string(),
//     conversation: v.id("conversations"),
//   },
//   handler: async (ctx, args) => {
//     const systemPrompt =
//       "You are a terse bot in a group chat responding to questions with max 3-sentence answers.";
//     const userPrompt = args.messageBody;

//     const combinedPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;

//     const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: combinedPrompt,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();
//     const messageContent = result[0]?.generated_text || "No response";

//     await ctx.runMutation(api.messages.sendChatGPTMessage, {
//       content: messageContent,
//       conversation: args.conversation,
//     });
//   },
// });