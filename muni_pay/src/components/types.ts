interface RowData {
    name: string;
    meses: Status[];
}
type Status = 0 | 1 | 2 | 3;

interface TableData {
    id: number;
    name: string;
    data: RowData[];
}

interface Summary {
    name: string;
    marqueYes: number;
    marqueNo: number;
    rateioYes: number;
    rateioNo: number;
    mesesMF: Status[];
    mesesRateio: Status[];
}
