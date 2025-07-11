import useUpdateMunicipios from "./hooks/updateHook";

export const usePainelFunctions = (
    setMunicipios: React.Dispatch<React.SetStateAction<TableData[]>>,
    tableName: string
) => {
    const { update } = useUpdateMunicipios();

    const initializeValores = (row: RowData): number[] => {
        if (row.valores && row.valores.length === 12) {
            return [...row.valores];
        }
        return Array(12).fill(0);
    };

    const marcarProximo = (rowIdx: number, novoStatus: Status) => {
        setMunicipios(prev => {
            if (!prev) return prev;

            const newMunicipios = prev.map((tbl) => {
                if (tbl.name !== tableName) return tbl;
                const newData = tbl.data.map((row, ri) => {
                    if (ri !== rowIdx) return row;

                    // Garantir valores inicializados
                    const valores = initializeValores(row);
                    const meses = [...row.meses];

                    // Encontrar o primeiro mês não preenchido (status 0)
                    const firstZero = meses.findIndex(v => v === 0);

                    if (firstZero >= 0) {
                        meses[firstZero] = novoStatus;

                        // Inicializar valor se for dívida
                        if (novoStatus === 2 || novoStatus === 4) {
                            valores[firstZero] = valores[firstZero] || 0;
                        }
                    }

                    return { ...row, meses, valores };
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

                    // Resetar meses e valores
                    const meses = Array(12).fill(0) as Status[];
                    const valores = Array(12).fill(0);

                    return { ...row, meses, valores };
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

    const mesesClick = (rowIdx: number, mesIdx: number, openModal?: (rowIdx: number, mesIdx: number) => void) => {
        setMunicipios(prev => {
            if (!prev) return prev;

            const newMunicipios = prev.map((tbl) => {
                if (tbl.name !== tableName) return tbl;

                const newData = tbl.data.map((row, ri) => {
                    if (ri !== rowIdx) return row;

                    // Clonar meses e valores
                    const meses = [...row.meses] as Status[];
                    const valores = [...(row.valores || Array(12).fill(0))];

                    // Verificar se é um status que requer modal
                    const currentStatus = meses[mesIdx];

                    if (currentStatus === 2 || currentStatus === 4) {
                        // Abre o modal em vez de alterar o status
                        if (openModal) {
                            openModal(rowIdx, mesIdx);
                            return row;

                        }
                    }
                    const nextStatus = [1, 0, 2];
                    const idx = nextStatus.indexOf(currentStatus as number);
                    const newStatus = nextStatus[(idx + 1) % nextStatus.length] as Status;

                    meses[mesIdx] = newStatus;

                    // Inicializar valor se for dívida
                    if (newStatus === 2 || newStatus === 4) {
                        valores[mesIdx] = valores[mesIdx] || 0;
                    } else {
                        // Resetar valor se não for dívida
                        valores[mesIdx] = 0;
                    }

                    return { ...row, meses, valores };
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

    const handleAddMunicipio = (name: string) => {
        if (!name.trim()) return;

        setMunicipios(prev => {
            return prev.map(table => {
                if (table.name === tableName) {
                    const newData = [...table.data];
                    newData.push({
                        name,
                        meses: Array(12).fill(0) as Status[],
                        valores: Array(12).fill(0) // Garantir inicialização
                    });
                    return { ...table, data: newData };
                }
                return table;
            });
        });
    };

    return {
        marcarProximo,
        limparLinha,
        mesesClick,
        handleAddMunicipio
    };
};