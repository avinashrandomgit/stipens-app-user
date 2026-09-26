import Logo from "@/components/Logo";
import { useAuth, useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
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
  SignInFormSchema,
  signInSchema,
} from "../../../lib/schemas/auth.schema";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
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

  const onSingInPress = async (params: SignInFormSchema) => {
    const { error } = await signIn.password({
      emailAddress: params.email,
      password: params.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in Attempt is Invalid: ", signIn);
    }
  };

  const onVerifyPress = async ({ code }: { code: string }) => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else {
      console.error("signIn attempt not complete: ", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
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
            onPress={() => signIn.mfa.sendEmailCode()}
            className="py-2 text-center justify-center"
          >
            <Text className="text-brand-blue text-smm">Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => signIn.reset()}
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
        <View className="mb-4">
          <Logo />
        </View>
        <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
          Welcome Back
        </Text>
        <Text className="text-brand-text-muted text-base mb-8">
          Track your money, powered by AI{" "}
        </Text>

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
                autoCapitalize="words"
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
          onPress={handleSubmit(onSingInPress)}
          disabled={isLoading}
          className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white font-semibold text-base">Login</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-brand-text-muted">Don't have an account?</Text>

          <Link href={"/sign-up"}>
            <Text className="text-brand-blue font-semibold">Sign Up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
