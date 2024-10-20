import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  FACEBOOK_POSTS,
  INSTAGRAM_POSTS,
  TWITTER_TWEETS,
} from '../graphql/queries';

import SocialsSidebar from '../components/SocialsSidebar';
import PostBySocial from '../components/layout/PostBySocial';

function Dashboard() {
  return (
    <div className='flex flex-col px-24 h-full'>
      <NavLink className='!hidden' to='/twitter-callback'></NavLink>
      <NavLink className='!hidden' to='/instagram-callback'></NavLink>
      <NavLink className='!hidden' to='/facebook-callback'></NavLink>
      <div className='container mx-auto mt-10 flex flex-col gap-10 h-full'>
        <div className='h-full flex flex-col'>
          {/* Page header */}
          <div className='sm:flex sm:justify-between sm:items-center mb-8'>
            {/* Left: Title */}
            <div className='mb-4 sm:mb-0'>
              <h1 className='text-2xl md:text-3xl font-bold'>Dashboard</h1>
              <p className='mt-2'>View Recent and Upcoming Posts</p>
            </div>
            {/* Right: Actions */}
            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
              {/* Add board button */}
              <NavLink
                className='p-2 lg:px-4 rounded transition flex items-center gap-3'
                to='/new-post'
              >
                <button className='btn btn-accent btn-sm'>
                  New Post
                  <AiOutlinePlus />
                </button>
              </NavLink>
            </div>
          </div>

          <div className='divider -mb-2'></div>
          <div className='flex-1'>
            <SocialsSidebar
              tabData={[
                {
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
                  label: 'Twitter',
                  content: (
                    <div className='flex gap-5 items-start flex-wrap'>
                      <PostBySocial social='twitter' query={TWITTER_TWEETS} />
                    </div>
                  ),
                },
                {
                  icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/300px-Facebook_f_logo_%282021%29.svg.png',
                  label: 'Facebook',
                  content: (
                    <div className='flex gap-5 items-start flex-wrap'>
                      <PostBySocial social='fb' query={FACEBOOK_POSTS} />
                    </div>
                  ),
                },
                {
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/300px-Instagram_logo_2022.svg.png',
                  label: 'Instagram',
                  content: (
                    <div className='flex gap-5 items-start flex-wrap'>
                      <PostBySocial
                        social='instagram'
                        query={INSTAGRAM_POSTS}
                      />
                    </div>
                  ),
                },
                {
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png',
                  label: 'Pinterest',
                  content: (
                    <div className='flex gap-5 items-start flex-wrap'>
                      <PostBySocial
                        social='pinterest'
                        query={INSTAGRAM_POSTS}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* <div className="grid grid-cols-12 gap-6"> */}
          {/* <div className="mt-10 grid grid-cols-12 gap-6">
              <Summary title="Created Posts" amount={10} />
              <Summary title="Scheduled Posts" amount={20} />
            </div> */}
          {/* <h1 className="text-3xl font-medium">Scheduled Posts</h1>
            <div className="flex overflow-x-auto hide-scroll space-x-8 py-8">
              {fData?.facebookPosts &&
                fData?.facebookPosts
                  .filter((post) => post.scheduled)
                  .map((post) => (
                    <PostCard
                      description={post.message}
                      date={post.updatedAt || post.createdAt}
                      image={post.link || ""}
                    />
                  ))}
              {tData?.twitterPosts &&
                tData?.twitterPosts
                  .filter((post) => post.scheduled)
                  .map((post) => (
                    <PostCard
                      description={post.message}
                      date={post.updatedAt || post.createdAt}
                      image={post.media || ""}
                      twitter
                    />
                  ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-medium">Past posts</h1>
            <div className="flex overflow-x-auto hide-scroll space-x-8 py-8">
              {fData?.facebookPosts &&
                fData?.facebookPosts
                  .filter((post) => !post.scheduled)
                  .map((post) => (
                    <PostCard
                      description={post.message}
                      date={post.updatedAt || post.createdAt}
                      image={post.link || ""}
                      facebook
                    />
                  ))}
              {tData?.twitterTweets &&
                tData?.twitterTweets
                  .filter((post) => !post.scheduled)
                  .map((post) => {
                    console.log(post);
                    return (
                      <PostCard
                        key={post.id}
                        description={post.message}
                        date={
                          post.updatedAt
                            ? post.updatedAt.split(" ")[0]
                            : post.createdAt.split(" ")[0]
                        }
                        image={post.media || ""}
                        twitter
                      />
                    );
                  })}
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
