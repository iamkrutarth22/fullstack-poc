import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "../../generated/prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

const userSchema = yup.object({
  name: yup.string().required("Name is required").min(2),
  email: yup.string().required("Email is required").email(),
  password: yup.string().required("Password is required").min(6),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const validated = await userSchema.validate(req.body, {
      abortEarly: false,
    });
    const passwordHash = await bcrypt.hash(validated.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        auth: {
          create: { passwordHash },
        },
      },
    });

    res.status(201).json({
      message: `User ${newUser.name} created`,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (err) {
    if ((err as any).name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation failed", errors: (err as any).errors });
      return;
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};
