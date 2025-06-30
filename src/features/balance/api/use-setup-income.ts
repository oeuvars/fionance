import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.balance.setup.$post>;
type RequestType = InferRequestType<typeof client.api.balance.setup.$post>['json'];

export const useSetupIncome = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.balance.setup.$post({ json });
            return response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Monthly income setup successfully',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['balance'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to setup income',
                type: 'error'
            });
        },
    });

    return mutation;
};