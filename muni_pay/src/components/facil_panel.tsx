'use client'

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Box, Input,
} from '@mui/material';
import useFetchMunicipios from "./hooks/fetchChartHook";
import useDeleteMunicipios from "./hooks/deleteRowHook";
import {
    usePainelFunctions,
} from "./utils";
import { useRef } from 'react';
import { MesCell } from './MesCell';
import DeleteIcon from '@mui/icons-material/Delete';

function verificarStatus(meses: Status[]): boolean {
    return !meses.some(status => status === 2);
}

export default function PainelMarqueFacil({ year }: { year: number }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const tableName = `marqueFacil_${year}`;

    const {
        municipios,
        refetch,
        setMunicipios
    } = useFetchMunicipios(tableName);

    const tabela = municipios!.find(t => t.name === tableName) || municipios![0];


    const { deleteCell } = useDeleteMunicipios(tabela?.id ?? '');

    const {
        marcarProximo,
        limparLinha,
        mesesClick,
        handleAddMunicipio
    } = usePainelFunctions(setMunicipios, tableName);


    const handleDelete = async (rowName: string) => {
        try {
            await deleteCell(rowName);
            await refetch();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={17} align="center" sx={{ backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">PAGAMENTO DO CONTRATO DO MARQUE FÁCIL</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Pessoa</TableCell>
                            {Array.from({ length: 12 }, (_, i) => (
                                <TableCell key={i} align="center">
                                    {new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}
                                </TableCell>
                            ))}
                            <TableCell align="center">Ações</TableCell>
                            <TableCell align="center">Resumo</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabela && tabela.data && Array.isArray(tabela.data) && tabela.data.map((row, rowIdx) => {
                            const qtdPago = row.meses.filter(v => v === 1).length;
                            const qtdDevedor = row.meses.filter(v => v === 2).length;
                            const apto = verificarStatus(row.meses as Status[]);

                            return (
                                <TableRow key={rowIdx}>
                                    <TableCell>
                                        {row.name ?? ''}
                                        <DeleteIcon onClick={() => handleDelete(row.name)} sx={{ cursor: 'pointer', color: 'red' }} />
                                    </TableCell>
                                    {row.meses.map((status, i) => (
                                        <MesCell key={i} status={status as Status} onClick={() => mesesClick(rowIdx, i)} />
                                    ))}
                                    <TableCell align="center" className="gap-2 flex">
                                        <div className="gap-2 flex">
                                            <Button size="small" variant="contained" onClick={() => marcarProximo(rowIdx, 1)} sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>Pago</Button>
                                            <Button size="small" variant="contained" onClick={() => marcarProximo(rowIdx, 2)} sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}>Devedor</Button>
                                            <Button size="small" variant="contained" onClick={() => marcarProximo(rowIdx, 3)} sx={{ bgcolor: 'gray', '&:hover': { bgcolor: 'darkgray' } }}>Não</Button>
                                            <Button size="small" variant="contained" onClick={() => limparLinha(rowIdx)}>Limpar</Button>
                                        </div>

                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">🟢 {qtdPago} – 🔴 {qtdDevedor}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography fontWeight="bold" color={apto ? 'green' : 'red'}>
                                            {apto ? 'Sim' : 'Não'}
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                <Input
                                    inputRef={inputRef}
                                    placeholder="Adicionar"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleAddMunicipio(inputRef.current?.value || '');
                                            inputRef.current!.value = '';
                                        }
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
