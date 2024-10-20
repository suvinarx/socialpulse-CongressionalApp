import { useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Emoji from '../components/new-post/Emoji';
import Hashtag from '../components/new-post/Hashtag';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import {
  CREATE_FACEBOOK_POST,
  CREATE_INSTAGRAM_POST,
  CREATE_TWITTER_POST,
  UPDATE_TWITTER_TWEET,
} from '../graphql/mutations';
import {
  FACEBOOK_ACCOUNTS,
  GET_TWITTER_TWEET_BY_ID,
  INSTAGRAM_ACCOUNTS,
  TWITTER_ACCOUNTS,
} from '../graphql/queries';
import { FormControlLabel } from '@mui/material';
import {
  AiFillCloseCircle,
  AiOutlineClose,
  AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { NavLink } from 'react-router-dom';

function NewPost() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [radio, setRadio] = useState('now');
  const currDate = new Date();
  const currHour = currDate.getHours();
  const [time, setTime] = useState(
    `${currHour > 12 ? currHour % 12 : currHour === 0 ? 12 : currHour
    }:${currDate.getMinutes()}`
  );
  const [meridiem, setMeridiem] = useState(currHour < 12 ? 'AM' : 'PM');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState([]);
  const [emojis, setEmojis] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [twtCheck, setTwtCheck] = useState(false);
  const [fbCheck, setFbCheck] = useState(false);
  const [igCheck, setIgCheck] = useState(false);
  const [file, setFile] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState({});

  const { business } = useAuth();

  const [getFacebookAccount] = useLazyQuery(FACEBOOK_ACCOUNTS);
  const [getTwitterAccount, { data: twitterAccountData }] = useLazyQuery(TWITTER_ACCOUNTS);
  const [getInstagramAccount] = useLazyQuery(INSTAGRAM_ACCOUNTS);
  const [createFacebookPost] = useMutation(CREATE_FACEBOOK_POST);
  const [createTwitterTweet] = useMutation(CREATE_TWITTER_POST);
  const [createInstagramPost] = useMutation(CREATE_INSTAGRAM_POST);
  const [getTwitterTweetById] = useLazyQuery(GET_TWITTER_TWEET_BY_ID);
  const [updateTweet] = useMutation(UPDATE_TWITTER_TWEET);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getTwitterTweetById({
        variables: { id: id },
      }).then((res) => {
        setTwtCheck(true);
        setCaption(res?.data?.twitterTweetById?.message ?? '');
        setRadio('schedule');
        const scheduleDate = new Date(res?.data?.twitterTweetById?.scheduledPublishTime + ' UTC');
        const month = scheduleDate.getMonth() + 1;
        const dt =
          scheduleDate.getFullYear() +
          '-' +
          (month < 10 ? '0' + month : month) +
          '-' +
          scheduleDate.getDate();
        setDate(dt);
        const scheduleTime = scheduleDate.toLocaleString().split(', ')[1];
        let t = parseInt(scheduleTime.split(':')[0]);
        setMeridiem(t < 12 ? 'AM' : 'PM');
        const min = scheduleTime.split(':')[1];
        t = t > 12 ? t : t;
        setTime(`${t < 10 ? '0' + t : t}:${min}`);
      });
    }
  }, [id]);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const getPostPreview = () => {
    return `${caption}\n${emojis}\n${tags.map((tag) => `#${tag}`).join(' ')}`;
  };

  const handlePostTwitter = () => {
    const twitterAccountId = twitterAccountData?.twitterAccounts?.[0]?.id;
    const twitterUserId = twitterAccountData?.twitterAccounts?.[0]?.twitterId;
    if (twitterAccountId) {
      let scheduledPublishTime = '';
      if (radio === 'schedule') {
        const [year, month, day] = date.split('-');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (meridiem === 'PM' && hours !== 12) {
          hours += 12;
        } else if (meridiem === 'AM' && hours === 12) {
          hours = 0;
        }
        const formattedDate = new Date(year, month - 1, day, hours, minutes);
        scheduledPublishTime = formattedDate?.toISOString();
      }

      const dataToPost = {
        businessId: business?.id,
        twitterAccountId: twitterAccountId,
        message: caption + "\n" + emojis + "\n" + tags.map((tag) => `#${tag}`).join(' '),
        userId: twitterUserId,
        ...(scheduledPublishTime ? { scheduledPublishTime: scheduledPublishTime } : {}),
      };

      if (id) {
        updateTweet({ variables: { updateTwitterTweetInput: { id: id, ...dataToPost } } }).then(() => {
          navigate('/dashboard');
          setLoading(false);
        });
      } else {
        createTwitterTweet({ variables: { CreateTwitterTweetInput: dataToPost } }).then(() => {
          navigate('/dashboard');
          setLoading(false);
        });
      }
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };
  const handleTimeChange = (input) => {
    if (input.length === 2) {
      setTime(input + ':');
    } else {
      setTime(input);
    }
  };
  const handleTags = () => {
    axios
      .post('http://localhost:5002/find-tags', { text: caption })
      .then((data) => {
        setTags(data?.data?.tags);
      });
  };

  const handleEmoji = () => {
    axios
      .post('http://localhost:5002/find-emojis', { text: caption })
      .then((response) => {
        setEmojis(response?.data?.emojis[0]);
      });
  };

  const handleSubmit = () => {
    // Validation logic and platform posting...
    if (twtCheck) handlePostTwitter();
  };

  return (
    <div className='container mx-auto flex flex-col'>
      <div className='mt-10 sm:flex sm:justify-between sm:items-center mb-8'>
        {/* Left: Title */}
        <div className='mb-4 sm:mb-0'>
          <h1 className='text-2xl md:text-3xl font-bold'>New Post</h1>
          <p className='mt-2'>
            Send/Schedule Posts to Facebook, Twitter, and Instagram
          </p>
        </div>
        <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
          {/* Add board button */}

          <NavLink
            className='btn btn-sm btn-error rounded transition flex items-center gap-3'
            to='/dashboard'
          >
            Cancel
            <AiFillCloseCircle />
          </NavLink>
        </div>
      </div>
      <div className='divider -mb-2'></div>
      <div className='grid grid-cols-2 gap-20 mt-5'>
        <div>
          <label className='form-control'>
            <div className='flex items-center justify-between'>
              <p className='font-medium label-text'>Post Caption</p>
              <p className='label-text-alt'>{caption.length} characters</p>
            </div>
            <textarea
              className='w-full mt-2 text-base px-4 py-2 rounded-lg focus:outline-none textarea textarea-bordered'
              type=''
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='My post is about...'
            />
            <small className='text-red-500'>{error?.caption}</small>
          </label>
          <div class='w-full flex flex-col mt-8'>
            <label class='inline-block font-medium mb-2 label-text'>
              Image Upload
            </label>
            <div class='w-full border border-gray-300 rounded-lg'>
              <div class='m-4'>
                <div class='flex w-full'>
                  <div class='w-full flex flex-col h-32 border-4 border-blue-200 border-dashed hover:border-gray-300'>
                    {filePreview ? (
                      <div
                        className='relative flex items-center justify-center'
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <img
                          src={filePreview}
                          alt='Preview'
                          className='rounded-lg object-contain h-28'
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFilePreview(null);
                          }}
                          className='absolute top-2 right-2 rounded-full hover:text-red-600 transition-colors'
                        >
                          <AiOutlineClose size={20} />
                        </button>
                      </div>
                    ) : (
                      <label className='h-full w-full'>
                        <div class='flex flex-col items-center justify-center pt-7'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            class=' w-8 h-8 text-gray-400 group-hover:text-gray-600'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                            />
                          </svg>
                          <p class='pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600'>
                            Attach an image (.png, .jpeg, .jpg, etc.)
                          </p>
                        </div>
                        <input
                          type='file'
                          class='opacity-0'
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-12'>
            <div className='flex items-center gap-3'>
              <label className='font-medium label-text'>Related Emojis</label>
              <button className='btn btn-sm btn-outline' onClick={handleEmoji}>
                Generate
              </button>
            </div>
            <div className='flex gap-8  mt-2 text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'>
              {/* {emojis?.map((emoji) => ( */}
              <button onClick={() => setCaption(`${caption} ${emojis}`)}>
                <div className='text-2xl font-semibold inline-block py-1 px-2 uppercase rounded shadow-lg bg-white hover:bg-gray-100 transition duration-200 last:mr-0 mr-1'>
                  {emojis}
                </div>
              </button>
            </div>
          </div>
          <div className='mt-12'>
            <div className='flex items-center gap-3'>
              <label className='font-medium label-text'>
                Recommended Hashtags
              </label>
              <button className='btn btn-sm btn-outline' onClick={handleTags}>
                Generate
              </button>
            </div>
            <div className='overflow-auto py-4 flex gap-4  mt-2 text-base px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'>
              {tags?.map((tag) => {
                if (tag.length > 3)
                  return (
                    <div
                      onClick={() => {
                        setCaption(`${caption} #${tag}`);
                      }}
                    >
                      <Hashtag text={tag} />
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
        <div className=''>
          <div className=''>
            <label className='font-semibold uppercase mb-1'>Platforms</label>
            <small className='text-red-500 ml-2'>{error?.platform}</small>
            <div className='flex flex-col gap-3 mt-3'>
              <FormControlLabel
                className='font-medium pl-2.5'
                label='Twitter'
                control={
                  <input
                    type='checkbox'
                    checked={twtCheck}
                    onChange={(e) => {
                      setTwtCheck(e.target.checked);
                    }}
                    className='checkbox checkbox-sm mr-3'
                  />
                }
              />
              <FormControlLabel
                className='font-medium pl-2.5'
                label='Facebook'
                control={
                  <input
                    type='checkbox'
                    checked={fbCheck}
                    onChange={(e) => {
                      setFbCheck(e.target.checked);
                    }}
                    className='checkbox checkbox-sm mr-3'
                  />
                }
              />
              <FormControlLabel
                className='font-medium pl-2.5'
                label='Instagram'
                control={
                  <input
                    type='checkbox'
                    checked={igCheck}
                    onChange={(e) => {
                      setIgCheck(e.target.checked);
                    }}
                    className='checkbox checkbox-sm mr-3'
                  />
                }
              />
            </div>
          </div>
          <div className='mt-12 flex items-end justify-between mb-10'>
            <div>
              <label className='font-semibold uppercase mb-1'>
                Post Date & Time
              </label>
              <small className='text-red-500 ml-2 '>{error?.date}</small>
              <div className='flex flex-col mt-4'>
                <div className='flex items-center mb-4'>
                  <input
                    id='now-radio-1'
                    type='radio'
                    value='now'
                    checked={radio === 'now'}
                    onChange={(e) => setRadio(e.target.value)}
                    className='radio radio-primary radio-sm'
                  />
                  <label
                    for='now-radio-1'
                    className='ml-2 font-medium label-text'
                  >
                    Post now
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    id='default-radio-2'
                    type='radio'
                    value='schedule'
                    checked={radio === 'schedule'}
                    onChange={(e) => setRadio(e.target.value)}
                    className=' radio radio-primary radio-sm'
                  />
                  <div className='ml-2 flex gap-3'>
                    <input
                      name='date'
                      id='date'
                      value={date}
                      type='date'
                      onChange={(e) => setDate(e.target.value)}
                      className='input input-bordered input-sm'
                      style={{ outline: '0' }}
                    />
                    {/* TODO: fix up time & date - still in progress */}
                    <div className='flex items-center w-min justify-start rounded-lg'>
                      <input
                        id='time'
                        name='time'
                        type='text'
                        value={time}
                        maxLength={5}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className='input input-bordered w-16 input-sm'
                        pattern='(1[012]|0[1-9]):[0-5][0-9]'
                        title='Please enter in an HH:mm format.'
                        style={{ outline: '0' }}
                      />
                      <select
                        id='zone'
                        value={meridiem}
                        onChange={(e) => setMeridiem(e.target.value)}
                        className='select select-bordered select-sm'
                        style={{ outline: '0' }}
                      >
                        <option defaultValue='PM'>PM</option>
                        <option value='AM'>AM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div>
            <button
              onClick={handleSubmit}
              className='btn btn-neutral btn-info btn-sm transition'
            >
              Submit Post
            </button>
            <button
              onClick={handlePreview}
              className='btn btn-neutral btn-info btn-sm transition'
            >
              Preview Post
            </button> */}
            <div className='flex gap-4 mt-8'>
  <button
    onClick={handleSubmit}
    className='btn btn-neutral btn-info btn-sm transition'
  >
    Submit Post
  </button>
  <button
    onClick={handlePreview}
    className='btn btn-neutral btn-info btn-sm transition'
  >
    Preview Post
  </button>
</div>

<div>
            {showPreview && (

              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white p-5 rounded-lg w-1/3'>
                  <h2 className='text-xl font-bold mb-4 text-gray-800'>Post Preview</h2>
                  <div className='bg-blue-100 p-3 rounded-lg border border-blue-200'>
                    <p className='mb-2 text-black'>
                      <strong></strong> {caption}
                    </p>
                    <p className='mb-2 text-black'>
                      <strong></strong> {emojis}
                    </p>
                    <p className='text-black'>
                      <strong></strong> {tags.map((tag) => `#${tag}`).join(' ')}
                    </p>
                  </div>

                  <button
                    className='btn btn-sm btn-neutral mt-4'
                    onClick={handleClosePreview}
                  >
                    Close
                  </button>
                </div>
              </div>




            )}
          </div>
        </div>
      </div>
    </div>



  );
}

export default NewPost;
