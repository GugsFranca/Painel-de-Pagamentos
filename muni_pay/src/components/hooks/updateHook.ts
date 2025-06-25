import { useState } from 'react';

export default function useUpdateMunicipios() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const url = process.env.NEXT_PUBLIC_API_URL;

    const updateData = async (dataToUpdate: TableData[]) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

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

            setSuccess(true);
            const result = await response.json();
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            console.error('Error updating data:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        update: updateData,
        loading,
        error,
        success,
    };
}
