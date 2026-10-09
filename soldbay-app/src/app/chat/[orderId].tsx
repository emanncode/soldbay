import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { CaretLeft, PaperPlaneRight, ShieldWarning, DotsThreeVertical, Info } from 'phosphor-react-native';
import { SellerInfoRow } from '../../components/ui/SellerInfoRow';
import { ChatMessage } from '../../components/ui/ChatMessage';
import { IconButton } from '../../components/ui/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { helpfulDialog, actionSheetDialog } from '../../lib/dialogs';

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
  isRead: boolean;
}

// Dummy data
const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Hi, I just placed an order for the MacBook Pro!', isMine: true, timestamp: '10:30 AM', isRead: true },
  { id: '2', text: 'Great! I will be at the UNILAG main gate around 2 PM.', isMine: false, timestamp: '10:35 AM', isRead: true },
];

export default function ChatScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Auto-scroll to bottom on new message or keyboard show
  useEffect(() => {
    const timer = setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMine: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Mock auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Okay, see you then!',
        isMine: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      }]);
    }, 2000);
  };

  const handleLongPressMessage = (msg: Message) => {
    if (msg.isMine) {
      helpfulDialog(
        'Message Details',
        `Sent: ${msg.timestamp}\nStatus: ${msg.isRead ? 'Read by seller' : 'Delivered'}`
      );
    }
  };

  const handleHeaderMenu = () => {
    actionSheetDialog(
      'Chat Options',
      'Choose an action:',
      [
        { text: 'Archive Chat', onPress: () => console.log('Archive') },
        { text: 'Report User', onPress: () => console.log('Report'), style: 'destructive' },
        { text: 'Block User', onPress: () => console.log('Block'), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bgBase dark:bg-darkBg"
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-4 pb-3 bg-bgBase dark:bg-darkBg z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-1">
          <IconButton icon={CaretLeft} onPress={() => router.back()} accessibilityLabel="Go back" style={{ marginLeft: -4 }} />
          <SellerInfoRow 
            name="Amina Y." 
            imageUrl="https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200"
            isVerified={true}
            subtitle="Order: MacBook Pro M1"
          />
        </View>
        <TouchableOpacity onPress={handleHeaderMenu} className="p-2 -mr-2">
          <DotsThreeVertical size={24} color={colors.primaryText} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Safety Banner */}
      <View className="bg-warning/10 dark:bg-darkWarning/20 p-3 px-4 flex-row items-start gap-3">
        <ShieldWarning size={20} color={colors.warning} weight="fill" className="mt-0.5 shrink-0" />
        <Text className="flex-1 text-[12px] font-sora text-primaryText dark:text-darkText leading-relaxed">
          Keep payments and communication on Soldbay. Never share your bank details or pay in advance off-app.
        </Text>
      </View>

      {/* Messages Area */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-center text-[11px] font-sora-semibold text-secondaryText/50 dark:text-borderDark/50 mb-2">
          TODAY
        </Text>

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            text={msg.text}
            isMine={msg.isMine}
            timestamp={msg.timestamp}
            isRead={msg.isRead}
            onLongPress={() => handleLongPressMessage(msg)}
          />
        ))}
      </ScrollView>

      {/* Input Area */}
      <View 
        className="px-4 py-3 bg-bgBase dark:bg-darkBg flex-row items-end gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TextInput
          className="flex-1 min-h-[44px] max-h-[120px] bg-primaryText/5 dark:bg-darkBgStep rounded-2xl px-4 pt-3 pb-3 text-[15px] font-sora text-primaryText dark:text-darkText"
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity 
          onPress={handleSend}
          disabled={!inputText.trim()}
          className={`w-11 h-11 rounded-full items-center justify-center shrink-0 ${ inputText.trim() ? 'bg-accent' : 'bg-borderLight dark:bg-darkBgStep' }`}
        >
          <PaperPlaneRight 
            size={20} 
            color={inputText.trim() ? '#FFF' : colors.secondaryText} 
            weight={inputText.trim() ? 'fill' : 'regular'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
