import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();

export const loginHandler = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("http://localhost:8080/api/login", {
      email,
      password,
    });

    console.log(response.data);
    return response.data; // return just the data
  } catch (err) {
    console.error("Error occurred during login:", err);
    throw err;
  }
};

export const updateProfileAPI = async ({
  profile,
  bio,
  userId,
}: {
  profile: FileList;
  bio: string;
  userId: string;
}) => {
  try {
    const profilePicture = profile[0];

    const response = await axios.patch(
      `http://localhost:8080/api/updateprofile/${userId}`,
      {
        profilePicture,
        bio,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(response.data);
  } catch (err) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      throw err.response;
    }
    throw err;
  }
};

export const publishBlog = async ({
  title,
  description,
  contentNew,
  imageUrl,
  tags,
  categories,
}: {
  title: string;
  description: string;
  contentNew: string;
  tags: string;
  categories: string;
  imageUrl: FileList;
}) => {
  try {
    const imageUrls = imageUrl[0];
    // const content=JSON.parse(contentNew)
     const response = await axios.post(
      `http://localhost:8080/api/addblog`,
      {
        title,
        description,
        content:contentNew,
        tags,
        categories,
        imageUrls
      },
      {
        headers: { "Content-Type": "multipart/form-data/json" },
      }
    );

    console.log(response.data);
    
  } catch (err) {
    console.log(err)
    throw err;
  }
};
