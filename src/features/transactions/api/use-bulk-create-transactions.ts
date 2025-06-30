import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Transactions created',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to create transactions',
                type: 'error'
            });
        },
    });

    return mutation;
};
