import { ErrorComponent, createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { getPostListItem, postQueryOptions } from '../utils/posts'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { NotFound } from '~/components/NotFound'
import { WithErrorHandler } from '~/components/WithErrorHandler';

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId }, context, cause }) => {
    if (cause !== 'preload' || typeof window !== 'undefined') {
      return;
    }
    const data = await context.queryClient.ensureQueryData(
      postQueryOptions(postId),
    )

    return {
      title: data.title,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: PostErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>
  },
  component: PostComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function PostComponent() {
  const { postId } = Route.useParams()
  const postQuery = typeof window === 'undefined' ? useSuspenseQuery(postQueryOptions(postId)) : useQuery(postQueryOptions(postId));
  const queryClient = useQueryClient();
  const placeholderData = getPostListItem(queryClient, postId);

  const data = postQuery.data || placeholderData;
  if (!data) {
    return (
      <WithErrorHandler
        error={postQuery.error as any}
        errorComponent={Route.options.errorComponent}
        notFoundComponent={Route.options.notFoundComponent}
      >
        <div>Loading...</div>
      </WithErrorHandler>
    )
  }

  return (
    <WithErrorHandler
      error={postQuery.error as any}
      errorComponent={Route.options.errorComponent}
      notFoundComponent={Route.options.notFoundComponent}
    >
      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{data.title}</h4>
        <div className="text-sm">{data.body}</div>
      </div>
    </WithErrorHandler>
  )
}
