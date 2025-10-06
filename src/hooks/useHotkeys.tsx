import { useEffect } from 'react';

interface ShortcutConfigProps {
  isRecording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
  toggleScreenCapture: () => void;
  toggleCamera: () => void;
  toggleAudio: () => void;
}

interface ShortcutConfigItem {
  combo: string;
  label: string;
  action: (props: ShortcutConfigProps) => void;
}

export const useHotkeys = (
    config: { [key: string]: ShortcutConfigItem },
    props: ShortcutConfigProps
): void => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey) {
                const pressedKey = event.key.toUpperCase();

                const shortcut = Object.values(config).find(s => s.combo === pressedKey);

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