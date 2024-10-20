import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useQuery } from '@apollo/client';
import PostCard from '../posts/PostCard';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import dummyData from '../dummy-data.json';

const PostBySocial = ({ social = 'twitter', query }) => {
  const { currentUser, business } = useAuth();

  const { data, loading, error } = useQuery(query, {
    variables: {
      queryFilter: {
        businessId: currentUser.uid,
      },
    },
    fetchPolicy: 'network-only',
  });

  let dataToShow = [];

  switch (social) {
    case 'twitter':
      dataToShow = data?.twitterTweets ?? [];
      break;
    case 'fb':
      dataToShow = dummyData?.facebookPosts ?? data?.facebookPosts ?? [];
      break;
    case 'instagram':
      dataToShow = dummyData?.instagramPosts ?? data?.instagramPosts ?? [];
      break;
    case 'pinterest':
      dataToShow = dummyData?.pinterestPosts ?? data?.pinterestPosts ?? [];
      break;
    default:
      dataToShow = [];
  }

  return error ? (
    <div>Some error occurred</div>
  ) : loading ? (
    <div className='w-full mt-20 flex flex-col items-center justify-center'>
      <h1 className='animate-spin text-blue-600 text-6xl font-poppins font-extrabold text-center'>
        <AiOutlineLoading3Quarters />
      </h1>
    </div>
  ) : dataToShow?.length ? (
    dataToShow?.map((post) => (
      <PostCard
        description={post.message}
        date={
          !post.scheduled
            ? post.updatedAt
              ? post.updatedAt.split(' ')[0]
              : post.createdAt.split(' ')[0]
            : post.scheduledPublishTime?.split(' ')?.[0]
        }
        image={post.media || ''}
        past={!post.scheduled}
        tweetId={social === 'twitter' ? post.tweetId : ''}
        id={post.id}
        scheduled={post.scheduled}
        platformLink={
          social === 'twitter'
            ? `https://x.com/${business?.twitterUserName}/status/${post?.tweetId}`
            : ''
        }
      />
    ))
  ) : (
    <div className='mx-auto pt-10'>No posts yet.</div>
  );
};

export default PostBySocial;
