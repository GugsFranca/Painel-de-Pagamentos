'use client'
import { useRef } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Typography,
    Box,
    Input
} from '@mui/material';
import { MesCell } from "./mesCell";
import useFetchMunicipios from "./hooks/fetchChartHook";
import { usePainelFunctions } from "./utils";
import useDeleteMunicipios from "./hooks/deleteRowHook";
import DeleteIcon from '@mui/icons-material/Delete';



function verificarStatus(meses: Status[]): boolean {
    const qtdDevedor = meses.filter(v => v === 2).length;
    if (qtdDevedor >= 3) return false;
    return true;
}

export default function PainelRateio({ year }: { year: number }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const tableName = `rateio_${year}`;
    const {
        municipios,
        refetch,
        setMunicipios
    } = useFetchMunicipios(tableName);

    const {
        marcarProximo,
        limparLinha,
        mesesClick,
        handleAddMunicipio
    } = usePainelFunctions(setMunicipios, tableName);

    const tabela = municipios!.find(t => t.name === tableName) || municipios![0];

    const { deleteCell } = useDeleteMunicipios(tabela?.id ?? '');


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
                                <Typography variant="h6"> PAGAMENTO DO CONTRATO DE RATEIO</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ py: 0.5 }}>Municípios</TableCell>
                            {Array.from({ length: 12 }, (_, i) => (
                                <TableCell key={i} align="center">
                                    {new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}
                                </TableCell>
                            ))}
                            <TableCell align="center" sx={{ py: 0.5 }}>Ações</TableCell>
                            <TableCell align="center" sx={{ py: 0.5 }}>Resumo</TableCell>
                            <TableCell align="center" sx={{ py: 0.5 }}>Status</TableCell>
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
                                    <TableCell align="center">
                                        <div className="gap-2 flex justify-center">
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
                            <TableCell colSpan={16}>
                                <Box sx={{ display: 'inline-block', minWidth: 120 }}>
                                    <Input
                                        inputRef={inputRef}
                                        placeholder="Adicionar"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleAddMunicipio(inputRef.current?.value || '');
                                                inputRef.current!.value = '';
                                            }

                                        }}
                                        sx={{ py: 0.5, width: '100%' }}

                                    />
                                </Box>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}