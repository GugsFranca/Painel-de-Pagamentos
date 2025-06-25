import { useState } from 'react';



export default function useDeleteMunicipios(chartId: number) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const url = process.env.NEXT_PUBLIC_API_URL;


    const deleteCell = async (rowName: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/row-data/delete/${rowName}/${chartId}`, {
                method: 'DELETE',
            });

            if (response.status !== 204) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        deleteCell
    };
}
