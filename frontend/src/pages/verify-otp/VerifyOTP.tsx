import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifyOTPHandler, resendOTPHandler } from '@/services/api/signup'
import { authLoginActions } from '@/store/authSlice'
import { useMutation } from '@tanstack/react-query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import type { IAuthentication } from '@/models/IStore'
import { useState } from 'react'

interface IOTPForm {
  otp: string
}

const VerifyOTP = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  const form = useForm<IOTPForm>({
    defaultValues: { otp: '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: verifyOTPHandler,
    onSuccess: data => {
      const auth: IAuthentication = {
        isAuthenticated: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name
        }
      }
      dispatch(authLoginActions.setAuthLogin(auth))
      navigate('/workspace')
    },
    onError: error => {
      if (isAxiosError(error)) {
        form.setError('otp', {
          type: 'server',
          message: error.response?.data.message || 'Invalid OTP'
        })
      }
    }
  })

  const { mutate: resendOTP, isPending: isResending } = useMutation({
    mutationFn: resendOTPHandler,
    onSuccess: () => {
      setResendMessage('A new OTP has been sent to your email.')
      setTimeout(() => setResendMessage(null), 5000)
    }
  })

  const onSubmit: SubmitHandler<IOTPForm> = data => {
    mutate({ email, otp: data.otp })
  }

  if (!email) {
    navigate('/signup')
    return null
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
          </CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='otp'
                rules={{
                  required: 'OTP is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                  maxLength: { value: 6, message: 'OTP must be 6 digits' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder='123456' maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full cursor-pointer'
                disabled={isPending}
              >
                {isPending ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>

          <div className='flex flex-col items-center gap-2'>
            {resendMessage && (
              <p className='text-sm text-green-600'>{resendMessage}</p>
            )}
            <Button
              variant='ghost'
              className='text-sm cursor-pointer'
              disabled={isResending}
              onClick={() => resendOTP({ email })}
            >
              {isResending ? 'Sending...' : "Didn't receive it? Resend OTP"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyOTP
