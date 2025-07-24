"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { updateProfileAPI } from "@/services/api";

interface IUpdateProfile {
  profilePicture: FileList;
  bio: string;
}

const UpdateProfile = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const updateProfile = useForm<IUpdateProfile>({
    defaultValues: {
      bio: "",
    },
  });

  const onSubmit: SubmitHandler<IUpdateProfile> = (data) => {
    console.log("Selected file(s):", data.profilePicture);
    console.log("Bio:", data.bio);

    if (data.profilePicture && data.profilePicture.length > 0) {
      console.log(data.profilePicture[0]);
      mutate({
        profile: data.profilePicture,
        bio: data.bio,
        userId: "cmc0is97k0000j6s43xf756nf",
      });
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <Card className="max-lg:w-[80%] w-[50%] p-4 m-10">
      {/* {previewUrl && (
        <div className="space-y-2">
          <img
            src={previewUrl}
            alt="Selected preview"
            className="rounded-md shadow-md max-w-full h-auto"
          />
          <Button variant="outline" onClick={handleClear}>
            Clear Image
          </Button>
        </div>
      )} */}
      <Form {...updateProfile}>
        <form
          onSubmit={updateProfile.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={updateProfile.control}
            name="profilePicture"
            rules={{ required: "Profile image is required" }}
            render={() => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                  {previewUrl && (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Selected preview"
                        className="rounded-md shadow-md max-w-full h-auto"
                      />
                      <Button variant="outline" onClick={handleClear}>
                        Clear Image
                      </Button>
                    </div>
                  )}
                <FormControl>
                  {!previewUrl && (
                    <Input
                      name="profilePicture"
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file && file.type.startsWith("image/")) {
                          const objectUrl = URL.createObjectURL(file);
                          console.log("temporary url-> ", objectUrl);
                          setPreviewUrl(objectUrl);
                        } else {
                          setPreviewUrl(null);
                        }
                        updateProfile.setValue(
                          "profilePicture",
                          e.target.files as FileList,
                          { shouldValidate: true }
                        );
                      }}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  Upload a profile image (JPG, PNG, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={updateProfile.control}
            name="bio"
            rules={{ required: "Bio is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Write something..." {...field} />
                </FormControl>
                <FormDescription>Your personal bio.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update</Button>
        </form>
      </Form>
    </Card>
  );
};

export default UpdateProfile;
