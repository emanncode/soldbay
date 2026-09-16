import { elevation } from "../theme/elevation";
import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View style={elevation.raised} className="flex-1 w-full max-w-xs bg-surface rounded-2xl mb-4">
      <View className="rounded-2xl overflow-hidden w-full">
        {/* Image Placeholder */}
        <View className="w-full h-44 bg-border opacity-65" />
        
        {/* Content Block */}
        <View className="p-3">
          {/* Title Line 1 */}
          <View className="w-28 h-3 bg-border rounded-sm mb-2" />
          {/* Title Line 2 */}
          <View className="w-20 h-3 bg-border rounded-sm mb-3" />
          {/* Price Line */}
          <View className="w-14 h-4 bg-border rounded-sm mb-3" />
          
          {/* Badge Row */}
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-border rounded-full mr-1.5" />
            <View className="w-10 h-2.5 bg-border rounded-sm" />
          </View>
        </View>
      </View>
    </View>
  );
}
