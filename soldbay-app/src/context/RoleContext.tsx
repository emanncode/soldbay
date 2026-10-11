import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';

export type UserRole = 'buyer' | 'seller';

interface RoleContextType {
  role: UserRole;
  isSeller: boolean;
  setRole: (role: UserRole) => void;
  switchToSeller: () => void;
  switchToBuyer: () => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('buyer');
  const router = useRouter();

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const switchToSeller = () => {
    setRoleState('seller');
    router.replace('/(tabs)/hub');
  };

  const switchToBuyer = () => {
    setRoleState('buyer');
    router.replace('/(tabs)');
  };

  const toggleRole = () => {
    if (role === 'buyer') {
      switchToSeller();
    } else {
      switchToBuyer();
    }
  };

  const isSeller = role === 'seller';

  return (
    <RoleContext.Provider
      value={{
        role,
        isSeller,
        setRole,
        switchToSeller,
        switchToBuyer,
        toggleRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
