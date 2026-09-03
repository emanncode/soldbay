import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShoppingBag, Store } from "lucide-react-native";
import { BackHeader, Button, ChoiceCard, StickyActionBar } from "@/components";
import { goBackSafe } from "@/lib/navigation";
import { colors } from "@/theme/colors";

export default function SelectRoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<"BUYER" | "SELLER">("BUYER");

  const handleContinue = () => {
    router.push({
      pathname: "/signup",
      params: { role: selectedRole },
    });
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => goBackSafe(router, "/login")} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 32,
        }}
        className="flex-1 px-3"
      >
        <View className="mb-4">
          <Text className="font-manrope-semibold text-h1 text-text-primary">
            Join Soldbay
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            How will you be using Soldbay on campus?
          </Text>
        </View>

        <View className="gap-2">
          <ChoiceCard
            title="I'm a Buyer"
            description="Browse textbooks, electronics, and campus essentials with money held safely in escrow."
            selected={selectedRole === "BUYER"}
            onPress={() => setSelectedRole("BUYER")}
            icon={
              <View className="h-6 w-6 items-center justify-center rounded-full bg-accent-tint">
                <ShoppingBag size={24} color={colors.accentHover} />
              </View>
            }
          />

          <ChoiceCard
            title="I'm a Seller"
            description="List items, reach verified students on your campus, and receive guaranteed payouts."
            selected={selectedRole === "SELLER"}
            onPress={() => setSelectedRole("SELLER")}
            icon={
              <View className="h-6 w-6 items-center justify-center rounded-full bg-accent-tint">
                <Store size={24} color={colors.accentHover} />
              </View>
            }
          />
        </View>
      </ScrollView>

      <StickyActionBar>
        <Button
          label="Continue"
          onPress={handleContinue}
          variant="primary"
        />
      </StickyActionBar>
    </View>
  );
}
