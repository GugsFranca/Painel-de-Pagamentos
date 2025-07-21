'use client';
import { use, useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Assessment } from '@mui/icons-material';
import 'dayjs/locale/pt-br';

import PainelRateio from '@/components/rateio_panel';
import PainelMarqueFacil from '@/components/facil_panel';
import theme from "@/theme/dashTheme";
import { LoginModal } from '@/components/loginModal';

export default function Home() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from(
      { length: currentYear - 2023 + 2 },
      (_, i) => 2024 + i
    );
    setYears(availableYears);
  }, []);

  useEffect(() => {
    const savedYear = localStorage.getItem('selectedYear');
    if (savedYear) setYear(parseInt(savedYear, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedYear', year.toString());
  }, [year]);

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        sx={{
          bgcolor: 'primary.main',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Assessment sx={{ fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'common.white' }}>
              Painel Anual de Pagamentos
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'common.white' }}>Selecionar Ano</InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              label="Selecionar Ano"
              sx={{
                color: 'common.white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'common.white',
                },
                '& .MuiSvgIcon-root': { color: 'common.white' }
              }}
            >
              {years.map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Box sx={{
        p: 2,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 4,
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          p: 3,
          m: 2

        }}>

          <PainelRateio year={year} />
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            p: 3,
            m: 2,
            overflow: 'auto',
            maxWidth: '100%',
          }}
        >
          <PainelMarqueFacil year={year} />
        </Box>
        {showLoginModal && (
          <LoginModal
            isOpen={true}
            onClose={() => {
              setShowLoginModal(false);
            }}
          />
        )}
      </Box>
    </ThemeProvider >
  );
}