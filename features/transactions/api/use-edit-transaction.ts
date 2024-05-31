import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { showToast } from '@/helpers/showToasts';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>['json'];

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions[":id"]["$patch"]({ json, param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast('Transaction updated', true);
            queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            showToast('Failed to edit transaction', false);
        },
    });

    return mutation;
};
