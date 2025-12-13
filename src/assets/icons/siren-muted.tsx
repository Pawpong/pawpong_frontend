import React from 'react';

export default function SirenMuted(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        x="4"
        y="12.4961"
        width="12"
        height="3"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 12.4961H14.5V7.99609C14.5 5.51081 12.4853 3.49609 10 3.49609C7.51472 3.49609 5.5 5.51081 5.5 7.99609V12.4961Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.4961H12V11.4961C12 10.3915 11.1046 9.49609 10 9.49609C8.89543 9.49609 8 10.3915 8 11.4961V12.4961Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
