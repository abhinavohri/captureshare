export interface ShortcutConfigProps {
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

export const shortcutConfig: { [key: string]: ShortcutConfigItem } = {
    startRecording: {
        combo: 'R',
        label: 'Start Recording',
        action: (props) => { if (!props.isRecording) props.startRecording(); }
    },
    stopRecording: {
        combo: 'E',
        label: 'Stop Recording',
        action: (props) => { if (props.isRecording) props.stopRecording(); }
    },
    toggleScreenCapture: {
        combo: 'S',
        label: 'Toggle Screenshare',
        action: (props) => props.toggleScreenCapture()
    },
    toggleCamera: {
        combo: 'C',
        label: 'Toggle Camera',
        action: (props) => props.toggleCamera()
    },
    toggleAudio: {
        combo: 'A',
        label: 'Toggle Microphone',
        action: (props) => props.toggleAudio()
    },
};