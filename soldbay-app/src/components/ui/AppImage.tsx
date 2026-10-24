import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Image, ImageProps } from "expo-image";

export interface AppImageProps extends Omit<ImageProps, "source"> {
  source?: ImageProps["source"];
  uri?: string | null;
  placeholderBlurhash?: string;
  fallbackStyle?: StyleProp<ViewStyle>;
}

export const DEFAULT_IMAGE_BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function AppImage({
  source,
  uri,
  placeholderBlurhash = DEFAULT_IMAGE_BLURHASH,
  contentFit = "cover",
  transition = 200,
  cachePolicy = "memory-disk",
  style,
  fallbackStyle,
  placeholder,
  onError,
  ...props
}: AppImageProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedSource = source || (uri ? { uri } : null);

  if (!resolvedSource || hasError) {
    return (
      <View
        className="w-full h-full bg-primaryText/5 dark:bg-darkBgStep justify-center items-center"
        style={[style as any, fallbackStyle]}
      />
    );
  }

  const resolvedPlaceholder =
    placeholder !== undefined
      ? placeholder
      : placeholderBlurhash
        ? { blurhash: placeholderBlurhash }
        : undefined;

  return (
    <Image
      source={resolvedSource}
      placeholder={resolvedPlaceholder}
      contentFit={contentFit}
      transition={transition}
      cachePolicy={cachePolicy}
      style={style}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
