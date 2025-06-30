import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>['json'];

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.categories[":id"]["$patch"]({ json, param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Category updated',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['category', { id }] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            // TODO: Invalidate summary
        },
        onError: () => {
            showToast({
                message: 'Failed to edit category',
                type: 'error'
            });
        },
    });

    return mutation;
};
