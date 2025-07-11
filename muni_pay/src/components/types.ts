interface RowData {
    name: string;
    valores: number[];
    meses: Status[];
}
type Status = 0 | 1 | 2 | 3 | 4; //0 nada . 1 pago . 2 devedor . 3 não precisa pagar  . 4 pago parcialmente

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
