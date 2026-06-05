import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface Crumb {
  label: string
  path?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 0.5 }}>
            {breadcrumbs.map((crumb, i) =>
              crumb.path ? (
                <Link
                  key={i}
                  underline="hover"
                  color="text.secondary"
                  sx={{ cursor: 'pointer', fontSize: 13 }}
                  onClick={() => navigate(crumb.path!)}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={i} color="text.primary" fontSize={13}>{crumb.label}</Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h2" sx={{ color: 'text.primary', mb: subtitle ? 0.25 : 0 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Box>
  )
}
