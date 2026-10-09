import React, { useState } from 'react';
import { View, FlatList, Modal as RNModal} from 'react-native';
import { SearchBar } from './SearchBar';
import { ListItem } from './ListItem';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

export interface CampusPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (campus: string) => void;
  campuses: string[];
}

export function CampusPicker({ visible, onClose, onSelect, campuses }: CampusPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampuses = campuses.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RNModal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-bgBase dark:bg-darkBg pt-12">
        <View className="px-4 pb-4 flex-row items-center gap-3 border-b border-primaryText/15 dark:border-borderDark/24">
          <View className="flex-1">
            <SearchBar 
              placeholder="Search institutions..." 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View className="justify-center">
            <Button variant="secondary" size="sm" label="Close" onPress={onClose} fullWidth={false} />
          </View>
        </View>

        {filteredCampuses.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <EmptyState 
              title="No campus found" 
              description="We couldn't find an institution matching your search." 
              icon={<EmptyStateIcon />}
            />
          </View>
        ) : (
          <FlatList
            data={filteredCampuses}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <ListItem 
                title={item} 
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        )}
      </View>
    </RNModal>
  );
}

function EmptyStateIcon() {
  return <View className="w-10 h-10 bg-primaryText/5 dark:bg-darkBgStep rounded-full" />;
}
