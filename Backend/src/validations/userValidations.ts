import * as yup from 'yup';

export const userSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),

  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
