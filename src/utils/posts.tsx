import { QueryClient, queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'

export type PostType = {
  id: string
  title: string
  body: string
}

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...')
    return axios
      .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
      .then((r) => r.data.slice(0, 10))
  },
)

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  })

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => {
        console.log('r = ', r);
        return r.data;
      })
      .catch((err) => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const postQueryOptions = (postId: string) =>
  queryOptions({
    retry: 0,
    queryKey: ['post', postId],
    queryFn: () => fetchPost({ data: postId }),
  })

export const getPostListItem = (queryClient: QueryClient, postId: string) => {
  const posts = queryClient.getQueryData<Array<PostType>>(['posts']);
  if (posts && posts.length > 0) {
    return posts.find(post => String(post.id) === postId);
  }
}