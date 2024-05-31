import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { showToast } from '@/helpers/showToasts';

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast('Transactions created', true);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            showToast('Failed to create transactions', false);
        },
    });

    return mutation;
};
