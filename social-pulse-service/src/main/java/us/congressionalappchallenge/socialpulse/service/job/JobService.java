package us.congressionalappchallenge.socialpulse.service.job;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Service;
import us.congressionalappchallenge.socialpulse.service.graphql.types.CreateInstagramPostInput;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.InstagramAccountEntity;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.InstagramPostEntity;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.TwitterAccountEntity;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.TwitterTweetEntity;
import us.congressionalappchallenge.socialpulse.service.util.DateUtil;

import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class JobService {
  private final SchedulerFactoryBean schedulerFactory;

  public void scheduleInstagramPostJob(InstagramAccountEntity instagramAccount, InstagramPostEntity instagramPost) {
    try {
      JobDataMap dataMap = new JobDataMap();
      dataMap.put("business-id", instagramAccount.getBusiness().getId());
      dataMap.put("instagram-account-id", instagramAccount.getId());
      dataMap.put("instagram-post-id", instagramPost.getId());
      JobDetail jobDetail = buildJobDetail(dataMap, InstagramPostJob.class);
      Trigger trigger = buildTrigger(jobDetail, instagramPost.getScheduledPublishTime());
      Date scheduledDate = schedulerFactory.getScheduler().scheduleJob(jobDetail, trigger);
      log.info("Instagram post with business ID {} scheduled {}", instagramAccount.getBusiness().getId(),
          scheduledDate);
    } catch (SchedulerException e) {
      throw new RuntimeException("Job scheduler error: " + e);
    }
  }

  public String scheduleTwitterTweetJob(TwitterAccountEntity twitterAccount, TwitterTweetEntity twitterTweet) {
    try {
      JobDataMap dataMap = new JobDataMap();
      dataMap.put("business-id", twitterAccount.getBusiness().getId());
      dataMap.put("twitter-account-id", twitterAccount.getId());
      dataMap.put("twitter-tweet-id", twitterTweet.getId());
      JobDetail jobDetail = buildJobDetail(dataMap, TwitterTweetJob.class);
      Trigger trigger = buildTrigger(jobDetail, twitterTweet.getScheduledPublishTime());
      Date scheduledDate = schedulerFactory.getScheduler().scheduleJob(jobDetail, trigger);
      log.info("Twitter tweet with business ID {} scheduled {}", twitterAccount.getBusiness().getId(), scheduledDate);

      return jobDetail.getKey().getName();
    } catch (SchedulerException e) {
      throw new RuntimeException("Job scheduler error: " + e);
    }
  }

  private JobDetail buildJobDetail(JobDataMap dataMap, Class<? extends Job> clazz) {
    return JobBuilder.newJob(clazz)
        // .withIdentity("job")
        .setJobData(dataMap).build();
  }

  private Trigger buildTrigger(JobDetail jobDetail, Date startAt) {
    return TriggerBuilder.newTrigger()
        // .withIdentity("trigger")
        .forJob(jobDetail)
        .startAt(startAt)
        .build();
  }

  public String rescheduleTwitterTweetJob(TwitterAccountEntity twitterAccount, TwitterTweetEntity twitterTweet) {

    if (twitterTweet.getJobId() != null) {
      unscheduleJob(twitterTweet.getJobId());
    }

    return scheduleTwitterTweetJob(twitterAccount, twitterTweet);

  }

  public void unscheduleJob(String jobId) {
    try {
      Scheduler scheduler = schedulerFactory.getScheduler();
      JobKey jobKey = new JobKey(jobId);
      if (scheduler.checkExists(jobKey)) {
        scheduler.deleteJob(jobKey);
      }
    } catch (SchedulerException e) {
      throw new RuntimeException("Job unschedule error: " + e);
    }
  }
}
