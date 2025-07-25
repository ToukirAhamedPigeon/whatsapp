import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const sendTextMessage = mutation({
    args:{
        sender:v.string(),
        content:v.string(),
        conversation:v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Called sendTextMessage without authentication present");
        }
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("Called sendTextMessage but no user was found");
        }
        const conversation = await ctx.db.query("conversations").filter(q => q.eq(q.field("_id"), args.conversation)).first();
        if(!conversation){
            throw new ConvexError("Conversation not found");
        }
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("User is not a member of the conversation");
        }

        await ctx.db.insert("messages", {
            sender:args.sender,
            content:args.content,
            conversation:args.conversation,
            messageType:"text",
        })

        //Todo => Add @gpt check later
        if(args.content.startsWith("@ai")){
            await ctx.scheduler.runAfter(0,
                //  api.openai.chat,
                 api.huggingface.chat,
                 {
                    messageBody:args.content,
                    conversation: args.conversation,
                })
        }

        if(args.content.startsWith("@img")){
            await ctx.scheduler.runAfter(0,
                //  api.openai.chat,
                 api.huggingface.image,
                 {
                    messageBody:args.content,
                    conversation: args.conversation,
                })
        }
    }
})

export const sendAIMessage = mutation({
    args:{
        content:v.string(),
        conversation: v.id("conversations"),
        messageType:v.union(
            v.literal("text"),
            v.literal("image"),
            // v.literal("video"),
        )
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            sender:"AI",
            content:args.content,
            conversation:args.conversation,
            messageType:args.messageType,
        })
    }
})
//Optimized

export const getMessages = query({
    args:{
        conversation:v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Called getMessages without authentication present");
        }
        const messages = await ctx.db.query("messages").withIndex("by_conversation", q => q.eq("conversation", args.conversation)).collect();

        const userProfileCache = new Map();

        const messagesWithSender = await Promise.all(
            messages.map(async (message) => {
            if(message.sender === "AI"){
                const image = message.messageType === "text" ? "/ai.png" : "/imageAI.png";
                return {
                    ...message,
                    sender: {
                        name:"AI",
                        image:image,
                    }
                }
            }
            let sender;
            if(userProfileCache.has(message.sender)){
                sender = userProfileCache.get(message.sender);
            }else{
                sender = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("_id"), message.sender))
                .first();
            }
            return {
                ...message,
                sender,
            }
        }))
        return messagesWithSender;
    }
})


//unOptimized
// export const getMessages = query({
//     args:{
//         conversation:v.id("conversations"),
//     },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if(!identity){
//             throw new ConvexError("Called getMessages without authentication present");
//         }
//         const messages = await ctx.db.query("messages").withIndex("by_conversation", q => q.eq("conversation", args.conversation)).collect();

//         const messagesWithSender = await Promise.all(
//             messages.map(async (message) => {
//             const sender = await ctx.db
//             .query("users")
//             .filter((q) => q.eq(q.field("_id"), message.sender))
//             .first();
//             return {
//                 ...message,
//                 sender,
//             }
//         }))
//         return messagesWithSender;
//     }
// })

export const sendImage = mutation({
    args:{
       imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Called sendImage without authentication present");
        }
        const content = (await ctx.storage.getUrl(args.imgId)) as string;
        await ctx.db.insert("messages", {
            sender:args.sender,
            content,
            conversation:args.conversation,
            messageType:"image",
        })
    }
})

export const sendVideo = mutation({
    args:{
       videoId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Called sendImage without authentication present");
        }
        const content = (await ctx.storage.getUrl(args.videoId)) as string;
        await ctx.db.insert("messages", {
            sender:args.sender,
            content,
            conversation:args.conversation,
            messageType:"video",
        })
    }
})