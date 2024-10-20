import React, { useState } from 'react';

const SocialsSidebar = ({ tabData }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className='flex h-full'>
      <div className='w-[200px] p-2'>
        {tabData.map(({ label, icon }, idx) => {
          return (
            <div
              key={label}
              className={`py-2 my-1 mx-2 p-2 rounded cursor-pointer flex gap-3 items-center ${
                activeTab === idx ? 'bg-primary' : 'hover:bg-info'
              } `}
              onClick={() => setActiveTab(idx)}
            >
              <div className='w-7'>
                <img
                  className='w-full overflow-visible h-full rounded-xl'
                  src={icon}
                  alt='logo'
                />
              </div>
              <div className='font-semibold'>{label}</div>
            </div>
          );
        })}
      </div>
      <div className='divider divider-horizontal'></div>
      <div className='flex-1 p-3'>{tabData[activeTab].content}</div>
    </div>
  );
};

export default SocialsSidebar;
