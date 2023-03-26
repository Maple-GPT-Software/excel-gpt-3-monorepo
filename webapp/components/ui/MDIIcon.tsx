import Icon from '@mdi/react';
import React from 'react';

interface MDIIconProps {
  path: string;
  size?: number;
  fill?: string;
  className?: string;
  color?: string;
}

const MDIIcon: React.FC<MDIIconProps> = ({ path, size, className, color }) => {
  return (
    <Icon
      path={path}
      size={size || 1}
      className={className}
      color={color ?? 'black'}
    />
  );
};

export default MDIIcon;
