import { elevation } from "../theme/elevation";
import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View style={elevation.raised} className="flex-1 w-full max-w-[171px] bg-surface rounded-2xl mb-4">
      <View className="rounded-2xl overflow-hidden w-full">
        {/* Image Placeholder */}
        <View className="w-full h-[176px] bg-border opacity-65" />
        
        {/* Content Block */}
        <View className="p-3">
          {/* Title Line 1 */}
          <View className="w-[118px] h-[12px] bg-border rounded-sm mb-2" />
          {/* Title Line 2 */}
          <View className="w-[74px] h-[12px] bg-border rounded-sm mb-3" />
          {/* Price Line */}
          <View className="w-[56px] h-[15px] bg-border rounded-sm mb-3" />
          
          {/* Badge Row */}
          <View className="flex-row items-center">
            <View className="w-[13px] h-[13px] bg-border rounded-full mr-1.5" />
            <View className="w-[42px] h-[10px] bg-border rounded-sm" />
          </View>
        </View>
      </View>
    </View>
  );
}
