import { PrismaClient } from "@prisma/client";

const prismaCLient = new PrismaClient({
  log: ["query"],
});

export default prismaCLient;
