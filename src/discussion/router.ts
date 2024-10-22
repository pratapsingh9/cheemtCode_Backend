import { Hono } from "hono";
import type { Context } from "hono";
const discussRouter = new Hono();

discussRouter.post('/')


discussRouter.post('/create',async(c:Context)=> {
    const body = await c.req.parseBody();
    
    return c.json({
        message:"Discussion created successfully",
        data:body
    })
})