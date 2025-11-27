export interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface BentoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export interface GlassInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void; 
}

export interface GlowSwitchProps {
  checked: boolean;
  onChange: (newState: boolean) => void;
}