import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First Name is Required"),
  lastName: z.string().trim().min(1, "Last Name is Required"),
  email: z.email("Enter a valid email").trim().min(1, "Email is Required"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Enter a valid email").trim().min(1, "Email is Required"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type SignInFormSchema = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
  code: z.string().min(1, "OTP is Required"),
});

export type CodeFormSchema = z.infer<typeof codeSchema>;
