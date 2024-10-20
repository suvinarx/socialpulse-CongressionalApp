package us.congressionalappchallenge.socialpulse.service.service;

import com.twitter.clientlib.model.TweetCreateResponse;
import com.twitter.clientlib.model.TweetCreateResponseData;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import us.congressionalappchallenge.socialpulse.service.graphql.types.*;
import us.congressionalappchallenge.socialpulse.service.helper.FacebookHelper;
import us.congressionalappchallenge.socialpulse.service.helper.InstagramHelper;
import us.congressionalappchallenge.socialpulse.service.helper.TwitterHelper;
import us.congressionalappchallenge.socialpulse.service.job.JobService;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.*;
import us.congressionalappchallenge.socialpulse.service.persistence.facade.AccountFacade;
import us.congressionalappchallenge.socialpulse.service.persistence.facade.PostFacade;
import us.congressionalappchallenge.socialpulse.service.util.DateUtil;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class PostService {
  private final FacebookHelper facebookHelper;
  private final InstagramHelper instagramHelper;
  private final TwitterHelper twitterHelper;
  private final AccountFacade accountFacade;
  private final PostFacade postFacade;
  private final JobService jobService;

  public FacebookPostEntity createFacebookPost(CreateFacebookPostInput input) {
    BusinessEntity business = accountFacade.findBusinessById(UUID.fromString(input.getBusinessId()));
    FacebookAccountEntity facebookAccount = accountFacade.findFacebookAccount(
        UUID.fromString(input.getFacebookAccountId()), business.getId());
    Optional<String> linkOpt = Optional.ofNullable(input.getLink());
    Optional<String> tagsOpt = Optional.ofNullable(input.getTags());
    Optional<String> placeOpt = Optional.ofNullable(input.getPlace());
    Optional<String> scheduledPublishTimeOpt = Optional.ofNullable(input.getScheduledPublishTime());
    String postId = facebookHelper.sendFacebookPost(
        input.getMessage(),
        linkOpt,
        tagsOpt,
        placeOpt,
        scheduledPublishTimeOpt,
        facebookAccount);
    log.info("facebook created post id: " + postId);
    if (scheduledPublishTimeOpt.isPresent()) {
      return postFacade.saveFacebookPost(
          business,
          facebookAccount,
          input.getMessage(),
          linkOpt,
          tagsOpt,
          placeOpt,
          DateUtil.convert(scheduledPublishTimeOpt.get()));
    } else {
      return postFacade.saveFacebookPost(
          business, facebookAccount, input.getMessage(), linkOpt, tagsOpt, placeOpt, postId);
    }
  }

  public InstagramPostEntity createInstagramPost(CreateInstagramPostInput input) {
    BusinessEntity business = accountFacade.findBusinessById(UUID.fromString(input.getBusinessId()));
    InstagramAccountEntity instagramAccount = accountFacade.findInstagramAccount(
        UUID.fromString(input.getInstagramAccountId()), business.getId());
    Optional<String> scheduledPublishTimeOpt = Optional.ofNullable(input.getScheduledPublishTime());
    Optional<String> imageUrlOpt = Optional.ofNullable(input.getImageUrl());
    if (scheduledPublishTimeOpt.isPresent()) {
      InstagramPostEntity postEntity = postFacade.saveInstagramPost(
          business,
          instagramAccount,
          input.getCaption(),
          imageUrlOpt,
          DateUtil.convert(scheduledPublishTimeOpt.get()));
      jobService.scheduleInstagramPostJob(instagramAccount, postEntity);
      return postEntity;
    } else {
      String instagramId = instagramHelper.sendInstagramPost(input.getCaption(), imageUrlOpt, instagramAccount);
      return postFacade.saveInstagramPost(
          business, instagramAccount, input.getCaption(), imageUrlOpt, instagramId);
    }
  }

  public TwitterTweetEntity createTwitterTweet(CreateTwitterTweetInput input) {
    BusinessEntity business = accountFacade.findBusinessById(UUID.fromString(input.getBusinessId()));
    TwitterAccountEntity twitterAccount = accountFacade.findTwitterAccount(
        UUID.fromString(input.getTwitterAccountId()), business.getId());
    Optional<String> scheduledPublishTimeOpt = Optional.ofNullable(input.getScheduledPublishTime());
    Optional<String> imageUrlOpt = Optional.ofNullable(input.getImageUrl());
    if (scheduledPublishTimeOpt.isPresent()) {
      TwitterTweetEntity postEntity = postFacade.saveTwitterTweet(
          business,
          twitterAccount,
          input.getMessage(),
          imageUrlOpt,
          DateUtil.convert(scheduledPublishTimeOpt.get()));
      String jobId = jobService.scheduleTwitterTweetJob(twitterAccount, postEntity);
      postEntity.setJobId(jobId);
      postFacade.getTwitterTweetRepository().save(postEntity);
      return postEntity;
    } else {
      TweetCreateResponseData twitterRes = twitterHelper.sendTwitterTweet(input.getMessage(), imageUrlOpt,
          twitterAccount);
      return postFacade.saveTwitterTweet(
          business, twitterAccount, input.getMessage(), imageUrlOpt, twitterRes.getId());
    }
  }

  public List<FacebookPostEntity> getFacebookPosts(QueryFilter queryFilter) {
    return postFacade
        .getFacebookPostRepository()
        .findAllByBusinessId(
            UUID.fromString(queryFilter.getBusinessId()));
  }

  public List<InstagramPostEntity> getInstagramPosts(QueryFilter queryFilter) {
    return postFacade
        .getInstagramPostRepository()
        .findAllByBusinessId(
            UUID.fromString(queryFilter.getBusinessId()));
  }

  public List<TwitterTweetEntity> getTwitterTweets(QueryFilter queryFilter) {
    return postFacade
        .getTwitterTweetRepository()
        .findAllByBusinessId(
            UUID.fromString(queryFilter.getBusinessId()));
  }

  public TwitterTweetEntity getTwitterTweetById(String id) {
    return postFacade.getTwitterTweetRepository()
        .findById(UUID.fromString(id))
        .orElseThrow(() -> new RuntimeException("Twitter Tweet not found for ID: " + id));
  }

  public TwitterTweetEntity updateTwitterTweet(UpdateTwitterTweetInput input) {
    TwitterTweetEntity tweet = postFacade.findTwitterTweet(UUID.fromString(input.getId()));

    BusinessEntity business = accountFacade.findBusinessById(UUID.fromString(input.getBusinessId()));
    TwitterAccountEntity twitterAccount = accountFacade.findTwitterAccount(
        UUID.fromString(input.getTwitterAccountId()), business.getId());

    tweet.setMessage(input.getMessage());
    tweet.setImageUrl(input.getImageUrl());

    Optional<String> imageUrlOpt = Optional.ofNullable(input.getImageUrl());

    if (input.getScheduledPublishTime() != null) {
      Date newScheduledTime = DateUtil.convert(input.getScheduledPublishTime());
      Optional<String> scheduledPublishTimeOpt = Optional.ofNullable(input.getScheduledPublishTime());
      tweet.setScheduledPublishTime(DateUtil.convert(scheduledPublishTimeOpt.get()));

      Date now = new Date();

      if (newScheduledTime.before(now)) {

        TweetCreateResponseData twitterRes = twitterHelper.sendTwitterTweet(input.getMessage(), imageUrlOpt,
            twitterAccount);
        tweet.setTweetId(twitterRes.getId());

        if (tweet.getJobId() != null) {
          jobService.unscheduleJob(tweet.getJobId());
          tweet.setScheduled(false);
          tweet.setJobId(null);
        }
      } else if (!newScheduledTime.equals(tweet.getScheduledPublishTime())) {
        String jobId = jobService.rescheduleTwitterTweetJob(twitterAccount, tweet);
        tweet.setJobId(jobId);
      }
    } else if (input.getScheduledPublishTime() == null && tweet.getScheduled()) {
      TweetCreateResponseData twitterRes = twitterHelper.sendTwitterTweet(input.getMessage(), imageUrlOpt,
          twitterAccount);

      tweet.setTweetId(twitterRes.getId());
      tweet.setScheduled(false);
      tweet.setScheduledPublishTime(null);

      jobService.unscheduleJob(tweet.getJobId());
      tweet.setJobId(null);
    }

    return postFacade.getTwitterTweetRepository().save(tweet);
  }
}
