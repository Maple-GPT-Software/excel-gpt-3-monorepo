import React from 'react';

import './Icon.style.css';

interface IconProps {
  pathName: SVG_PATH_KEYS;
  onClick?: () => void;
  width?: number;
  height?: number;
  strokeColor?: string;
  className?: string;
  styles?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  pathName,
  onClick,
  width = 24,
  height = 24,
  strokeColor = 'black',
  className = '',
  styles,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ width, height, cursor: 'pointer', ...styles }}
      viewBox={`0 0 24 24`}
      strokeWidth={1.5}
      stroke={strokeColor}
      onClick={onClick}
      className={`icon ${className}`}
    >
      {SVG_PATHS[pathName].map((path) => {
        return <path strokeLinecap="round" strokeLinejoin="round" d={path} />;
      })}
    </svg>
  );
};

export default Icon;

type SVG_PATH_KEYS =
  | 'THUMB_UP'
  | 'THUMB_DOWN'
  | 'ARROW_RIGHT_ON_RECT'
  | 'ARROW_LEFT_ON_RECT'
  | 'PENCIL'
  | 'CLOSE'
  | 'CHECK'
  | 'BOOKMARK'
  | 'CHAT';

type SVG_PATHS_TYPE = {
  [key in SVG_PATH_KEYS]: string[];
};

const SVG_PATHS: SVG_PATHS_TYPE = {
  THUMB_UP: [
    'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  ],
  THUMB_DOWN: [
    'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17',
  ],
  ARROW_RIGHT_ON_RECT: [
    'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
  ],
  ARROW_LEFT_ON_RECT: [
    'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  ],
  PENCIL: [
    'M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z',
    'M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z',
  ],
  CLOSE: [
    'M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z',
  ],
  CHECK: [
    'M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z',
  ],
  BOOKMARK: ['M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'],
  CHAT: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
};
