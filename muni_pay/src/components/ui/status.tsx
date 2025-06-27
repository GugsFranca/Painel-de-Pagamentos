// src/components/ui/StatusIcon.tsx
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Chip, SxProps, Theme } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';


interface StatusIconProps {
  isPositive: boolean;
  sx?: SxProps<Theme>;
}
interface StatusChipProps {
  isPositive: boolean;
  label: string;
  sx?: SxProps<Theme>;
}



type StatusType = 'positive' | 'negative' | 'neutral';

interface StatusIconProps {
  statusType: StatusType;
  sx?: SxProps<Theme>;
}
interface StatusChipProps {
  statusType: StatusType;
  label: string;
  sx?: SxProps<Theme>;
}

export const StatusIcon = ({ statusType, sx }: StatusIconProps) => {
  switch (statusType) {
    case 'positive':
      return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, ...sx }} />;
    case 'negative':
      return <CancelIcon sx={{ color: 'error.main', fontSize: 20, ...sx }} />;
    case 'neutral':
      return <RemoveIcon sx={{ color: 'text.secondary', fontSize: 20, ...sx }} />;
    default:
      return null;
  }
};
export const StatusChip = ({ statusType, label, sx }: StatusChipProps) => (
  <Chip
    icon={<StatusIcon statusType={statusType} isPositive={false} />}
    label={label}
    color={statusType === 'positive' ? 'success' : statusType === 'negative' ? 'error' : 'default'}
    variant="outlined"
    size="small"
    sx={{
      fontWeight: 500,
      '& .MuiChip-icon': { marginLeft: '8px' },
      ...sx
    }}
  />
);