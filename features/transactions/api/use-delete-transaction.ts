import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { showToast } from '@/helpers/showToasts';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async json => {
            const response = await client.api.transactions[":id"]["$delete"]({ param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast('Transaction deleted', true);
            queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Invalidate summary
        },
        onError: () => {
            showToast('Failed to delete transaction', false);
        },
    });

    return mutation;
};
