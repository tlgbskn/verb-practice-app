import { useState, useEffect, useCallback } from 'react';

interface SupabaseResponse<T> {
    data: T | null;
    error: any;
}

type QueryFn<T> = () => Promise<SupabaseResponse<T>>;

export function useSupabaseQuery<T>(queryFn: QueryFn<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await queryFn();

            if (error) {
                throw error;
            }

            setData(data);
        } catch (err: any) {
            console.error('Supabase query error:', err);
            setError(err instanceof Error ? err : new Error(err.message || 'An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
}
