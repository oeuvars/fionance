import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { showToast } from '@/helpers/showToasts';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async json => {
            const response = await client.api.accounts[":id"]["$delete"]({ param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast('Account deleted', true);
            queryClient.invalidateQueries({ queryKey: ['account', { id }] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            showToast('Failed to delete account', false);
        },
    });

    return mutation;
};
