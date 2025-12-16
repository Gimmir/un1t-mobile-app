import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function PrimaryButton({
  title,
  variant = 'primary',
  ...touchableProps
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`h-[52px] justify-center items-center active:opacity-90 ${
        variant === 'primary' 
          ? 'bg-white' 
          : 'border border-white bg-transparent'
      }`}
      {...touchableProps}
    >
      <Text
        className={`font-bold text-base tracking-widest ${
          variant === 'primary' ? 'text-black' : 'text-white'
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
