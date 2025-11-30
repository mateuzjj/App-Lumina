
import React from 'react';
import { 
  Home, Smartphone, Plane, Coffee, ShoppingBag, 
  Zap, Car, Wifi, Briefcase, HeartPulse, Music, Gamepad2, 
  HelpCircle, CreditCard, Banknote, QrCode, Wallet, Target
} from 'lucide-react';

interface IconMapperProps {
  iconName: string;
  className?: string;
}

export const IconMapper: React.FC<IconMapperProps> = ({ iconName, className }) => {
  const props = { className };
  
  switch (iconName) {
    case 'Home': return <Home {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Plane': return <Plane {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Car': return <Car {...props} />;
    case 'Wifi': return <Wifi {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Gamepad2': return <Gamepad2 {...props} />;
    case 'CreditCard': return <CreditCard {...props} />;
    case 'Banknote': return <Banknote {...props} />;
    case 'QrCode': return <QrCode {...props} />;
    case 'Wallet': return <Wallet {...props} />;
    case 'Target': return <Target {...props} />;
    default: return <HelpCircle {...props} />;
  }
};
