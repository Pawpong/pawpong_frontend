import React from 'react';

export default function FilterHeader(props: React.ComponentProps<'div'>) {
  return <div className="flex items-center justify-between mb-3 md:mb-4" {...props} />;
}
