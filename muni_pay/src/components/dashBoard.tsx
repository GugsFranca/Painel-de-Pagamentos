'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import { TrendingUp, Assessment, LocationCity } from '@mui/icons-material';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ThemeProvider } from '@mui/material/styles';
import useFetchMunicipios from '@/components/hooks/fetchChartHook';
import useFetchAllMunicipios from '@/components/hooks/getAllChartsHook';
import theme from "@/theme/dashTheme";
import { StatusChip } from '@/components/ui/status';

interface Summary {
    name: string;
    mesesMF: Status[];
    mesesRateio: Status[];
}

export default function Dashboard() {
    const { tabelas: allTables, loading: allLoading } = useFetchAllMunicipios();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('selectedYearDash');
        if (saved) setYear(parseInt(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedYearDash', year.toString());
    }, [year]);
    useEffect(() => {
        if (!allTables?.length) return;
        const uniqueYears = [...new Set(allTables.map(table =>
            parseInt(table.name.split('_')[1]))
        )].filter(y => !isNaN(y));
        setYears(uniqueYears.sort((a, b) => b - a));
        if (!uniqueYears.includes(year)) setYear(uniqueYears[0]);
    }, [allTables]);

    const tableA = `marqueFacil_${year}`;
    const tableB = `rateio_${year}`;
    const { municipios: mA } = useFetchMunicipios(tableA);
    const { municipios: mB } = useFetchMunicipios(tableB);
    const loading = !mA || !mB || allLoading;

    const summary = useMemo(() => {
        if (!mA || !mB) return [];
        const getData = (data: any[], table: string) =>
            data.find(t => t.name === table)?.data || [];

        const tA = getData(mA, tableA);
        const tB = getData(mB, tableB);

        const process = (data: any[], isRateio = false) => {
            const map = new Map<string, { meses: Status[] }>();
            data.forEach(row => {
                const meses = row.meses as Status[];
                map.set(row.name, { meses: isRateio ? meses.filter(v => v !== 0) : meses });
            });
            return map;
        };
        const mapA = process(tA);
        const mapB = process(tB, true);

        return Array.from(new Set([...mapA.keys(), ...mapB.keys()])).map(name => ({
            name,
            mesesMF: mapA.get(name)?.meses || [],
            mesesRateio: mapB.get(name)?.meses || []
        }));
    }, [mA, mB]);



    const statusMF = (meses: Status[]) => !meses.some(s => s === 2 || s === 4);
    const statusRateio = (meses: Status[]) => {
        const qtdDevedor = meses.filter(v => v === 2).length;
        return qtdDevedor < 3;
    };
    const aptoGlobal = (row: Summary) => statusMF(row.mesesMF) && statusRateio(row.mesesRateio);

    const globalStatus = useMemo(() => {
        const total = summary.length;
        const aptos = summary.filter(aptoGlobal).length;
        return { total, aptos, percent: total ? Math.round((aptos / total) * 100) : 0 };
    }, [summary]);

    const pieData = [
        { name: 'Aptos', value: globalStatus.aptos, color: theme.palette.success.main },
        { name: 'Não Aptos', value: globalStatus.total - globalStatus.aptos, color: theme.palette.error.main }
    ];

    if (loading) return (
        <ThemeProvider theme={theme}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Box textAlign="center">
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" mt={2}>Carregando dados...</Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Header */}
                <Box mb={4}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Assessment fontSize="large" />
                        <Typography variant="h4">Dashboard de Municípios - {year}</Typography>
                    </Box>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="select-year-label">Selecionar Ano</InputLabel>
                        <Select
                            labelId="select-year-label"
                            id="select-year"
                            value={year}
                            label="Selecionar Ano"
                            onChange={e => setYear(Number(e.target.value))}
                        >
                            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                {/* Stats Cards */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 2fr' }} gap={3} mb={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TrendingUp sx={{ fontSize: 48, mb: 2, color: 'secondary.main' }} />
                            <Typography variant="h6">Status Global</Typography>
                            <Typography variant="h2" color={globalStatus.percent >= 80 ? 'success.main' : 'error.main'}>
                                {globalStatus.percent}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {globalStatus.aptos} aptos de {globalStatus.total}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
                            <LocationCity /> Distribuição de Aptidão
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Box>

                {/* Tables */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '1fr 1fr' }} gap={3} mb={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Aptidão para Crédito</Typography>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Município</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {summary.map(row => (
                                        <TableRow key={row.name}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="center">
                                                <StatusChip isPositive={aptoGlobal(row)} label={aptoGlobal(row) ? 'Apto' : 'Não Apto'} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Detalhamento por Sistema</Typography>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Município</TableCell>
                                        <TableCell align="center">MarqueFácil</TableCell>
                                        <TableCell align="center">Rateio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {summary.map(row => (
                                        <TableRow key={row.name}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="center">
                                                <StatusChip isPositive={statusMF(row.mesesMF)} label={statusMF(row.mesesMF) ? 'OK' : 'Pendente'} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <StatusChip isPositive={statusRateio(row.mesesRateio)} label={statusRateio(row.mesesRateio) ? 'OK' : 'Pendente'} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}