import React from 'react';

interface BreederProfileSectionProps {
  children: React.ReactNode;
  id?: string;
}

export default function BreederProfileSection({ children, id }: BreederProfileSectionProps) {
  return (
    <div className="space-y-7" id={id}>
      {children}
    </div>
  );
}
