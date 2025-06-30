import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Accounts deleted', 
                type: "success"
            });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to delete accounts',
                type: 'error'
            });
        },
    });

    return mutation;
};
