import React from 'react';
import { CollapsibleContent } from '../ui/collapsible';

export default function FilterContent(props: React.ComponentProps<'div'>) {
  return (
    <CollapsibleContent>
      <div className="space-y-2" {...props} />
    </CollapsibleContent>
  );
}
