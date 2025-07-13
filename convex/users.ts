import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createUser = internalMutation({
	args: {
		name: v.optional(v.string()),
		email: v.string(),
		image: v.string(),
		tokenIdentifier: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db.insert("users", 
            {
                name: args.name,
                email: args.email,
                image: args.image,
                tokenIdentifier: args.tokenIdentifier,
                isOnline: true,
            }
        );
		return user;
	},
});

export const updateUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		image: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();
		if (!user) {
			throw new ConvexError("User not found");
		}
		await ctx.db.patch(user._id, {
			image: args.image,
		});
	}
})

export const setUserOffline = internalMutation({
	args: {
		tokenIdentifier: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();
		if (!user) {
			throw new ConvexError("User not found");
		}
		await ctx.db.patch(user._id, {
			isOnline: false,
		});
	}
})

export const setUserOnline = internalMutation({
	args: {
		tokenIdentifier: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();
		if (!user) {
			throw new ConvexError("User not found");
		}
		await ctx.db.patch(user._id, {
			isOnline: true,
		});
	}
})

export const getUsers = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}
		const users = await ctx.db.query("users").collect();
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	}
})

export const getMe = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
			if (!user) {
				throw new Error("User not found");
			}
		return user;
	}
})

export const getGroupMembers = query({
	args: {
		conversationId: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Not authenticated");
		}
		const conversation = await ctx.db.query("conversations").filter(q => q.eq(q.field("_id"), args.conversationId)).first();
		if (!conversation) {
			throw new ConvexError("Conversation not found");
		}
		const users = await ctx.db.query("users").collect();
		const groupMembers = users.filter((user) => conversation.participants.includes(user._id));
		return groupMembers;
	}
})