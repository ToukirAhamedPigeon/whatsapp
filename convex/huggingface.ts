import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { InferenceClient } from "@huggingface/inference";
import { generateUploadUrl } from "./conversations";

/// Use the generated image (it's a Blob)

const openai = new OpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY, // Your Hugging Face or Fireworks token
  // baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
  baseURL: "https://router.huggingface.co/together/v1",
});

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const res = await openai.chat.completions.create({
      // model: "accounts/fireworks/models/deepseek-r1-0528", // Fireworks model name
      model: "moonshotai/Kimi-K2-Instruct", // Fireworks model name
      messages: [
        {
          role: "system",
          content:
            "You are a terse bot in a group chat responding to questions with answers.",
        },
        {
          role: "user",
          content: args.messageBody,
        },
      ],
    });

    const rawContent = res.choices[0]?.message?.content ?? "I'm sorry, I couldn't answer that.";
    const messageContent = rawContent.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    await ctx.runMutation(api.messages.sendAIMessage, {
      content: messageContent,
      conversation: args.conversation,
      messageType: "text",
    });
  },
});

const client = new InferenceClient(
    process.env.HUGGINGFACE_API_KEY!,
);
  
export const image = action({
    args: {
      messageBody: v.string(),
      conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
      try {
        // Step 1: Generate image blob from model
        const imageBlob = await client.textToImage({
            provider: "replicate",
            model: "SG161222/Realistic_Vision_V5.1_noVAE",
          inputs: args.messageBody,
          parameters: {
            width: 1024,
            height: 1024,
            guidance_scale: 7.5,
            num_inference_steps: 5,
          },
        });
        console.log("Image blob:", imageBlob);
  
        // Step 2: Generate upload URL from Convex Storage
        const postUrl = await ctx.runMutation(api.conversations.generateUploadUrl);
  
        // Step 3: Upload image blob to Convex Storage
        const uploadResponse = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "image/png",  // Assuming PNG from the AI model
          },
          body: imageBlob,
        });
  
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }
  
        // Step 4: Extract storage ID from upload response
        const { storageId } = await uploadResponse.json();
  
        // Step 5: Compose the URL to access stored image (this depends on your Convex setup)
        const imageUrl = `/storage/${storageId}`;
  
        // Step 6: Send image URL message in the conversation
        await ctx.runMutation(api.messages.sendAIMessage, {
          content: imageUrl,
          conversation: args.conversation,
          messageType: "image",
        });
      } catch (error) {
        console.error("Image generation error:", error);
  
        await ctx.runMutation(api.messages.sendAIMessage, {
          content: "/failure.png",
          conversation: args.conversation,
          messageType: "image",
        });
      }
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