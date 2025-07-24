import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { loginHandler } from "@/services/api";
import { isAxiosError } from "axios";
import type { IAuthentication } from "@/models/IStore";
import { authLoginActions } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IFormLogin {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch= useDispatch();
  const navigate= useNavigate();

  const schema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email address"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[0-9]/, "Password must contain at least one number"),
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: loginHandler,
    onSuccess: (data) => {
      // console.log(data);

      const auth:IAuthentication={
        isAuthenticated:true,
        accessToken:data.accessToken,
        refreshToken:data.refreshToken,
        user:{
          id:data.user.id,
          username:data.user.username,
          email:data.user.email,
        }
      }

      dispatch(authLoginActions.setAuthLogin(auth))

      console.log("auth obj",auth);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        console.log("Error at login:", error.response?.data.message);

        if (error.response?.status === 404) {
          hookForm.setError("email", {
            type: "server",
            message: error.response?.data.message || "Login failed",
          });
        }

        if (error.response?.status === 401) {
          hookForm.setError("password", {
            type: "server",
            message: error.response?.data.message || "Login failed",
          });
        }
      }
    },
  });

  


  const hookForm = useForm<IFormLogin>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "", // never undefined
      password: "", // never undefined
    },
  });

  const onSubmit: SubmitHandler<IFormLogin> = (data) => {
    console.log(data);
    mutate(data);
  };

  if(isPending){
    return <p>loading .......</p>
  }

  return (
    <div className="w-full h-[90vh] border border-red-500 p-4 flex flex-col items-center justify-center">
      <Card className="max-lg:w-[80%] w-[50%]">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...hookForm}>
            <form
              onSubmit={hookForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={hookForm.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    {!hookForm.formState.errors.email && (
                      <FormDescription>
                        We’ll never share your email.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {!hookForm.formState.errors.password && (
                      <FormDescription className="">
                        Make sure your password is strong.
                      </FormDescription>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <div className="flex items-center">
            <CardDescription>Don't have an account?</CardDescription>
            <CardAction>
              <Button variant="link" className="cursor-pointer">
                Sign Up
              </Button>
            </CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
