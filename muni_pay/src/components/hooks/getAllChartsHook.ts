import { useState, useEffect, useCallback } from 'react';


export default function useFetchAllMunicipios() {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/charts`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const chartData: TableData[] = await response.json();
            console.log(chartData);

            setData(chartData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        tabelas: data,
        loading,
        error,
        refetch: fetchData,
        setMunicipios: setData
    };
}
