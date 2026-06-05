interface AzorLogoProps {
  size?: number
}

export default function AzorLogo({ size = 40 }: AzorLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="10" fill="#5A9BD5" />
      <text
        x="32"
        y="46"
        fontFamily="Arial Black, sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="#1B2A4A"
        textAnchor="middle"
        letterSpacing="1"
      >
        AZ
      </text>
      <rect x="8" y="50" width="48" height="3" rx="1.5" fill="#1B2A4A" opacity="0.4" />
    </svg>
  )
}
