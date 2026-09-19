import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
	if (!import.meta.env.DEV && process.env.CFS_PREVIEW !== "1") {
		return context.redirect("https://sitcon.org/wip/cfs", 302);
	}

	return next();
});
