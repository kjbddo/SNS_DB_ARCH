package com.sns.repository;

import com.sns.entity.Hashtag;
import com.sns.entity.Post;
import com.sns.entity.PostHashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostHashtagRepository extends JpaRepository<PostHashtag, Long> {
    List<PostHashtag> findAllByPost(Post post);
    List<PostHashtag> findAllByHashtag(Hashtag hashtag);
    void deleteAllByPost(Post post);
}


