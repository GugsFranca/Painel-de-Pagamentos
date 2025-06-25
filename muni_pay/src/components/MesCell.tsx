import { TableCell } from "@mui/material";

export function MesCell({ status, onClick }: { status: Status; onClick: () => void }) {

    const bg =
        status === 1 ? '#b9f6ca' :    // verde claro
            status === 2 ? '#ff8a80' :    // vermelho claro
                status === 3 ? '#b0bec5' :    // cinza claro
                    status === 4 ? '#fff59d' :    // amarelo claro
                        undefined;


    return (
        <TableCell sx={{ backgroundColor: bg, width: 40, height: 40, textAlign: 'center' }}>
            <button
                style={{
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                }}
                onClick={onClick}
            >
                {status === 1
                    ? '✓'
                    : status === 2
                        ? '✗'
                        : status === 3
                            ? 'N'
                            : status === 4
                                ? '+/-'
                                : ''}
            </button>
        </TableCell>
    );
}