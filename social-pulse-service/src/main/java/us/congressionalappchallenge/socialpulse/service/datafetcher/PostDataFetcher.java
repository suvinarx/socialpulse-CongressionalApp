package us.congressionalappchallenge.socialpulse.service.datafetcher;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import us.congressionalappchallenge.socialpulse.service.graphql.types.*;
import us.congressionalappchallenge.socialpulse.service.persistence.entities.TwitterTweetEntity;
import us.congressionalappchallenge.socialpulse.service.service.PostService;

import java.util.List;
import java.util.stream.Collectors;

@DgsComponent
@AllArgsConstructor
@Slf4j
public class PostDataFetcher {
  private final PostService postService;
  private final ModelMapper modelMapper;

  @DgsMutation
  @PreAuthorize("isAuthenticated() and #createFacebookPostInput.getBusinessId() == authentication.principal.getUid()")
  public FacebookPost createFacebookPost(@InputArgument CreateFacebookPostInput createFacebookPostInput) {
    return modelMapper.map(postService.createFacebookPost(createFacebookPostInput), FacebookPost.class);
  }

  @DgsMutation
  @PreAuthorize("isAuthenticated() and #createInstagramPostInput.getBusinessId() == authentication.principal.getUid()")
  public InstagramPost createInstagramPost(@InputArgument CreateInstagramPostInput createInstagramPostInput) {
    return modelMapper.map(postService.createInstagramPost(createInstagramPostInput), InstagramPost.class);
  }

  @DgsMutation
  @PreAuthorize("isAuthenticated() and #createTwitterTweetInput.getBusinessId() == authentication.principal.getUid()")
  public TwitterTweet createTwitterTweet(@InputArgument CreateTwitterTweetInput createTwitterTweetInput) {
    return modelMapper.map(postService.createTwitterTweet(createTwitterTweetInput), TwitterTweet.class);
  }

  @DgsQuery
  @PreAuthorize("isAuthenticated() and #queryFilter.getBusinessId() == authentication.principal.getUid()")
  public List<FacebookPost> facebookPosts(@InputArgument QueryFilter queryFilter) {
    return postService.getFacebookPosts(queryFilter).stream()
            .map(post -> modelMapper.map(post, FacebookPost.class))
            .collect(Collectors.toList());
  }

  @DgsQuery
  @PreAuthorize("isAuthenticated() and #queryFilter.getBusinessId() == authentication.principal.getUid()")
  public List<InstagramPost> instagramPosts(@InputArgument QueryFilter queryFilter) {
    return postService.getInstagramPosts(queryFilter).stream()
            .map(post -> modelMapper.map(post, InstagramPost.class))
            .collect(Collectors.toList());
  }

  @DgsQuery
  @PreAuthorize("isAuthenticated() and #queryFilter.getBusinessId() == authentication.principal.getUid()")
  public List<TwitterTweet> twitterTweets(@InputArgument QueryFilter queryFilter) {
    return postService.getTwitterTweets(queryFilter).stream()
            .map(post -> modelMapper.map(post, TwitterTweet.class))
            .collect(Collectors.toList());
  }

  @DgsQuery
  @PreAuthorize("isAuthenticated()")
  public TwitterTweet twitterTweetById(@InputArgument String id) {
      TwitterTweetEntity tweetEntity = postService.getTwitterTweetById(id);
      return modelMapper.map(tweetEntity, TwitterTweet.class);
  }

  @DgsMutation
  @PreAuthorize("isAuthenticated()")
  public TwitterTweet updateTwitterTweet(@InputArgument UpdateTwitterTweetInput updateTwitterTweetInput) {
      TwitterTweetEntity updatedTweet = postService.updateTwitterTweet(updateTwitterTweetInput);
      return modelMapper.map(updatedTweet, TwitterTweet.class);
  }
}
