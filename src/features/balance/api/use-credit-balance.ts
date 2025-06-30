import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.balance.credit.$post>;

export const useCreditBalance = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.balance.credit.$post();
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Balance credited successfully',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['balance'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to credit balance',
                type: 'error'
            });
        },
    });

    return mutation;
};