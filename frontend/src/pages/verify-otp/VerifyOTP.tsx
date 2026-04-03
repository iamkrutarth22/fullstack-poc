// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent
// } from '@/components/ui/card'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { verifyOTPHandler, resendOTPHandler } from '@/services/api/signup'
// import { authLoginActions } from '@/store/authSlice'
// import { useMutation } from '@tanstack/react-query'
// import { useForm, type SubmitHandler } from 'react-hook-form'
// import { useDispatch } from 'react-redux'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { isAxiosError } from 'axios'
// import type { IAuthentication } from '@/models/IStore'
// import { useState } from 'react'

// interface IOTPForm {
//   otp: string
// }

// const VerifyOTP = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const [searchParams] = useSearchParams()
//   const email = searchParams.get('email') ?? ''
//   const [resendMessage, setResendMessage] = useState<string | null>(null)

//   const form = useForm<IOTPForm>({
//     defaultValues: { otp: '' }
//   })

//   const { mutate, isPending } = useMutation({
//     mutationFn: verifyOTPHandler,
//     onSuccess: data => {
//       const auth: IAuthentication = {
//         isAuthenticated: true,
//         accessToken: data.accessToken,
//         refreshToken: data.refreshToken,
//         user: {
//           id: data.user.id,
//           email: data.user.email,
//           name: data.user.name
//         }
//       }
//       dispatch(authLoginActions.setAuthLogin(auth))
//       navigate('/workspace')
//     },
//     onError: error => {
//       if (isAxiosError(error)) {
//         form.setError('otp', {
//           type: 'server',
//           message: error.response?.data.message || 'Invalid OTP'
//         })
//       }
//     }
//   })

//   const { mutate: resendOTP, isPending: isResending } = useMutation({
//     mutationFn: resendOTPHandler,
//     onSuccess: () => {
//       setResendMessage('A new OTP has been sent to your email.')
//       setTimeout(() => setResendMessage(null), 5000)
//     }
//   })

//   const onSubmit: SubmitHandler<IOTPForm> = data => {
//     mutate({ email, otp: data.otp })
//   }

//   if (!email) {
//     navigate('/signup')
//     return null
//   }

//   return (
//     <div className='w-full min-h-screen flex items-center justify-center'>
//       <Card className='w-full max-w-md'>
//         <CardHeader>
//           <CardTitle>Verify your email</CardTitle>
//           <CardDescription>
//             We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
//           </CardDescription>
//         </CardHeader>

//         <CardContent className='flex flex-col gap-4'>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className='flex flex-col gap-4'
//             >
//               <FormField
//                 control={form.control}
//                 name='otp'
//                 rules={{
//                   required: 'OTP is required',
//                   minLength: { value: 6, message: 'OTP must be 6 digits' },
//                   maxLength: { value: 6, message: 'OTP must be 6 digits' }
//                 }}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Verification Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder='123456' maxLength={6} {...field} />
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
//                 {isPending ? 'Verifying...' : 'Verify Email'}
//               </Button>
//             </form>
//           </Form>

//           <div className='flex flex-col items-center gap-2'>
//             {resendMessage && (
//               <p className='text-sm text-green-600'>{resendMessage}</p>
//             )}
//             <Button
//               variant='ghost'
//               className='text-sm cursor-pointer'
//               disabled={isResending}
//               onClick={() => resendOTP({ email })}
//             >
//               {isResending ? 'Sending...' : "Didn't receive it? Resend OTP"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default VerifyOTP

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
import { verifyOTPHandler, resendOTPHandler } from "@/services/api/signup";
import { authLoginActions } from "@/store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import type { IAuthentication } from "@/models/IStore";
import { useState } from "react";

interface IOTPForm {
  otp: string;
}

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const form = useForm<IOTPForm>({
    defaultValues: { otp: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyOTPHandler,
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
        form.setError("otp", {
          type: "server",
          message: error.response?.data.message || "Invalid OTP",
        });
      }
    },
  });

  const { mutate: resendOTP, isPending: isResending } = useMutation({
    mutationFn: resendOTPHandler,
    onSuccess: () => {
      setResendMessage("New code sent.");
      setTimeout(() => setResendMessage(null), 5000);
    },
  });

  const onSubmit: SubmitHandler<IOTPForm> = (data) => {
    mutate({ email, otp: data.otp });
  };

  if (!email) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <span className="font-display text-2xl tracking-tight">Folio</span>
          <h1 className="font-display text-4xl pt-6">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              rules={{
                required: "Code is required",
                minLength: { value: 6, message: "Must be 6 digits" },
                maxLength: { value: 6, message: "Must be 6 digits" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest font-mono h-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Verifying..." : "Verify email"}
            </Button>
          </form>
        </Form>

        {/* Resend */}
        <div className="text-center space-y-1">
          {resendMessage && (
            <p className="text-sm text-primary">{resendMessage}</p>
          )}
          <button
            type="button"
            onClick={() => resendOTP({ email })}
            disabled={isResending}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
