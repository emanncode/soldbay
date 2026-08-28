import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { Button } from "@/components";
import { colors } from "@/theme/colors";

export default function ResetSuccessScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-surface-base px-3">
      <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-success-tint">
        <CheckCircle2 size={40} color={colors.success} />
      </View>

      <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
        Password Updated
      </Text>

      <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
        Your password has been changed successfully. You can now sign in with your new password.
      </Text>

      <View className="mt-6 w-full">
        <Button
          label="Back to Sign In"
          onPress={() => router.replace("/login")}
          variant="primary"
        />
      </View>
    </View>
  );
}
