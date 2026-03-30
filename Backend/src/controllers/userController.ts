import { Response, Request } from "express";
import { userSchema } from "../validations/userValidations";
// import { PrismaClient } from './generated/prisma'
import bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "../../generated/prisma/client";
import { string } from "yup";

const prismaClient = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const validateNewUser = await userSchema.validate(req.body, {
    abortEarly: false,
  });
  if (!validateNewUser) {
    throw new Error("Validation failed");
  }
  try {
    const hashedPass = await bcrypt.hash(validateNewUser.password, 8);

    const newUser = await prismaClient.user.create({
      data: {
        ...validateNewUser,
        password: hashedPass,
        profilePicture: null,
        bio: null,
      },
      include: {
        blogs: true,
        savedBlogs: true,
        followers: true,
        following: true,
      },
    });

    const { password, ...userWithoutPass } = newUser; // destructure the obj so that password is not passed to the frontend
    res.status(200).json({
      message: `new user ${userWithoutPass.username} is created`,
      user: userWithoutPass,
    });
  } catch (err) {
    if ((err as Error).name === "ValidationError") {
      res.status(400).json({
        message: "Validation failed",
        errors: (err as any).errors,
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const fields = (err.meta?.target as string[]) || [];

        console.log(fields);

        if (fields.includes("username")) {
           res.status(409).json({
            message: "Username already taken",
            // errors: err,
          });
        }
        if (fields.includes("email")) {
           res.status(409).json({
            message: "Email already registered",
            errors: err,
          });
        }
        if (fields.includes("password")) {
           res.status(409).json({
            message: "Password already used (unique constraint violation)",
            errors: err,
          });
        }

         res.status(409).json({
          message: "Unique constraint failed",
          errors: err,
        });
      }
    } else {
      res.status(500).json({
        message: "Something went wrong",
        error: (err as any).message,
      });
    }
  }
};

// export const getUser = async(req: Request,res:Response)=>{
//     try {
//         res.status(200).json({
//             message:"user api success"
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message:"Inter server error"
//         })
//     }
// }
interface porfileUpdate {
  profilePicture:string|null,
  bio:string|null
}

export const updateProfile = async (req:Request, res:Response)=>{
  const userId = req.params.userId

  try {
    const updateData:porfileUpdate = {
      profilePicture:null,
      bio:null

    }
    // console.log(req.file)
    if (req.file) updateData.profilePicture = req.file.path.replace(/\\/g, "/");
    if (req.body.bio) updateData.bio = req.body.bio;

    const updatedPost = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      include: {
        blogs: true,
        savedBlogs: true,
        followers: true,
        following: true,
      },

    });

    
    res.status(200).json({
      message: "Post updated successfully",
      user: updatedPost,
    });

  } catch (err){
     console.log(err);
    res.status(500).json({
      message: "internal server error",
    });
  }
}

//cmc0is97k0000j6s43xf756nf