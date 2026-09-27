import Logo from "@/components/Logo";
import { useAuth, useSignUp } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  codeSchema,
  SignUpFormSchema,
  signUpSchema,
} from "../../../lib/schemas/auth.schema";

export default function SignupScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<{ code: string }>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
    },
  });

  const onSingUpPress = async (params: SignUpFormSchema) => {
    setEmail(params.email);

    const { error } = await signUp.password({
      emailAddress: params.email,
      password: params.password,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));

      alert(error.longMessage || error.message);

      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const onVerifyPress = async ({ code }: { code: string }) => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl("/onboarding");
          router.replace(url as any);
        },
      });
    } else {
      console.error("Signup attempt not complete: ", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-brand-body"
      >
        <View className="flex-1 justify-center px-6 -mt-16">
          <View className="mb-4">
            <Logo />
          </View>

          <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
            Verify Your Account
          </Text>
          <Text className="text-base mb-8 text-brand-text-muted">
            We sent a code to {email || "Your Email"}
          </Text>

          <Controller
            control={otpControl}
            name="code"
            render={({ field: { value, onChange } }) => {
              return (
                <TextInput
                  className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-4"
                  placeholder="Enter Verification Code"
                  placeholderTextColor={"#8A8D96"}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                />
              );
            }}
          />

          {otpErrors.code && (
            <Text className="text-brand-coral mb-r text-sm">
              {otpErrors.code?.message}
            </Text>
          )}

          {errors.fields.code && (
            <Text className="text-brand-coral mb-r text-sm">
              {errors.fields.code.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleOtpSubmit(onVerifyPress)}
            disabled={isLoading}
            className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className="text-white font-semibold text-base">Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => signUp.verifications.sendEmailCode()}
            className="py-2 text-center justify-center"
          >
            <Text className="text-brand-blue text-smm">Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => signUp.reset()}
            className="py-2 text-center justify-center"
          >
            <Text className="text-brand-blue text-smm">Start Over</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-body"
    >
      <View className="flex-1 justify-center px-6 -mt-16">
        <Logo />
        <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
          Create Account
        </Text>
        <Text className="text-brand-text-muted text-base mb-8">
          Track your money, powered by AI{" "}
        </Text>

        <View className="flex-row gap-3 mb-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { value, onChange } }) => {
              return (
                <TextInput
                  className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                  placeholder="First Name"
                  placeholderTextColor={"#8A8D96"}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { value, onChange } }) => {
              return (
                <TextInput
                  className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                  placeholder="Last Name"
                  placeholderTextColor={"#8A8D96"}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                />
              );
            }}
          />
        </View>
        {(formErrors.firstName || formErrors.lastName) && (
          <Text className="text-brand-coral mb-r text-sm">
            {formErrors.firstName?.message || formErrors.lastName?.message}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => {
            return (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-4"
                placeholder="Email"
                placeholderTextColor={"#8A8D96"}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            );
          }}
        />

        {formErrors.email && (
          <Text className="text-brand-coral mb-r text-sm">
            {formErrors.email?.message}
          </Text>
        )}

        {errors.fields.emailAddress && (
          <Text className="text-brand-coral mb-r text-sm">
            {errors.fields.emailAddress.message}
          </Text>
        )}

        {/* <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => {
            return (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-4"
                placeholder="Email"
                placeholderTextColor={"#8A8D96"}
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            );
          }}
        />

        {formErrors.email && (
          <Text className="text-brand-coral mb-r text-sm">
            {formErrors.email?.message}
          </Text>
        )}

        {errors.fields.emailAddress && (
          <Text className="text-brand-coral mb-r text-sm">
            {errors.fields.emailAddress.message}
          </Text>
        )} */}

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => {
            return (
              <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-4"
                placeholder="Password"
                placeholderTextColor={"#8A8D96"}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            );
          }}
        />

        {formErrors.password && (
          <Text className="text-brand-coral mb-r text-sm">
            {formErrors.password?.message}
          </Text>
        )}
        {errors.fields.password && (
          <Text className="text-brand-coral mb-r text-sm">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSingUpPress)}
          disabled={isLoading}
          className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white font-semibold text-base">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-brand-text-muted">
            Already have an account?
          </Text>

          <Link href={"/sign-in"}>
            <Text className="text-brand-blue font-semibold">Sign In</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAvoidingView>
  );
}
