import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>['json'];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.accounts[":id"]["$patch"]({ json, param: {id} });
            return await response.json();
        },
        onSuccess: () => {
            showToast({
                message: 'Account updated',
                type: 'success'
            });
            queryClient.invalidateQueries({ queryKey: ['account', { id }] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            showToast({
                message: 'Failed to edit account',
                type: 'error'
            });
        },
    });

    return mutation;
};
