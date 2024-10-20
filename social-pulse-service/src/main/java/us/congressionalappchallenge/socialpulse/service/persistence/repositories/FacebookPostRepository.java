package us.congressionalappchallenge.socialpulse.service.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.FacebookPostEntity;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.TwitterTweetEntity;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface FacebookPostRepository extends JpaRepository<FacebookPostEntity, UUID> {
  @Query(value = "SELECT * FROM facebook_post WHERE business_id = :businessId", nativeQuery = true)
  List<FacebookPostEntity> findAllByBusinessId(UUID businessId);

  @Query(value = "SELECT * FROM facebook_post WHERE business_id = :businessId AND created_at <= :until AND created_at >= :since", nativeQuery = true)
  List<FacebookPostEntity> findAllByBusinessIdAndSinceAndUntil(UUID businessId, Date since, Date until);
}
