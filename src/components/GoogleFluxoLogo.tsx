import React from 'react';

interface GoogleFluxoLogoProps {
  className?: string;
  size?: number;
}

export const GoogleFluxoLogo: React.FC<GoogleFluxoLogoProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Ícone Fluxo Adapti estilo Google"
    >
      {/* 
        Geometric Fluxo infinity loop / pinwheel composed of the 4 authentic Google brand colors:
        Blue: #4285F4
        Red: #EA4335
        Yellow: #FBBC04
        Green: #34A853
      */}
      {/* Top arc - Google Blue */}
      <path
        d="M24 4C15.163 4 8 11.163 8 20C8 24.5 9.8 28.5 12.8 31.4L18.4 25.8C16.9 24.3 16 22.3 16 20C16 15.582 19.582 12 24 12C28.418 12 32 15.582 32 20H40C40 11.163 32.837 4 24 4Z"
        fill="#4285F4"
      />
      
      {/* Right curve - Google Red */}
      <path
        d="M40 20C40 24.5 38.2 28.5 35.2 31.4L29.6 25.8C31.1 24.3 32 22.3 32 20C32 15.582 28.418 12 24 12V4C32.837 4 40 11.163 40 20Z"
        fill="#EA4335"
      />

      {/* Bottom loop - Google Yellow */}
      <path
        d="M24 44C32.837 44 40 36.837 40 28C40 23.5 38.2 19.5 35.2 16.6L29.6 22.2C31.1 23.7 32 25.7 32 28C32 32.418 28.418 36 24 36C19.582 36 16 32.418 16 28H8C8 36.837 15.163 44 24 44Z"
        fill="#FBBC04"
      />

      {/* Left curve - Google Green */}
      <path
        d="M8 28C8 23.5 9.8 19.5 12.8 16.6L18.4 22.2C16.9 23.7 16 25.7 16 28C16 32.418 19.582 36 24 36V44C15.163 44 8 36.837 8 28Z"
        fill="#34A853"
      />

      {/* Center dynamic core - subtle accent fusion */}
      <circle cx="24" cy="24" r="3.5" fill="#1a73e8" />
    </svg>
  );
};
