import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>['json'];

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Transaction created',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to create transaction',
                type: 'error'
            });
        },
    });

    return mutation;
};
