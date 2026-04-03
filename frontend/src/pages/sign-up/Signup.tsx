// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
//   CardAction
// } from '@/components/ui/card'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { signupHandler } from '@/services/api/signup'
// import { useMutation } from '@tanstack/react-query'
// import { useForm, type SubmitHandler } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom'
// import { isAxiosError } from 'axios'
// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'

// interface ISignupForm {
//   name: string
//   email: string
//   password: string
// }

// const schema = yup.object({
//   name: yup
//     .string()
//     .required('Name is required')
//     .min(2, 'Name must be at least 2 characters'),
//   email: yup
//     .string()
//     .required('Email is required')
//     .email('Must be a valid email'),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(6, 'Password must be at least 6 characters')
// })

// const Signup = () => {
//   const navigate = useNavigate()

//   const form = useForm<ISignupForm>({
//     resolver: yupResolver(schema),
//     defaultValues: { name: '', email: '', password: '' }
//   })

//   const { mutate, isPending } = useMutation({
//     mutationFn: signupHandler,
//     onSuccess: (_, variables) => {
//       navigate(`/verify-otp?email=${encodeURIComponent(variables.email)}`);

//     },
//     onError: error => {
//       if (isAxiosError(error)) {
//         if (error.response?.status === 409) {
//           form.setError('email', {
//             type: 'server',
//             message: 'Email already registered'
//           })
//         }
//       }
//     }
//   })

//   const onSubmit: SubmitHandler<ISignupForm> = data => {
//     mutate(data)
//   }

//   return (
//     <div className='w-full min-h-screen flex items-center justify-center'>
//       <Card className='w-full max-w-md'>
//         <CardHeader>
//           <CardTitle>Create an account</CardTitle>
//           <CardDescription>
//             Enter your details below to get started
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className='flex flex-col gap-4'
//             >
//               <FormField
//                 control={form.control}
//                 name='name'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder='John Doe' {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name='email'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder='you@example.com'
//                         type='email'
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       We'll send a verification code to this email.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name='password'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder='••••••••'
//                         type='password'
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type='submit'
//                 className='w-full cursor-pointer'
//                 disabled={isPending}
//               >
//                 {isPending ? 'Creating account...' : 'Sign Up'}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>

//         <CardFooter className='flex-col gap-2'>
//           <div className='flex items-center'>
//             <CardDescription>Already have an account?</CardDescription>
//             <CardAction>
//               <Button
//                 variant='link'
//                 className='cursor-pointer'
//                 onClick={() => navigate('/signin')}
//               >
//                 Sign In
//               </Button>
//             </CardAction>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

// export default Signup
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupHandler } from "@/services/api/signup";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface ISignupForm {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "At least 2 characters"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();

  const form = useForm<ISignupForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signupHandler,
    onSuccess: (_, variables) => {
      navigate(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          form.setError("email", { type: "server", message: "Email already registered" });
        }
      }
    },
  });

  const onSubmit: SubmitHandler<ISignupForm> = (data) => mutate(data);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border">
        <div>
          <span className="font-display text-2xl tracking-tight">Folio</span>
        </div>
        <div className="space-y-4">
          <p className="font-display text-5xl leading-tight">
            Start writing.<br />Think clearly.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            A single workspace for your documents, diagrams, and ideas.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Your writing workspace.</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1">
            <h1 className="font-display text-4xl">Create account</h1>
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to your email
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormDescription className="text-xs">
                      A 6-digit code will be sent here.
                    </FormDescription>
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
