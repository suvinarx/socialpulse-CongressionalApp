import React from 'react';
import { useNavigate } from 'react-router-dom';

function IntegrationAppCard(props) {
  const { name, desc, image, connected, onClick } = props;

  function handleClick() {
    onClick().then((res) => {
      console.log(res.data.twitterAuthUrl?.verifier != null);
      if (res.data.twitterAuthUrl?.verifier != null) {
        localStorage.setItem(
          'twitter_code_verifier',
          res.data.twitterAuthUrl.verifier
        );
      }
      window.open(res.data[Object.keys(res.data)[0]].url, '_self');
    });
  }

  const buttonClassName = connected
    ? 'bg-green-100 hover:bg-green-300 text-green-700 duration-200 rounded-lg px-2 py-1'
    : 'border bg-white hover:bg-gray-100 text-gray-600 duration-200 rounded-lg px-2 py-1';

  return (
    <div className='flex flex-col gap-2 p-4 w-72 shadow-lg rounded-lg bg-base-300'>
      <div className='w-full flex items-center justify-between'>
        <div className='w-14'>
          <img className='w-full h-full' src={image} alt={desc} />
        </div>
        {connected ? (
          <button
            className={
              'btn btn-sm !bg-success !text-gray-200 border-0 btn-outline'
            }
            disabled
          >
            Connected
          </button>
        ) : (
          <button className={'btn btn-sm btn-outline'} onClick={handleClick}>
            Connect
          </button>
        )}
      </div>
      <p>{name}</p>
      <p className='text-gray-500'>{desc}</p>
    </div>
  );
}

export default IntegrationAppCard;
