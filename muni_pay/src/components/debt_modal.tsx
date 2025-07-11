import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    InputAdornment
} from '@mui/material';

interface DebtModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (value: number) => void;
    municipio: string;
    mes: string;
    tipo: 'parcial' | 'devedor';
    currentValue?: number;
    onMarkPaid?: () => void;
}

export default function DebtModal({
    open,
    onClose,
    onSave,
    municipio,
    mes,
    tipo,
    currentValue = 0,
    onMarkPaid
}: DebtModalProps) {
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Formata o número para exibição (com separador decimal padrão brasileiro)
    const formatNumberForDisplay = (num: number): string => {
        return num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Atualiza o valor quando o modal é aberto
    useEffect(() => {
        if (open) {
            setValue(formatNumberForDisplay(currentValue));
            setError('');
        }
    }, [open, currentValue]);

    const handleSave = () => {
        // Formata o valor para o formato numérico
        const cleanValue = value
            .replace(/\./g, '') // Remove pontos de milhar
            .replace(',', '.');  // Substitui vírgula decimal por ponto

        const numericValue = parseFloat(cleanValue);

        if (isNaN(numericValue)) {
            setError('Valor inválido');
            return;
        }

        if (numericValue < 0) {
            setError('O valor não pode ser negativo');
            return;
        }

        onSave(numericValue);
        onClose();
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        // Permite apenas números, vírgulas e pontos
        const sanitizedValue = inputValue
            .replace(/[^0-9,.]/g, '')
            .replace(/(\..*)\./g, '$1'); // Permite apenas um ponto

        // Formatação automática de milhares
        const parts = sanitizedValue.split(',');
        let integerPart = parts[0].replace(/\./g, '');

        // Adiciona separadores de milhar
        if (integerPart.length > 3) {
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Mantém a parte decimal se existir
        const formattedValue = parts.length > 1
            ? `${integerPart},${parts[1].substring(0, 2)}`
            : integerPart;

        setValue(formattedValue);
        setError('');
    };

    const getTitleColor = () => {
        return tipo === 'parcial' ? '#f57c00' : '#d32f2f';
    };

    const getButtonColor = () => {
        return tipo === 'parcial' ? 'warning' : 'error';
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle
                sx={{
                    backgroundColor: getTitleColor(),
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h6" component="div">
                    Registrar Dívida - {tipo === 'parcial' ? 'Pagamento Parcial' : 'Devedor'}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Município:</strong> {municipio}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>Mês:</strong> {mes}
                    </Typography>
                </Box>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Valor da Dívida"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={value}
                    onChange={handleValueChange}
                    error={!!error}
                    helperText={error || 'Digite o valor em reais (ex: 1.500,00)'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                R$
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                <Box
                    sx={{
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        border: `2px solid ${getTitleColor()}`
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {tipo === 'parcial'
                            ? 'Este valor representa a diferença entre o valor total devido e o valor já pago.'
                            : 'Este valor representa o total da dívida em aberto para este mês.'
                        }
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={() => {
                        if (onMarkPaid) {
                            onMarkPaid();
                        }
                        handleClose();
                    }}
                    variant="contained"
                    color="success"
                >
                    Dívida Paga
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color={getButtonColor()}
                    disabled={!value || !!error}
                >
                    Salvar Dívida
                </Button>
            </DialogActions>
        </Dialog>
    );
}