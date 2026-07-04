// Inline icon set — paths lifted directly from the Claude Design prototype so
// the visual language (stroke widths, proportions) matches exactly.

export function SparkIcon({ size = 20, fill = '#117468' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z" />
    </svg>
  );
}

export function BackIcon({ size = 20, stroke = '#37433d' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function CloseIcon({ size = 18, stroke = '#37433d', strokeWidth = '2.4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, stroke = '#fbfdfb' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronRight({ size = 20, stroke = '#117468' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function PlusIcon({ size = 18, stroke = '#fbfdfb', strokeWidth = '2.6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ size = 18, stroke = '#fbfdfb', strokeWidth = '2.4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function SearchIcon({ size = 17, stroke = '#9a9384' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

export function PainIcon({ size = 22, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z" />
    </svg>
  );
}

export function FatigueIcon({ size = 22, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2.5" />
      <path d="M20.5 10.5v3" />
    </svg>
  );
}

export function NauseaIcon({ size = 22, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 9.5h.01M15.5 9.5h.01M8.5 16c1-1.5 6-1.5 7 0" />
    </svg>
  );
}

export function HeadacheIcon({ size = 22, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="6.5" />
      <path d="M12 2.5v2M8 4l1.5 2M16 4l-1.5 2" />
    </svg>
  );
}

export function CalendarIcon({ size = 19, stroke = '#117468', strokeWidth = '1.9', fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

export function ClockIcon({ size = 19, stroke = '#117468' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CameraIcon({ size = 21, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M8 5l1.2-2h5.6L16 5" />
    </svg>
  );
}

export function DocIcon({ size = 24, stroke = '#117468' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v5h5" />
      <path d="M18 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

export function TrendIcon({ size = 22, stroke = '#cc6a44' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  );
}

export function EditIcon({ size = 18, stroke = '#37433d' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function TrashIcon({ size = 18, stroke = '#b0473a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    </svg>
  );
}

export function DoctorIcon({ size = 17, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function BellIcon({ size = 19, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function ShareIcon({ size = 17, stroke = '#fbfdfb' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4M12 2v14" />
    </svg>
  );
}

export function AlertIcon({ size = 26, stroke = '#b0473a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function LogoutIcon({ size = 28, stroke = '#b0473a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function PhotoIcon({ size = 24, stroke = '#9a9384' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function FemaleIcon({ size = 26, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V22M8.5 19h7" />
    </svg>
  );
}

export function MaleIcon({ size = 26, stroke = '#5b6a64' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5.5" />
      <path d="M14 10l6-6M15 4h5v5" />
    </svg>
  );
}

export function NavHomeIcon({ size = 23, stroke = '#a9b0ab', fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.7" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function NavInsightsIcon({ size = 23, stroke = '#a9b0ab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l3-4 4 3 4-6" />
    </svg>
  );
}

export function NavVisitsIcon({ size = 23, stroke = '#a9b0ab', fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 5.6a5 5 0 0 0-8.8-1.6A5 5 0 0 0 3.2 5.6c-1.6 2.3-.9 5.4 1.8 8L12 20l7-6.4c2.7-2.6 3.4-5.7 1.8-8z" />
    </svg>
  );
}

export function NavSettingsIcon({ size = 23, stroke = '#a9b0ab' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2" />
    </svg>
  );
}
