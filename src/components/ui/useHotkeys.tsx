import { useEffect } from 'react';

// A generic interface for a single shortcut configuration item.
export interface Shortcut<T> {
  combo: string;
  label: string;
  action: (props: T) => void;
}

export const useHotkeys = <T,>(config: Shortcut<T>[], props: T): void => {
  useEffect(() => {
    // The event is now correctly typed as a KeyboardEvent.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const pressedKey = event.key.toUpperCase();
        
        const shortcut = config.find(s => s.combo === pressedKey);

        if (shortcut) {
          event.preventDefault();
          // The 'props' passed to the action are now type-safe.
          shortcut.action(props);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config, props]); // The dependency array is correct.
};