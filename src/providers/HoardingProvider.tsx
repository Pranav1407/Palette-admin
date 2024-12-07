import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockHoardings } from '../data/mockHoardings';

// Define types
type Hoarding = (typeof mockHoardings)[number];
type Hoardings = Hoarding[];

type HoardingContextType = {
  hoardings: Hoardings;
  isLoading: boolean;
  error: Error | null;
  refetchHoardings: () => void;
};

const HoardingContext = createContext<HoardingContextType | undefined>(undefined);

const fetchHoardings = async (): Promise<Hoardings> => {

    return new Promise((resolve) => {
        setTimeout(() => {
        //@ts-expect-error "mockHoardings" is not assignable to type "Hoardings"
        resolve(mockHoardings);
        }, 1000);
    });
};
  

export function HoardingProvider({ children }: { children: ReactNode }) {
    const {
        data: hoardings = [] as Hoardings,
        isLoading,
        error,
        refetch: refetchHoardings,
    } = useQuery({
        queryKey: ['hoardings'],
        queryFn: fetchHoardings,
    });

    return (
        <HoardingContext.Provider
        value={{
            hoardings,
            isLoading,
            error: error as Error | null,
            refetchHoardings,
        }}
        >
        {children}
        </HoardingContext.Provider>
    );
}
  

// Custom hook to use the hoarding context
export function useHoardings() {
  const context = useContext(HoardingContext);
  if (context === undefined) {
    throw new Error('useHoardings must be used within a HoardingProvider');
  }
  return context;
}
