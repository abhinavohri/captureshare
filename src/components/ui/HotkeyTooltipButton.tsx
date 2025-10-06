// src/components/ui/HotkeyTooltipButton.tsx
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface HotkeyButtonProps {
  children: React.ReactNode;
  tooltipLabel: string;
  hotkeyCombo: string;
  disabled?: boolean;
}

export const HotkeyTooltipButton = ({
  children,
  tooltipLabel,
  hotkeyCombo,
  disabled,
  ...props
}: HotkeyButtonProps) => {

  const renderTooltip = (props: any) => (
    <Tooltip id={`button-tooltip-${tooltipLabel}`} {...props}>
      <div className="d-flex justify-content-between align-items-center">
        <span>{tooltipLabel}</span>
        <kbd className="ms-2 small bg-dark text-light">{`Ctrl+${hotkeyCombo}`}</kbd>
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 250 }}
      overlay={renderTooltip}
      trigger={['hover', 'focus']}
    >
      <span>
        <Button {...props} disabled={disabled}>
          {children}
        </Button>
      </span>
    </OverlayTrigger>
  );
};