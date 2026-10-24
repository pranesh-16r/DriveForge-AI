import React, { createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { gtaSoundEngine } from '../../utils/soundEffects';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export const Tabs = ({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-start rounded-2xl bg-[#0F1115] p-1.5 border border-white/10 text-gray-400 overflow-x-auto max-w-full scrollbar-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({
  value,
  children,
  icon,
  className,
}: {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isSelected = context.value === value;

  return (
    <button
      onClick={() => {
        gtaSoundEngine.playClick();
        context.onValueChange(value);
      }}
      className={cn(
        'relative inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase transition-colors duration-200 cursor-pointer select-none',
        isSelected ? 'text-black font-black' : 'text-gray-400 hover:text-white',
        className
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="activeTabBadge"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EAB308] shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
};

export const TabsContent = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  );
};
