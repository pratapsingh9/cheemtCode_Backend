import { Hono } from "hono";
import UserServices from "./service";

const userRouter = new Hono();

userRouter.post("/", async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    const user = await UserServices.createUser(name, email, password);
    return c.json(user, 201);
  } catch (error: any) {
    return c.json(
      { message: "Error creating user", error: error.message },
      500
    );
  }
});

userRouter.put("/password", async (c) => {
  try {
    const { name, email, updatePassword } = await c.req.json();
    const user = await  UserServices.updatePassword(
      name,
      email,
      updatePassword
    );
    return c.json(user);
  } catch (error: any) {
    return c.json(
      { message: "Error updating password", error: error.message },
      500
    );
  }
});

userRouter.delete("/", async (c) => {
  try {
    const { name, email } = await c.req.json();
    const user = await  UserServices.deleteUser(name, email);
    return c.json(user);
  } catch (error: any) {
    return c.json(
      { message: "Error deleting user", error: error.message },
      500
    );
  }
});

userRouter.get("/", async (c) => {
  try {
    const { name, email } = await c.req.json();
    const user = await  UserServices.getUser({ name, email });
    return c.json(user);
  } catch (error: any) {
    return c.json(
      { message: "Error fetching user", error: error.message },
      500
    );
  }
});

export default userRouter;
