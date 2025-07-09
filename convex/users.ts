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