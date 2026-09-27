import CurrencyPicker, {
  ALL_CURRENCIES,
} from "@/components/common/CurrencyPicker";
import Logo from "@/components/Logo";
import { useUser } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Feather } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSupabase } from "../../../hooks/useSupabase";
import {
  OnboardingFormValues,
  onboardingSchema,
} from "../../../lib/schemas/onboarding.schema";
import { useUserStore } from "../../../store/user.store";

const OnboardingScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const setCurrency = useUserStore((s) => s.setCurrency);
  const setNeedsOnboarding = useUserStore((s) => s.setNeedsOnboarding);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: { startingBalance: "" },
  });

  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === "INR") ?? ALL_CURRENCIES[0],
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const authSupabase = useSupabase();

  const handleSave = async ({ startingBalance }: OnboardingFormValues) => {
    const parsed = parseFloat(startingBalance.replace(/,/g, ""));
    setSaving(true);
    setError("");

    const { error: updateError } = await authSupabase
      .from("users")
      .update({
        currency: selectedCurrency.code,
      })
      .eq("clerk_id", user!.id);

    if (updateError) {
      setSaving(false);
      setError("Something went wrong! Onboarding Screen");
      return;
    }

    const { data: defaultAccount, error: accountFetchError } =
      await authSupabase
        .from("accounts")
        .select("id, balance")
        .eq("user_id", user!.id)
        .eq("is_default", true)
        .single();

    if (accountFetchError || !defaultAccount) {
      setSaving(false);
      setError("Something went wrong! Onboarding Screen");
      return;
    }

    const { error: txError } = await authSupabase.from("transactions").insert({
      user_id: user!.id,
      account_id: defaultAccount.id,
      type: "INCOME",
      amount: parsed,
      category: "other_income",
      description: "Starting balance",
      date: new Date().toISOString(),
      input_method: "MANUAL",
    });

    if (txError) {
      setSaving(false);
      setError("Something went wrong! Onboarding Screen");
      return;
    }

    const { error: balanceError } = await authSupabase
      .from("accounts")
      .update({ balance: defaultAccount.balance + parsed })
      .eq("id", defaultAccount.id);

    setSaving(false);

    if (balanceError) {
      setError("Something went wrong! Onboarding Screen");
      return;
    }

    setCurrency(selectedCurrency.code);
    setNeedsOnboarding(false);
    router.replace("/(root)/(tabs)");
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-4">
            <Logo />
          </View>
          <Text className="text-[#1A1D26] text-3xl font-bold mb-2">
            Let's get you set up
          </Text>

          <Text className="text-brand-text-muted text-sm mb-10">
            A couple of quick details to personalise your experience.
          </Text>

          <Text className="text-brand-bg text-xs font-medium mb-1.5">
            Starting Balance
          </Text>

          <View className="flex-row items-center bg-white border border-[#e8e6df] rounded-xl px-4 mb-1">
            <Text className="text-brand-text-secondary text-sm mr-2">
              {selectedCurrency.symbol}
            </Text>
            <Controller
              control={control}
              name="startingBalance"
              render={({ field: { value, onChange } }) => {
                return (
                  <TextInput
                    className="flex-1 py-3.5 text-sm text-brand-bg"
                    placeholder="eg. 50000"
                    placeholderTextColor={"#8A8D96"}
                    keyboardType="numeric"
                    returnKeyType="done"
                    value={value}
                    onChangeText={(v) => {
                      setError("");
                      onChange(v);
                    }}
                  />
                );
              }}
            />
          </View>

          {formErrors.startingBalance && (
            <Text className="text-brand-coral mb-r text-sm">
              {formErrors.startingBalance?.message}
            </Text>
          )}

          <View className="mb-4" />

          <Text className="text-brand-bg text-xs font-medium mb-1.5">
            Currency
          </Text>

          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            className="flex-row justify-between bg-white border border-[#e8e6df] px-4 py-4 rounded-xl items-center mb-6"
          >
            <Text className="text-sm text-brand-bg">
              {selectedCurrency.symbol} {selectedCurrency.code} -{" "}
              {selectedCurrency.name}
            </Text>
            <Feather size={16} color={"#8a8d96"} />
          </TouchableOpacity>

          {error ? (
            <Text className="text-brand-coral text-xs mb-4">{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={saving}
            className="w-full bg-brand-blue py-4 rounded-xl items-center mb-4"
            activeOpacity={0.85}
          >
            <Text className="text-white font-semibold text-base">
              {saving ? "Saving..." : "Get Started"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CurrencyPicker
        visible={pickerOpen}
        selectedCode={selectedCurrency.code}
        onSelect={(currency) => {
          setSelectedCurrency(currency);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
};

export default OnboardingScreen;
