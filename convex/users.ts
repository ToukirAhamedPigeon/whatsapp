import { v } from "convex/values";
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