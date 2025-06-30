import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./account"
import categories from "./categories"
import transactions from "./transactions"
import { HTTPException } from "hono/http-exception";
import { auth } from "../../../lib/auth-server";
import { cors } from "hono/cors";

export const runtime = "edge";
const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}>().basePath("/api");

app.use("/auth/*", cors({
    origin: process.env.NODE_ENV === "production" ? "https://yourdomain.com" : "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true
}));

app.on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
    } else {
        c.set("user", session.user);
        c.set("session", session.session);
    }
    return next();
});

app.onError((err, c) => {
   if (err instanceof HTTPException) {
      return err.getResponse();
   }
   else {
      return c.json({ error: "Internal server error" })
   }
})

const routes = app.route("/accounts", accounts).route('/categories', categories).route('/transactions', transactions)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
