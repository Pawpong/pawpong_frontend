import React from 'react';

export default function BreederTags(props: React.ComponentProps<'div'>) {
  return <div className="flex gap-2 flex-wrap items-start" style={{ maxWidth: 'calc(100vw - 8rem)' }} {...props} />;
}
