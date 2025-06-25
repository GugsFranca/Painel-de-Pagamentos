import { Button, TableCell } from "@mui/material";

export function MesCell({ status, onClick }: { status: Status; onClick: () => void }) {

    const bg =
        status === 1 ? '#a5d6a7' :
            status === 2 ? '#ef9a9a' :
                status === 3 ? '#6c788e' :
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
                {status === 1 ? '✓' : status === 2 ? '✗' : status === 3 ? 'N' : ''}
            </button>
        </TableCell>
    );
}