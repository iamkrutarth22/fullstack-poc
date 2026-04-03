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
