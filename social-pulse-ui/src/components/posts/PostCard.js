import React from 'react';
import { Link } from 'react-router-dom';

const arrowIcon = (
  <svg
    aria-hidden='true'
    className='ml-2 -mr-1 w-4 h-4'
    fill='currentColor'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
      clipRule='evenodd'
    ></path>
  </svg>
);

function PostCard(props) {
  const { image, date, description, past, id, platformLink } = props;

  return (
    <div className='card bg-base-300 w-96 shadow-xl'>
      {image && (
        <figure>
          <img src={image} alt='Shoes' />
        </figure>
      )}
      <div className='card-body'>
        <p className='card-title'>
          {past ? <p>Published At {date}</p> : <p> Scheduled For {date}</p>}
        </p>
        <p>{description}</p>
        <div className='card-actions justify-end'>
          {past ? (
            <a
              className='btn btn-secondary btn-sm w-[87px]'
              href={platformLink}
              target='_blank'
            >
              <p>View</p>
              {arrowIcon}
            </a>
          ) : (
            <Link
              className='btn btn-primary btn-sm w-[87px]'
              to={`/new-post/${id}`}
            >
              <p>Edit</p>
              {arrowIcon}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
