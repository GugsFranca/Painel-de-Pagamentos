// hooks/updateHook.ts
import { useState } from 'react';

export default function useUpdateMunicipios() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const url = process.env.NEXT_PUBLIC_API_URL;

    const update = async (dataToUpdate: TableData[]) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${url}/charts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Garante que retorna os dados atualizados
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error('Error updating data:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        update,
        loading,
        error,
    };
}