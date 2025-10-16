import { useState, useEffect } from 'react';
import { useElectron } from '@/hooks/useElectron';

export function ElectronInfo() {
  const { isElectron, platform, getItem, setItem } = useElectron();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const loadCount = async () => {
      const savedCount = await getItem<number>('count');
      if (savedCount !== null) {
        setCount(savedCount);
      }
    };
    
    loadCount();
  }, [getItem]);

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await setItem('count', newCount);
  };

  if (!isElectron) {
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-lg font-semibold">Running in browser mode</p>
        <p className="text-sm text-gray-500">
          Electron features are only available when running as a desktop app.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-blue-300 rounded-md bg-blue-50">
      <h3 className="text-lg font-semibold mb-2">Electron Info</h3>
      <p className="mb-2">
        <span className="font-medium">Platform: </span>
        <span className="px-2 py-1 bg-blue-100 rounded text-sm">{platform}</span>
      </p>
      
      <div className="mt-4">
        <p className="mb-2">
          <span className="font-medium">Persistent Counter: </span>
          <span className="px-2 py-1 bg-blue-100 rounded text-sm">{count}</span>
        </p>
        <button
          onClick={handleIncrement}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
        <p className="text-xs text-gray-500 mt-2">
          This counter persists between app restarts using Electron Store
        </p>
      </div>
    </div>
  );
} 