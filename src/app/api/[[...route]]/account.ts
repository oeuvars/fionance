import { Hono } from "hono";
import { bankAccount, insertBankAccountSchema } from "../../../database/schema";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator"
import { createId } from '@paralleldrive/cuid2';
import { db } from "../../../database/drizzle";
import { z } from "zod"
import { auth } from "../../../lib/auth-server";

const app = new Hono<{
  Variables: { 
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  }
}>()
            .get("/", async (c) => {
               const user = c.get("user");
               if(!user) {
                  return c.json({ error: "Unauthorised" }, 401)
               }
               const data = await db.select({ id: bankAccount.id, name: bankAccount.name}).from(bankAccount).where(eq(bankAccount.userId, user.id));
               return c.json({ data })
            })
            .get("/:id", zValidator("param", z.object({id: z.string().optional()})), async (c) => {
               const user = c.get("user");
               const { id } = c.req.valid("param");

               if (!id) {
                  return c.json({ error: "Missing id" }, 400)
               }
               if (!user) {
                  return c.json({ error: "Unauthorised" }, 401)
               }
               const [data] = await db.select({ id: bankAccount.id, name: bankAccount.name }).from(bankAccount).where(and(eq(bankAccount.userId, user.id), eq(bankAccount.id, id)))
               if(!data) {
                  return c.json({ error: "Not forund" }, 404)
               }
               return c.json({ data });
            })
            .post("/", zValidator("json", insertBankAccountSchema.pick({ name: true })), async (c) => {
               const user = c.get("user");
               const values = c.req.valid("json");
               if(!user) {
                  return c.json({ error: "Unauthorised" }, 401)
               }
               const [data] = await db.insert(bankAccount).values({ id: createId(), userId: user.id, ...values}).returning();

               return c.json({ data })
            })
            .post("/bulk-delete", zValidator("json", z.object({ ids: z.array(z.string())})), async (c) => {
               const user = c.get("user");
               const values = c.req.valid("json");

               if (!user) {
                  return c.json({ error: "Unauthorised" }, 401)
               }

               const data = await db.delete(bankAccount).where(and(eq(bankAccount.userId, user.id), inArray(bankAccount.id, values.ids))).returning({id: bankAccount.id});
               return c.json({ data });
            })
            .patch("/:id", zValidator("param", z.object({id: z.string().optional()})), zValidator("json", insertBankAccountSchema.pick({ name: true })), async (c) => {
               const user = c.get("user");
               const { id } = c.req.valid("param");
               const values = c.req.valid("json");
               if (!id) {
                  return c.json({ error: "Missing id" }, 400);
               }
               if (!user) {
                  return c.json({ error: "Unauthorised" }, 401);
               }
               const [data] = await db.update(bankAccount).set(values).where(and(eq(bankAccount.userId, user.id), eq(bankAccount.id, id))).returning();
               if (!data) {
                  return c.json({ error: "Not found" }, 404);
               }
               return c.json({ data });
            })
            .delete("/:id", zValidator("param", z.object({id: z.string().optional()})), async (c) => {
               const user = c.get("user");
               const { id } = c.req.valid("param");

               if (!id) {
                  return c.json({ error: "Missing id" }, 400);
               }
               if (!user) {
                  return c.json({ error: "Unauthorised" }, 401);
               }
               const [data] = await db.delete(bankAccount).where(and(eq(bankAccount.userId, user.id), eq(bankAccount.id, id))).returning({ id: bankAccount.id });
               if (!data) {
                  return c.json({ error: "Not found" }, 404);
               }
               return c.json({ data });
            })

export default app
