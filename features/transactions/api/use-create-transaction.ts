import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { showToast } from '@/helpers/showToasts';

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>['json'];

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast('Transaction created', true);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            showToast('Failed to create transaction', false);
        },
    });

    return mutation;
};
