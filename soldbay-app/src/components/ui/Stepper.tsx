import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

export interface StepperStep {
  label: string;
  state: 'completed' | 'current' | 'pending';
}

export interface StepperProps {
  steps: StepperStep[];
  style?: StyleProp<ViewStyle>;
}

export function Stepper({ steps, style }: StepperProps) {
  return (
    <View style={style}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isFilled = step.state === 'completed' || step.state === 'current';
        
        return (
          <View key={index} className="flex-row">
            <View className="items-center mr-3">
              <View 
                className={`w-3 h-3 rounded-full mt-1.5 ${
                  isFilled ? 'bg-accent' : 'bg-primaryText/15 dark:bg-borderDark/24'
                }`} 
              />
              {!isLast && (
                <View 
                  className={`w-0.5 flex-1 my-1 ${
                    step.state === 'completed' ? 'bg-accent' : 'bg-primaryText/15 dark:bg-borderDark/24'
                  }`} 
                />
              )}
            </View>
            
            <View className={`pb-6 ${isLast ? '' : 'flex-1'}`}>
              <Text 
                className={`font-sora-semibold text-[15px] ${
                  step.state === 'current' 
                    ? 'text-primaryText dark:text-darkText' 
                    : 'text-secondaryText dark:text-borderDark'
                }`}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
