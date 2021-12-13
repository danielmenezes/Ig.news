import { render, screen } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'


jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: 'Post content',
  updatedAt: '10 de abril'
};

describe('Posts page', () => {

  it('renders correctly', () => {

    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()

  })


  it('Post', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockReturnValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)


    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )

  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' },
          ],
          content: [
            { type: 'paragraph', text: 'Post content' },
          ]
        },
        last_publication_date: '04-01-2021'
      })
    } as any)


    getSessionMocked.mockReturnValueOnce({
      activeSubscription: 'fake-active-subscrition'
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)


    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  })

})
