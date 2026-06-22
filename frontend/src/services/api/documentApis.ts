import { apiClient } from "../axiosInstance";

// export const updateProfileAPI = async ({
//   profile,
//   bio,
//   userId
// }: {
//   profile: FileList
//   bio: string
//   userId: string
// }) => {
//   try {
//     const profilePicture = profile[0]

//     const response = await axios.patch(
//       `http://localhost:8080/api/updateprofile/${userId}`,
//       {
//         profilePicture,
//         bio
//       },
//       {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       }
//     )

//     console.log(response.data)
//   } catch (err) {
//     console.log(err)
//     if (axios.isAxiosError(err)) {
//       throw err.response
//     }
//     throw err
//   }
// }

export const getDocuments = async () => {
  const response = await apiClient.get("/documents");

  return response.data;
};

export const createDocument = async ({
  title,
  content,
}: {
  title: string;
  content: object;
}) => {
  const response = await apiClient.post("/add-document", {
    title,
    content,
  });
  return response.data;
};

export const updateDocument = async ({
  id,
  title,
  content,
  version,
}: {
  id: string;
  title: string;
  content: object;
  version: number;
}) => {
  const response = await apiClient.patch(`/documents/${id}`, {
    title,
    content,
    version,
  });
  return response.data;
};

export const getDocumentById = async (id: string) => {
  const response = await apiClient.get(`/documents/${id}`)
  return response.data.document
}
