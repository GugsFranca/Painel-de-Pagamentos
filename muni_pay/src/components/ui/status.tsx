// src/components/ui/StatusIcon.tsx
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Chip, SxProps, Theme } from '@mui/material';

interface StatusIconProps {
  isPositive: boolean;
  sx?: SxProps<Theme>;
}
interface StatusChipProps {
  isPositive: boolean;
  label: string;
  sx?: SxProps<Theme>;
}

export const StatusIcon = ({ isPositive, sx }: StatusIconProps) => (
  isPositive ?
    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, ...sx }} /> :
    <CancelIcon sx={{ color: 'error.main', fontSize: 20, ...sx }} />
);
export const StatusChip = ({ isPositive, label, sx }: StatusChipProps) => (
  <Chip
    icon={<StatusIcon isPositive={isPositive} />}
    label={label}
    color={isPositive ? 'success' : 'error'}
    variant="outlined"
    size="small"
    sx={{
      fontWeight: 500,
      '& .MuiChip-icon': { marginLeft: '8px' },
      ...sx
    }}
  />
);