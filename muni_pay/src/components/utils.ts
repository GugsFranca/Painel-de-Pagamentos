import useUpdateMunicipios from "./hooks/updateHook";


export const usePainelFunctions = (
    setMunicipios: React.Dispatch<React.SetStateAction<TableData[]>>,
    tableName: string
) => {
    const { update } = useUpdateMunicipios();


    const marcarProximo = (rowIdx: number, novoStatus: Status) => {
        setMunicipios(prev => {
            if (!prev) return prev;

            const newMunicipios = prev.map((tbl) => {
                if (tbl.name !== tableName) return tbl;
                const newData = tbl.data.map((row, ri) => {
                    if (ri !== rowIdx) return row;
                    const meses = [...row.meses];
                    const firstZero = meses.findIndex(v => v === 0);
                    if (firstZero >= 0) meses[firstZero] = novoStatus;
                    return { ...row, meses };
                });
                return { ...tbl, data: newData };
            });

            // Encontra a tabela atualizada para enviar ao backend
            const updatedTable = newMunicipios.find(tbl => tbl.name === tableName);
            if (updatedTable) {
                update([updatedTable]).catch(console.error);
            }

            return newMunicipios;
        });
    };

    const limparLinha = (rowIdx: number) => {
        setMunicipios(prev => {
            if (!prev) return prev;

            const newMunicipios = prev.map((tbl) => {
                if (tbl.name !== tableName) return tbl;
                const newData = tbl.data.map((row, ri) => {
                    if (ri !== rowIdx) return row;
                    const meses = Array(12).fill(0) as Status[];
                    return { ...row, meses };
                });
                return { ...tbl, data: newData };
            });

            const updatedTable = newMunicipios.find(tbl => tbl.name === tableName);
            if (updatedTable) {
                update([updatedTable]).catch(console.error);
            }

            return newMunicipios;
        });
    };

    const mesesClick = (rowIdx: number, mesIdx: number) => {
        setMunicipios(prev => {
            if (!prev) return prev;
            const newMunicipios = prev.map((tbl) => {
                if (tbl.name !== tableName) return tbl;
                const newData = tbl.data.map((row, ri) => {
                    if (ri !== rowIdx) return row;
                    const meses = [...row.meses] as Status[];


                    const nextStatus = [1, 2, 0];
                    const current = meses[mesIdx];
                    const idx = nextStatus.indexOf(current as number);
                    meses[mesIdx] = nextStatus[(idx + 1) % nextStatus.length] as Status;
                    return { ...row, meses };
                });
                return { ...tbl, data: newData };
            });

            const updatedTable = newMunicipios.find(tbl => tbl.name === tableName);
            if (updatedTable) {
                update([updatedTable]).catch(console.error);
            }

            return newMunicipios;
        });
    };

    const handleAddMunicipio = (name: string, refetch?: () => void) => {
        if (!name.trim()) return;

        setMunicipios(prev => {
            if (!prev) return prev;

            const newMunicipios = prev.map(tbl => {
                if (tbl.name !== tableName) return tbl;
                const fillMeses = (): Status[] => Array(12).fill(0) as Status[];
                const novaLinha = { name, meses: fillMeses() };
                const newData = [...tbl.data, novaLinha];
                return { ...tbl, data: newData };
            });

            const updatedTable = newMunicipios.find(tbl => tbl.name === tableName);
            if (updatedTable) {
                update([updatedTable])
                    .then(() => refetch?.())
                    .catch(console.error);
            }
            refetch?.();
            return newMunicipios;
        });
    };

    return {
        marcarProximo,
        limparLinha,
        mesesClick,
        handleAddMunicipio
    };
};
