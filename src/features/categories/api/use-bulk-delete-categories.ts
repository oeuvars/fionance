import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Categories deleted',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to delete categories',
                type: 'error'
            });
        },
    });

    return mutation;
};
