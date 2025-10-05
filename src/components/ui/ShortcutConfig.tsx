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

export const shortcutConfig: ShortcutConfigItem[] = [
    { combo: 'R', label: 'Start / Stop Recording', action: (props) => props.isRecording ? props.stopRecording() : props.startRecording() },
    { combo: 'S', label: 'Toggle Screen Share', action: (props) => props.toggleScreenCapture() },
    { combo: 'C', label: 'Toggle Camera', action: (props) => props.toggleCamera() },
    { combo: 'A', label: 'Toggle Microphone', action: (props) => props.toggleAudio() },
];