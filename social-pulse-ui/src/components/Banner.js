import React from 'react';
import medias from '../images/medias.svg';
import schedule from '../images/schedule.svg';
import growth from '../images/growth.svg';
import relaxing from '../images/relaxing.svg';
import Carousel from './Carousel';

const Banner = () => {
  const data = [
    {
      img: medias,
      title: 'Unified Social Media Management',
      description:
        'Leveraging Social Pulse to seamlessly manage multiple social media accounts from a single dashboard. Integrate platforms like Twitter, Facebook, and Instagram to create, schedule, and monitor posts across various social networks efficiently.',
    },
    {
      img: schedule,
      title: 'Smart Content Scheduling',
      description:
        "Utilize Social Pulse's scheduling feature to plan and automate social media posts. With its intuitive interface create content, set optimal posting times, and ensure consistent engagement with your audience across different time zones and platforms.",
    },
    {
      img: growth,
      title: 'AI-Powered Social Media Growth',
      description:
        "Experience significant growth in your social media presence by leveraging Social Pulse's AI-driven features. Use intelligent hashtag suggestions, content optimization, and performance analytics to increase reach, engagement, and follower base across multiple social platforms.",
    },
    {
      img: relaxing,
      title: 'Effortless Social Media Management',
      description:
        'Enjoy peace of mind after implementing Social Pulse into your workflow. With automated scheduling, AI-assisted content creation, and comprehensive analytics, use your time to relax and focus on creating quality content and engaging with your audience.',
    },
  ].map((item) => {
    return (
      <div className='flex justify-center h-full'>
        <div className='flex items-center justify-center gap-5 bg-gradient-to-br from-base-300 to-base-200 rounded-xl shadow-md p-3'>
          <img src={item.img} className='w-60' alt={item.title} />
          <div className='w-[450px] flex flex-col justify-evenly items-center gap-5'>
            <h1 className='text-2xl font-bold'>{item.title}</h1>
            <p className='text-center'>{item.description}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className='px-24 py-5'>
      <Carousel slides={data} interval={4000} />
    </div>
  );
};

export default Banner;
