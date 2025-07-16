import { TableCell, Tooltip } from "@mui/material";

interface MesCellProps {
    status: Status;
    valor?: number;
    onClick: () => void;
}

export function MesCell({ status, valor, onClick }: MesCellProps) {
    const bg =
        status === 1 ? '#b9f6ca' :    // verde claro
            status === 2 ? '#ff8a80' :    // vermelho claro
                status === 3 ? '#b0bec5' :    // cinza claro
                    status === 4 ? '#fff59d' :    // amarelo claro
                        undefined;

    const getSymbol = () => {
        switch (status) {
            case 1: return '✓';
            case 2: return '✗';
            case 3: return 'N';
            case 4: return '+/-';
            default: return '';
        }
    };

    // Função formatada para exibição brasileira
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <TableCell sx={{
            backgroundColor: bg,
            width: 40,
            height: 40,
            textAlign: 'center',
            padding: 0,
            position: 'relative'
        }}>
            <Tooltip
                title={valor !== undefined && valor > 0 ? `R$ ${formatCurrency(valor)}` : ''}
                placement="top"
                arrow
            >
                <button
                    style={{
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={onClick}
                >
                    {getSymbol()}
                    {(status === 2 || status === 4) && valor !== undefined && valor > 0 && (
                        <span style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            color: status === 2 ? 'white' : 'black'
                        }}>
                            {formatCurrency(valor)}
                        </span>
                    )}
                </button>
            </Tooltip>
        </TableCell>
    );
}