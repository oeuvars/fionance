import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async json => {
            const response = await client.api.transactions[":id"]["$delete"]({ param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Transaction deleted',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to delete transaction',
                type: 'error'
            });
        },
    });

    return mutation;
};
