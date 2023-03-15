import React from 'react';
import Icon from '@mdi/react';

interface MDIIconProps {
  path: string;
  size?: number;
  fill?: string;
  className?: string;
}

const MDIIcon: React.FC<MDIIconProps> = ({ path, size, className }) => {
  return <Icon path={path} size={size || 1} className={className} />;
};

export default MDIIcon;
