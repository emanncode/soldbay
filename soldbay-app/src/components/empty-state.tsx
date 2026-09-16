import { View, Text } from "react-native";
import { ArrowClockwise } from "phosphor-react-native";
import { Button } from "./button";
import { EmptyCrateIllustration } from "./icons/empty-crate-illustration";

interface EmptyStateProps {
  variant: "filtered" | "empty";
  onClearFilters?: () => void;
}

export function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
  const isFiltered = variant === "filtered";
  
  const title = isFiltered ? "No listings found" : "No listings yet";
  const body = isFiltered 
    ? "No items match your active filters on campus right now."
    : "Check back soon for new listings";

  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-[96px] h-[96px] rounded-full bg-surface border border-border items-center justify-center mb-6">
        <EmptyCrateIllustration size={48} />
      </View>
      
      <Text className="text-[18px] font-sora-semibold text-foreground mb-2 text-center">
        {title}
      </Text>
      
      <Text className="text-[13px] font-sora text-text-secondary text-center mb-8 max-w-[280px]">
        {body}
      </Text>

      {isFiltered && onClearFilters && (
        <Button
          variant="primary"
          label="Clear filters"
          onPress={onClearFilters}
          icon={<ArrowClockwise size={18} color="#F1EEE4" />}
          className="w-full max-w-[200px]"
        />
      )}
    </View>
  );
}
