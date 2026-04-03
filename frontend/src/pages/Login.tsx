import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginHandler } from "@/services/api";
import { authLoginActions } from "@/store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import type { IAuthentication } from "@/models/IStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormLogin {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required("Email is required").email("Must be a valid email"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<IFormLogin>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginHandler,
    onSuccess: (data) => {
      const auth: IAuthentication = {
        isAuthenticated: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        },
      };
      dispatch(authLoginActions.setAuthLogin(auth));
      navigate("/workspace");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          form.setError("email", { type: "server", message: error.response.data.message });
        }
        if (error.response?.status === 401) {
          form.setError("password", { type: "server", message: error.response.data.message });
        }
        if (error.response?.status === 403) {
          form.setError("email", { type: "server", message: "Email not verified. Please check your inbox." });
        }
      }
    },
  });

  const onSubmit: SubmitHandler<IFormLogin> = (data) => mutate(data);

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border">
        <div>
          <span className="font-display text-2xl tracking-tight">Folio</span>
        </div>
        <div>
          <blockquote className="font-display text-4xl leading-snug text-foreground/80 italic">
            "A place to think,<br />write, and build."
          </blockquote>
        </div>
        <p className="text-sm text-muted-foreground">Your writing workspace.</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="font-display text-4xl">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your workspace</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
