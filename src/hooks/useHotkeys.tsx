import { useEffect } from 'react';

export interface Shortcut<T> {
  combo: string;
  label: string;
  action: (props: T) => void;
}

export const useHotkeys = <T,>(config: Shortcut<T>[], props: T): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const pressedKey = event.key.toUpperCase();
        
        const shortcut = config.find(s => s.combo === pressedKey);

        if (shortcut) {
          event.preventDefault();
          shortcut.action(props);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config, props]);
};