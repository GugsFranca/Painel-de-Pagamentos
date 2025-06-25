import { useState, useEffect } from 'react';


const fillMeses = (meses: Status[]): Status[] => {
    const normalized = [...meses];
    if (normalized.length < 12) {
        normalized.push(...Array(12 - normalized.length).fill(0));
    }
    return normalized.slice(0, 12);
};

export default function useFetchMunicipios(endpoint: string) {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/charts/${endpoint}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const chartData: TableData = await response.json();
            chartData.data = chartData.data.map(row => ({
                ...row,
                meses: fillMeses(row.meses)
            }));
            setData([chartData]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return {
        municipios: data,
        loading,
        error,
        refetch: fetchData,
        setMunicipios: setData
    };
}
