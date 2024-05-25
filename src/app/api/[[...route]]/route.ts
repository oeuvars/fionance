import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./account"
import { HTTPException } from "hono/http-exception";

export const runtime = "edge";
const app = new Hono().basePath("/api");
app.onError((err, c) => {
   if (err instanceof HTTPException) {
      return err.getResponse();
   }
   else {
      return c.json({ error: "Internal server error" })
   }
})

const routes = app.route("/accounts", accounts)

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
