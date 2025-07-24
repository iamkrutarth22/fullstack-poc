import { NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma";

const prismaClient = new PrismaClient();

export const getUserBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in get blogs", req.userId);

  const userId = req.userId;
  const currentPage = Number(req.query.page) || 1;
  const perPage = 10;

  try {
    const blogs = await await prismaClient.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });

    res.status(200).json({
      message: "blogs fetched succesfully",
      blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch post", error: err });
  }
};

// interface CreateBlogRequest {
//   title: string;
//   content: Record<string, any>; // or a stricter Tiptap schema
//   imageUrls: string;
//   tags: string;
//   categories: string;
//   userId: string;
// }


export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate presence of userId
    // const userId = req.userId;
    // if (!userId) {
    //    res.status(401).json({ message: "Unauthorized user" });
    // }

    const userId="cmc0is97k0000j6s43xf756nf";


    const { title, tags, categories } = req.body;
    const content=JSON.parse(req.body.content)

    console.log("incoming body",req.body)

    if (!title || !content || !tags || !categories) {
       res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrls = "";
    let description=""
    if (req.file) {
      imageUrls = req.file.path.replace(/\\/g, "/");
    }
    if(req.body.description){
      description=req.body.description
    }

    const newBlog = await prismaClient.blog.create({
      data: {
        title,
        content, // must be a JSON object
        tags,
        description,
        categories,
        imageUrls,
        author: {
          connect: { id: userId },
        },
      },
      include: {
        likes: true,
        comments: true,
        savedBy: true,
      },
    });

     res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });

  } catch (error) {
    console.error("Error creating blog:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
       res.status(400).json({ message: error.message });
    }

   res.status(500).json({
      message: "Internal server error",
    });
  }
};