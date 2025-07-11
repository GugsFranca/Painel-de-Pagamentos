'use client'

import React, { useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Input,
} from '@mui/material';
import useFetchMunicipios from './hooks/fetchChartHook';
import useDeleteMunicipios from './hooks/deleteRowHook';
import useUpdateMunicipios from './hooks/updateHook';
import { usePainelFunctions } from './utils';
import { MesCell } from './mesCell';
import DeleteIcon from '@mui/icons-material/Delete';
import DebtModal from './debt_modal';




function verificarStatus(meses: number[]): boolean {
    return !meses.some(status => status === 2 || status === 4);
}

export default function PainelMarqueFacil({ year }: { year: number }) {
    // Hooks incondicionais no topo
    const inputRef = useRef<HTMLInputElement>(null);
    const [modalRow, setModalRow] = useState<number | null>(null);
    const [modalMonth, setModalMonth] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [tipoModal, setTipoModal] = useState<'parcial' | 'devedor'>('devedor');
    const [currentValue, setCurrentValue] = useState<number>(0);

    const tableName = `marqueFacil_${year}`;
    const { update } = useUpdateMunicipios();

    const {
        municipios,
        isLoading,
        error,
        refetch,
        setMunicipios,
    } = useFetchMunicipios(tableName);

    const tabelaId = municipios[0]?.id ?? '';
    const { deleteCell } = useDeleteMunicipios(tabelaId);

    const { marcarProximo, limparLinha, mesesClick, handleAddMunicipio } =
        usePainelFunctions(setMunicipios, tableName);

    // Estados de carregamento e erros
    if (isLoading) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography>Carregando municípios…</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography color="error">Erro ao carregar: {error.message}</Typography>
            </Box>
        );
    }
    if (municipios.length === 0) {
        return (
            <Typography mt={2} textAlign="center">
                Nenhum registro encontrado para <strong>{tableName}</strong>.
            </Typography>
        );
    }

    // Usamos apenas a primeira tabela retornada
    const tabela = municipios[0];
    if (!tabela.data) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography>Nenhum dado disponível para esta tabela.</Typography>
            </Box>
        );
    }
    // Definimos rows como array seguro
    const rows: RowData[] = Array.isArray(tabela.data) ? tabela.data : [];

    // Handlers de modal
    const openModal = (rowIdx: number, mesIdx: number) => {
        const row = rows[rowIdx];
        const status = row.meses[mesIdx];
        if (status === 2 || status === 4) {
            setTipoModal(status === 2 ? 'devedor' : 'parcial');
            setCurrentValue(row.valores?.[mesIdx] ?? 0);
            setModalRow(rowIdx);
            setModalMonth(mesIdx);
            setModalOpen(true);
        }
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalRow(null);
        setModalMonth(null);
    };
    const handleSaveDebt = async (rowIdx: number, monthIdx: number, value: number) => {
        try {
            // Atualização otimista
            setMunicipios(prev =>
                prev.map(tbl => {
                    if (tbl.id !== tabela.id) return tbl;
                    const newData = rows.map((row, idx) =>
                        idx !== rowIdx ? row : { ...row, valores: row.valores?.map((v, i) => i === monthIdx ? value : v) ?? [] }
                    );
                    return { ...tbl, data: newData };
                })
            );
            // Atualiza no backend
            const updatedTable = {
                ...tabela,
                data: rows.map((row, idx) =>
                    idx !== rowIdx ? row : { ...row, valores: row.valores?.map((v, i) => i === monthIdx ? value : v) ?? [] }
                ),
            };
            const response = await update([updatedTable]);
            setMunicipios(prev =>
                prev.map(tbl => (tbl.id === tabela.id ? response[0] : tbl))
            );
        } catch {
            await refetch();
        } finally {
            closeModal();
            refetch();
        }
    };

    const handleDelete = async (name: string) => {
        await deleteCell(name);
        refetch();
    };

    const handleMarkPaid = async () => {
        if (modalRow === null || modalMonth === null) return;
        const updateMeses = (row: RowData, idx: number) =>
            idx !== modalRow
                ? row
                : { ...row, meses: row.meses.map((st, i) => (i === modalMonth ? 1 : st)) };

        setMunicipios(prev =>
            prev.map(tbl =>
                tbl.id !== tabela.id
                    ? tbl
                    : { ...tbl, data: rows.map(updateMeses) }
            )
        );

        try {
            const updatedTable = { ...tabela, data: rows.map(updateMeses) };
            const [resp] = await update([updatedTable]);
            setMunicipios(prev =>
                prev.map(tbl => (tbl.id === tabela.id ? resp : tbl))
            );
        } catch {
            await refetch();
        }
    };

    const calcularTotais = (row: RowData) => {
        const valores = row.valores?.length === 12 ? row.valores : Array(12).fill(0);
        let totalPago = 0;
        let totalDevido = 0;
        row.meses.forEach((st, i) => {
            if (st === 1) totalPago += valores[i] || 0;
            if (st === 2 || st === 4) totalDevido += valores[i] || 0;
        });
        return { totalPago, totalDevido };
    };

    return (
        <Box>
            {/* Modal */}
            {modalOpen && modalRow !== null && modalMonth !== null && (
                <DebtModal
                    open
                    onClose={closeModal}
                    onSave={value => handleSaveDebt(modalRow, modalMonth, value)}
                    municipio={tabela.data[modalRow].name}
                    mes={`${new Date(0, (modalMonth + 11) % 12)
                        .toLocaleString('pt-BR', { month: 'short' })
                        .toUpperCase()}/` +
                        `${new Date(0, modalMonth)
                            .toLocaleString('pt-BR', { month: 'short' })
                            .toUpperCase()}`}
                    tipo={tipoModal}
                    currentValue={currentValue}
                    onMarkPaid={handleMarkPaid}           // nova prop

                />
            )}

            {/* Tabela */}
            {tabela.data.length === 0 ? (
                <Typography mt={2} textAlign="center">
                    Nenhum registro encontrado para <strong>{tableName}</strong>.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', mt: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={17} align="center" sx={{ backgroundColor: '#f5f5f5', fontSize: '0.85rem', py: 1 }}>
                                    <Typography variant="h6" fontSize="1rem">
                                        PAGAMENTO DO CONTRATO DO MARQUE FÁCIL
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>Municípios</TableCell>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <TableCell key={i} align="center" sx={{ fontSize: '0.7rem', py: 0.5 }}>
                                        {`${new Date(0, (i + 11) %
                                            12).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}/` + `${new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}`}
                                    </TableCell>
                                ))}
                                <TableCell align="center" sx={{ fontSize: '0.75rem', py: 0.5 }}>Ações</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.75rem', py: 0.5 }}>Total Devido</TableCell>
                                <TableCell align="center" sx={{ fontSize: '0.75rem', py: 0.5 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabela.data.map((row, idx) => {
                                const { totalDevido } = calcularTotais(row);
                                const qtdPago = row.meses.filter(v => v === 1).length;
                                const qtdDevedor = row.meses.filter(v => v === 2).length;
                                const apto = verificarStatus(row.meses as Status[]);
                                return (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ py: 0.5 }}>
                                            {row.name}
                                            <DeleteIcon onClick={() => handleDelete(row.name)} sx={{ cursor: 'pointer', color: 'red', fontSize: 18, ml: 1 }} />
                                        </TableCell>
                                        {row.meses.map((status, mIdx) => (
                                            <MesCell key={mIdx} status={status} valor={row.valores?.[mIdx]} onClick={() => mesesClick(idx, mIdx, openModal)} />
                                        ))}
                                        <TableCell align="center" className="gap-2 flex">
                                            <Box className="gap-2 flex justify-center">
                                                <Button size="small" variant="contained" onClick={() => marcarProximo(idx, 1)} sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>Pago</Button>
                                                <Button size="small" variant="contained" onClick={() => marcarProximo(idx, 4)} sx={{ bgcolor: '#fcca00', '&:hover': { bgcolor: 'goldenrod' } }}>Parcial</Button>
                                                <Button size="small" variant="contained" onClick={() => marcarProximo(idx, 2)} sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}>Devedor</Button>
                                                <Button size="small" variant="contained" onClick={() => marcarProximo(idx, 3)} sx={{ bgcolor: 'gray', '&:hover': { bgcolor: 'darkgray' } }}>Não</Button>
                                                <Button size="small" variant="contained" onClick={() => limparLinha(idx)}>Limpar</Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2" fontSize="0.80rem" fontWeight="bold" color={totalDevido > 0 ? 'red' : 'text.primary'}>
                                                {totalDevido.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography fontSize="0.80rem" fontWeight="bold" color={apto ? 'green' : 'red'}>
                                                {qtdPago === 0 && qtdDevedor === 0 ? "---" : (apto ? 'Sim' : 'Não')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell colSpan={16}>
                                    <Input inputRef={inputRef} placeholder="Adicionar" onKeyDown={e => { if (e.key === 'Enter') { handleAddMunicipio(inputRef.current?.value || ''); inputRef.current!.value = ''; } }} sx={{ py: 0.5, width: '100%' }} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

