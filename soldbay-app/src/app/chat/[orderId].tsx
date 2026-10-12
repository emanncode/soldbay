import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { useAppRouter as useRouter } from "@/hooks/useAppRouter";
import {
  CaretLeft,
  PaperPlaneRight,
  ShieldWarning,
  DotsThreeVertical,
} from "phosphor-react-native";
import { SellerInfoRow } from "../../components/ui/SellerInfoRow";
import { ChatMessage } from "../../components/ui/ChatMessage";
import { IconButton } from "../../components/ui/IconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";
import { actionSheetDialog } from "../../lib/dialogs";

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
  isRead: boolean;
}

// Dummy data
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hi, I just placed an order for the MacBook Pro!",
    isMine: true,
    timestamp: "10:30 AM",
    isRead: true,
  },
  {
    id: "2",
    text: "Great! I will be at the UNILAG main gate around 2 PM.",
    isMine: false,
    timestamp: "10:35 AM",
    isRead: true,
  },
  {
    id: "3",
    text: "Hi, I just placed an order for the MacBook Pro!",
    isMine: true,
    timestamp: "10:30 AM",
    isRead: true,
  },
  {
    id: "4",
    text: "Great! I will be at the UNILAG main gate around 2 PM.",
    isMine: false,
    timestamp: "10:35 AM",
    isRead: true,
  },
  {
    id: "5",
    text: "Hi, I just placed an order for the MacBook Pro!",
    isMine: true,
    timestamp: "10:30 AM",
    isRead: true,
  },
  {
    id: "6",
    text: "Great! I will be at the UNILAG main gate around 2 PM.",
    isMine: false,
    timestamp: "10:35 AM",
    isRead: true,
  },
];

export default function ChatScreen() {
  useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const scrollViewRef = useRef<ScrollView>(null);

  const keyboard = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  });

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [fallbackKeyboardHeight, setFallbackKeyboardHeight] = useState(0);
  const [webKeyboardOffset, setWebKeyboardOffset] = useState(0);

  // Auto-scroll helper to keep latest messages in view
  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 50);
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS === "web") {
      return { paddingBottom: webKeyboardOffset };
    }
    const activeHeight =
      keyboard.height.value > 0
        ? keyboard.height.value
        : fallbackKeyboardHeight;
    return {
      paddingBottom: activeHeight,
    };
  });

  // Keyboard show/hide listeners for auto-scroll and dynamic bottom padding
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardVisible(true);
      if (e?.endCoordinates?.height) {
        setFallbackKeyboardHeight(e.endCoordinates.height);
      }
      scrollToBottom();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setFallbackKeyboardHeight(0);
    });

    // Web visualViewport support for mobile browsers
    let handleViewportChange: (() => void) | null = null;
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.visualViewport
    ) {
      handleViewportChange = () => {
        const vv = window.visualViewport;
        if (!vv) return;
        const offset = Math.max(0, window.innerHeight - vv.height);
        setWebKeyboardOffset(offset);
        if (offset > 0) {
          setIsKeyboardVisible(true);
          scrollToBottom();
        } else {
          setIsKeyboardVisible(false);
        }
      };
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    return () => {
      showSub.remove();
      hideSub.remove();
      if (
        handleViewportChange &&
        typeof window !== "undefined" &&
        window.visualViewport
      ) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange,
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange,
        );
      }
    };
  }, [scrollToBottom]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMine: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Mock auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Okay, see you then!",
          isMine: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: false,
        },
      ]);
    }, 2000);
  };

  const handleHeaderMenu = () => {
    actionSheetDialog("Chat Options", "Choose an action:", [
      { text: "Archive Chat", onPress: () => console.log("Archive") },
      {
        text: "Report User",
        onPress: () => console.log("Report"),
        style: "destructive",
      },
      {
        text: "Block User",
        onPress: () => console.log("Block"),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <Animated.View
      style={[{ flex: 1 }, animatedContainerStyle]}
      className="bg-bgBase dark:bg-darkBg"
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-3 bg-bgBase dark:bg-darkBg z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-1">
          <IconButton
            icon={CaretLeft}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            style={{ marginRight: 12, marginLeft: -4 }}
          />
          <SellerInfoRow
            name="Amina Y."
            avatarUrl="https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200"
            isVerified={true}
          />
        </View>
        <TouchableOpacity onPress={handleHeaderMenu} className="p-2 -mr-2">
          <DotsThreeVertical
            size={24}
            color={colors.primaryText}
            weight="bold"
          />
        </TouchableOpacity>
      </View>

      {/* Safety Banner */}
      <View className="bg-warning/10 dark:bg-darkWarning/20 p-3 px-4 flex-row items-start gap-3">
        <ShieldWarning
          size={20}
          color={colors.warning}
          weight="fill"
          className="mt-0.5 shrink-0"
        />
        <Text className="flex-1 text-[12px] font-sora text-primaryText dark:text-darkText leading-relaxed">
          Keep payments and communication on Soldbay. Never share your bank
          details or pay in advance off-app.
        </Text>
      </View>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      >
        <Text className="text-center text-[11px] font-sora-semibold text-secondaryText/50 dark:text-borderDark/50 mb-2">
          TODAY
        </Text>

        {messages.map((msg) => (
          <View key={msg.id} className="mb-2 w-full">
            <ChatMessage
              message={msg.text}
              isSent={msg.isMine}
              readAt={msg.isRead ? msg.timestamp : undefined}
            />
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View
        className="px-4 py-3 bg-bgBase dark:bg-darkBg flex-row items-end gap-3"
        style={{
          paddingBottom: isKeyboardVisible
            ? Platform.OS === "ios"
              ? 8
              : 10
            : Math.max(insets.bottom, 12),
        }}
      >
        {/* Input Capsule (matches 48px button height in single-line mode) */}
        <View className="flex-1 min-h-[48px] max-h-[120px] bg-primaryText/5 dark:bg-darkBgStep rounded-[24px] px-4 justify-center">
          <TextInput
            className="text-[15px] font-sora text-primaryText dark:text-darkText"
            placeholder="Type a message..."
            placeholderTextColor={isDark ? colors.borderDark : colors.secondaryText}
            multiline
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => scrollToBottom()}
            style={{
              paddingTop: Platform.OS === "ios" ? 12 : 8,
              paddingBottom: Platform.OS === "ios" ? 12 : 8,
              textAlignVertical: "center",
            }}
          />
        </View>
        {/* Send Button (48x48 circle matching the 48px input capsule) */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          className={`w-12 h-12 rounded-full items-center justify-center shrink-0 ${
            inputText.trim() ? "bg-accent" : "bg-primaryText/5 dark:bg-white/10"
          }`}
        >
          <PaperPlaneRight
            size={22}
            color={
              inputText.trim()
                ? "#FFF"
                : isDark
                  ? colors.borderDark
                  : colors.secondaryText
            }
            weight={inputText.trim() ? "fill" : "regular"}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
