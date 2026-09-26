import { Zap } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Logo() {
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand-blue">
        <Zap size={24} color="#FFFFFF" />
      </View>

      <Text className="text-2xl font-bold tracking-tight">Stipens</Text>
    </View>
  );
}
