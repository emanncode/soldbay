import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { X, Plus, Trash } from 'phosphor-react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';
import { helpfulDialog } from '../../lib/dialogs';

import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { FilterChip } from '../../components/ui/FilterChip';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { colors } from '../../theme/tokens';
import { formatPriceInput, parseRawPrice } from '../../lib/formatters';

const CATEGORY_OPTIONS = [
  { label: 'Textbooks', value: 'Textbooks' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Dorm Essentials', value: 'Dorm Essentials' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Other', value: 'Other' },
];

const CONDITION_OPTIONS = ['New', 'Used - Like New', 'Used - Good', 'Fair'];

const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
];

export default function CreateListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('New');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPhoto = () => {
    if (photos.length >= 5) {
      helpfulDialog('Photo Limit', 'You can upload up to 5 photos per listing.');
      return;
    }
    // Simulate photo selection by picking the next mock image
    const nextPhoto = MOCK_PHOTOS[photos.length % MOCK_PHOTOS.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (photos.length === 0) {
      helpfulDialog('Photo Required', 'Please add at least one photo of the item.');
      return;
    }
    if (!title.trim()) {
      helpfulDialog('Title Required', 'Please enter a title for your listing.');
      return;
    }
    if (!category) {
      helpfulDialog('Category Required', 'Please select a category.');
      return;
    }
    const rawPrice = parseRawPrice(price);
    if (!rawPrice || Number(rawPrice) <= 0) {
      helpfulDialog('Price Required', 'Please enter a valid selling price greater than ₦0.');
      return;
    }

    if (discountPrice.trim()) {
      const rawDiscount = parseRawPrice(discountPrice);
      if (Number(rawDiscount) >= Number(rawPrice)) {
        helpfulDialog(
          'Invalid Discount',
          'Discount price must be less than the regular price.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      helpfulDialog(
        'Listing Posted!',
        'Your item is now live and visible to buyers on your campus.',
        () => router.replace('/(tabs)/hub')
      );
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bgBase dark:bg-darkBg"
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-3 border-b border-primaryText/10 dark:border-borderDark/24 bg-bgBase dark:bg-darkBg z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-2">
          <IconButton
            icon={X}
            onPress={() => router.back()}
            accessibilityLabel="Close"
            style={{ marginLeft: -4 }}
          />
          <Text className="text-title-2 text-primaryText dark:text-darkText font-sora-bold">
            New Listing
          </Text>
        </View>
        <Text className="text-[15px] font-sora-semibold text-secondaryText dark:text-borderDark">
          Draft
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo Gallery Picker */}
        <View className="mb-6">
          <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText mb-2">
            Photos (Up to 5)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {photos.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                className="w-[100px] h-[100px] rounded-md overflow-hidden bg-primaryText/5 dark:bg-darkBgStep relative"
              >
                <Image
                  source={{ uri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                {/* Cover Photo Badge */}
                {index === 0 && (
                  <View className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 items-center">
                    <Text className="text-[11px] font-sora text-white">Cover</Text>
                  </View>
                )}
                {/* Delete Photo Button */}
                <TouchableOpacity
                  onPress={() => handleRemovePhoto(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 items-center justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash size={12} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>
              </View>
            ))}

            {photos.length < 5 && (
              <TouchableOpacity
                onPress={handleAddPhoto}
                activeOpacity={0.7}
                className="w-[100px] h-[100px] rounded-md border-2 border-dashed border-primaryText/20 dark:border-borderDark/30 items-center justify-center bg-primaryText/5 dark:bg-darkBgStep/50"
              >
                <Plus
                  size={24}
                  color={isDark ? colors.borderDark : colors.secondaryText}
                  weight="bold"
                />
                <Text className="text-[11px] font-sora text-secondaryText dark:text-borderDark mt-1">
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Title */}
        <View className="mb-5">
          <Input
            label="Title"
            placeholder="What are you selling?"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category */}
        <View className="mb-5">
          <Select
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
            value={category}
            onSelect={setCategory}
          />
        </View>

        {/* Condition */}
        <View className="mb-5">
          <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText mb-2">
            Condition
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CONDITION_OPTIONS.map((item) => (
              <FilterChip
                key={item}
                label={item}
                selected={condition === item}
                onPress={() => setCondition(item)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Price & Discount Price */}
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1">
            <Input
              label="Price (₦)"
              placeholder="0"
              keyboardType="number-pad"
              value={price}
              onChangeText={(val) => setPrice(formatPriceInput(val))}
            />
          </View>
          <View className="flex-1">
            <Input
              label="Discount Price (opt)"
              placeholder="0"
              keyboardType="number-pad"
              value={discountPrice}
              onChangeText={(val) => setDiscountPrice(formatPriceInput(val))}
            />
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Textarea
            label="Description"
            placeholder="Describe the item (condition, reason for selling, accessories included)..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <View className="mt-2">
          <Button
            label={isSubmitting ? 'Posting...' : 'Post Listing'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
