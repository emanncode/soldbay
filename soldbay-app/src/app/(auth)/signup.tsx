import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAppRouter as useRouter } from "@/hooks/useAppRouter";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CampusPicker } from "../../components/ui/CampusPicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CaretLeft,
  CaretDown,
  User,
  IdentificationCard,
  EnvelopeSimple,
  Phone,
  Lock,
  Check,
} from "phosphor-react-native";
import { IconButton } from "../../components/ui/IconButton";
import { colors } from "../../theme/tokens";
import { useColorScheme } from "nativewind";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import { helpfulDialog } from "../../lib/dialogs";

interface University {
  id: string;
  name: string;
  code: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? colors.borderDark : colors.secondaryText;

  const [campusPickerVisible, setCampusPickerVisible] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const selectedCampus = useMemo(
    () => universities.find((university) => university.id === selectedUniversityId)?.name ?? "",
    [selectedUniversityId, universities],
  );

  useEffect(() => {
    let active = true;
    apiRequest<University[]>("/api/universities")
      .then((items) => {
        if (active) setUniversities(items);
      })
      .catch((error) => {
        if (active) helpfulDialog("Could not load campuses", error instanceof Error ? error.message : "Please try again.");
      })
      .finally(() => {
        if (active) setIsLoadingUniversities(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreateAccount = async () => {
    if (!firstName.trim() || !surname.trim() || !matricNumber.trim() || !email.trim() || !password || !selectedUniversityId) {
      helpfulDialog("Complete your details", "Add your name, matric number, email, password, and campus to continue.");
      return;
    }
    if (password.length < 8) {
      helpfulDialog("Choose a longer password", "Your password must be at least 8 characters.");
      return;
    }
    if (!acceptedTerms) {
      helpfulDialog("Acceptance required", "Please accept the Terms of Service and Privacy Policy to create your account.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: `${firstName.trim()} ${surname.trim()}`,
        matricNumber: matricNumber.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        universityId: selectedUniversityId,
        termsAccepted: true,
        privacyAccepted: true,
      });
      router.replace("/(tabs)");
    } catch (error) {
      helpfulDialog("Could not create account", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bgBase dark:bg-darkBg"
    >
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="px-4 pb-2 bg-bgBase dark:bg-darkBg z-10 flex-row items-center"
      >
        <IconButton
          icon={CaretLeft}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          style={{ marginLeft: -4 }}
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}
        >
          <View className="mb-8 mt-2">
            <Text className="text-large-title text-primaryText dark:text-darkText mb-2">
              Sign Up
            </Text>
            <Text className="text-body text-secondaryText dark:text-borderDark">
              Create your buyer account first.
            </Text>
          </View>

          <View className="gap-4 mb-6">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input
                  label="First Name"
                  placeholder="e.g. John"
                  value={firstName}
                  onChangeText={setFirstName}
                  leftIcon={<User size={20} color={iconColor} />}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Surname"
                  placeholder="e.g. Doe"
                  value={surname}
                  onChangeText={setSurname}
                  leftIcon={<User size={20} color={iconColor} />}
                />
              </View>
            </View>
            <Input
              label="Matric Number"
              placeholder="Enter your matric number"
              value={matricNumber}
              onChangeText={setMatricNumber}
              autoCapitalize="characters"
              leftIcon={<IdentificationCard size={20} color={iconColor} />}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<EnvelopeSimple size={20} color={iconColor} />}
            />
            <Input
              label="Phone (Optional)"
              placeholder="e.g. 08012345678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={iconColor} />}
            />

            <View>
              <Text className="text-[13px] font-sora-bold text-primaryText dark:text-darkText mb-2">
                Campus
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCampusPickerVisible(true)}
                disabled={isLoadingUniversities}
                className="min-h-[50px] bg-primaryText/5 dark:bg-darkBgStep rounded-full px-4 flex-row items-center justify-between"
              >
                <Text
                  className={`flex-1 text-[15px] font-sora ${selectedCampus ? "text-primaryText dark:text-darkText" : "text-secondaryText"}`}
                >
                  {isLoadingUniversities ? "Loading campuses..." : selectedCampus || "Select your campus..."}
                </Text>
                <CaretDown size={20} color={iconColor} />
              </TouchableOpacity>
            </View>

            <Input
              label="Password"
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Lock size={20} color={iconColor} />}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setAcceptedTerms((accepted) => !accepted)}
            className="flex-row items-start gap-3 mb-6"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedTerms }}
          >
            <View className={`mt-0.5 w-5 h-5 rounded border items-center justify-center ${acceptedTerms ? "bg-accent border-accent" : "border-primaryText/30 dark:border-borderDark/40"}`}>
              {acceptedTerms ? <Check size={14} color={colors.primaryText} weight="bold" /> : null}
            </View>
            <Text className="flex-1 text-[13px] font-sora text-secondaryText dark:text-borderDark leading-5">
              I agree to the Terms of Service and Privacy Policy. I understand that Soldbay is a marketplace for students.
            </Text>
          </TouchableOpacity>

          <Button
            label={isSubmitting ? "Creating account..." : "Create Account"}
            disabled={isSubmitting || isLoadingUniversities}
            onPress={handleCreateAccount}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      <CampusPicker
        visible={campusPickerVisible}
        onClose={() => setCampusPickerVisible(false)}
        onSelect={(name) => {
          const university = universities.find((item) => item.name === name);
          if (university) setSelectedUniversityId(university.id);
        }}
        campuses={universities.map((university) => university.name)}
      />
    </KeyboardAvoidingView>
  );
}
