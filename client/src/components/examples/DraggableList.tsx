import { useState } from 'react';
import DraggableList from '../campaigns/DraggableList';

interface Item {
  id: string;
  name: string;
}

export default function DraggableListExample() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Send Email' },
    { id: '2', name: 'Send SMS' },
    { id: '3', name: 'AI Call' },
  ]);

  return (
    <div className="w-full max-w-md">
      <DraggableList
        items={items}
        onReorder={setItems}
        renderItem={(item, index) => (
          <span className="text-sm">
            <span className="text-muted-foreground mr-2">#{index + 1}</span>
            {item.name}
          </span>
        )}
      />
    </div>
  );
}
