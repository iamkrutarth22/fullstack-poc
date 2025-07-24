import CustomEditor from "@/components/CustomEditor";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { publishBlog } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/react";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
// import { bool } from "yup";

interface IBlogForm {
  title: string;
  description: string;
  content: JSONContent;
  tags: string[];
  categories: string[];
  imageUrl: FileList;
}
const AddBlog = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const blogForm = useForm<IBlogForm>({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      categories: [],
    },
  });

  const { mutate } = useMutation({
    mutationFn: publishBlog,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onSubmit: SubmitHandler<IBlogForm> = (data) => {
    console.log(data);

    if (data.imageUrl && data.imageUrl.length > 0) {
      console.log(data.imageUrl[0]);

      const contentNew = JSON.stringify(data.content, null, 2);
      const newTags = ["tag1", "tag2"].toString();
      // const newCategories = ["category1", "cateory2"].toString();
      mutate({
        imageUrl: data.imageUrl,
        title: data.title,
        contentNew: contentNew,
        description: data.description,
        tags: newTags,
        categories: data.categories.toString(),
      });
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const onChange = (content: JSONContent) => {
    blogForm.setValue("content", content);
  };

  const [currStep, setCurrStep] = useState<number>(1);

  const step1 = (
    <div className="flex flex-col  w-full h-full  overflow-autop-2  my-2 rounded-sm space-y-1">
      <FormField
        control={blogForm.control}
        name="title"
        rules={{ required: "title is required" }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <textarea
                className="border-none overflow-hidden resize-none shadow-none h-full !outline-none !focus:outline-none !text-wrap  !text-4xl font-serif caret-orange-500 placeholder:text-[#aaa] "
                placeholder="Add Title"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <CustomEditor
        content={JSON.stringify(blogForm.watch("content"), null, 2)}
        onChange={onChange}
      />
    </div>
  );

  const step2 = (
    <div className="p-1 flex w-full ">
      <div className="w-1/2 p-4 flex flex-col space-y-10">
        <FormField
          control={blogForm.control}
          name="imageUrl"
          rules={{ required: "Profile image is required" }}
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Preview</FormLabel>
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="rounded-md shadow-md max-w-full h-auto"
                  />
                  <Button variant="outline" onClick={handleClear} className="cursor-pointer">
                    Clear Image <X/>
                  </Button>
                </div>
              ) : (
                <div className="flex h-[350px] bg-gray-100 flex-row items-center justify-center align-middle space-y-3  border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500">
                  <Button
                   className=" w-full h-full cursor-pointer"
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      fileRef.current?.click();
                    }}
                  >
                    <Upload />
                    <span className="text-gray-500 text-center ">
                      Select a cover image
                    </span>
                  </Button>
                </div>
              )}
              <FormControl>
                {!previewUrl && (
                  <Input
                    name="imageUrl"
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file && file.type.startsWith("image/")) {
                        const objectUrl = URL.createObjectURL(file);
                        console.log("temporary url-> ", objectUrl);
                        setPreviewUrl(objectUrl);
                      } else {
                        setPreviewUrl(null);
                      }
                      blogForm.setValue(
                        "imageUrl",
                        e.target.files as FileList,
                        { shouldValidate: true }
                      );
                    }}
                  />
                )}
              </FormControl>
              <FormDescription>
                Include a high-quality image in your story to make it more inviting to readers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={blogForm.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg" >Description</FormLabel>
              <FormDescription>
                Add or change topics (up to 5) so readers know what your story
                is about
              </FormDescription>
              <FormControl>
                <textarea
                  className="resize-none border rounded-sm bg-gray-50 p-2"
                  placeholder="Add a Description for the Article"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="w-1/2 p-4 flex flex-col space-y-4">
        <FormField
          control={blogForm.control}
          name="categories"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">
                Publishing to : <span className=" text-2xl">username</span>
              </FormLabel>
              <FormDescription>
                Add or change topics (up to 5) so readers know what your story
                is about
              </FormDescription>
              <FormControl>
                <textarea
                  className="resize-none border rounded-sm bg-gray-50 p-2"
                  placeholder="Add a Description for the Article"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full w-40 self-center cursor-pointer">
          publish
        </Button>
      </div>
    </div>
  );

  return (
    <div className=" lg:mx-50 p-10  h-[100vh]  flex flex-col  overflow-auto no-scrollbar ">
      <div className="w-full flex p-2 justify-between">
        <div></div>
        {currStep === 1 && (
          <Button
            className="rounded-full cursor-pointer"
            onClick={() => setCurrStep(2)}
            disabled={
              blogForm.watch("title") === "" ||
              blogForm.watch("content") === undefined ||
              false
            }
          >
            Publish
          </Button>
        )}
        {currStep === 2 && (
          <Button variant="ghost" onClick={() => setCurrStep(1)}>
            <X />
          </Button>
        )}
      </div>
      <Form {...blogForm}>
        <form onSubmit={blogForm.handleSubmit(onSubmit)} className=" h-full">
          {/* cover Image input */}
          {/*           
          <FormField
            control={blogForm.control}
            name="title"
            rules={{ required: "title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <Input placeholder="Write something..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <CustomEditor onChange={onChange} /> */}
          {currStep === 1 && step1}
          {currStep === 2 && step2}

          {/* <FormField
            control={blogForm.control}
            name="imageUrl"
            rules={{ required: "Profile image is required" }}
            render={() => (
              <FormItem>
                <FormLabel>cover picture</FormLabel>
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
                      name="imageUrl"
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
                        blogForm.setValue(
                          "imageUrl",
                          e.target.files as FileList,
                          { shouldValidate: true }
                        );
                      }}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  Upload a blog cover image (JPG, PNG, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={blogForm.control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write something..."
                    {...field} // ✅ Correctly connect input to React Hook Form
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
        </form>
      </Form>
    </div>
  );
};

export default AddBlog;
