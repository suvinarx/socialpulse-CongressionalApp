package us.congressionalappchallenge.socialpulse.service.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.TwitterTweetEntity;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface TwitterTweetRepository extends JpaRepository<TwitterTweetEntity, UUID> {
  @Query(value = "SELECT * FROM twitter_tweet WHERE business_id = :businessId", nativeQuery = true)
  List<TwitterTweetEntity> findAllByBusinessId(UUID businessId);

  @Query(value = "SELECT * FROM twitter_tweet WHERE business_id = :businessId AND created_at <= :until AND created_at >= :since", nativeQuery = true)
  List<TwitterTweetEntity> findAllByBusinessIdAndSinceAndUntil(UUID businessId, Date since, Date until);
}
