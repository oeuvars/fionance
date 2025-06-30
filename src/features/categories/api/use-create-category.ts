import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>['json'];

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Category created',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to create category',
                type: 'error'
            });
        },
    });

    return mutation;
};
