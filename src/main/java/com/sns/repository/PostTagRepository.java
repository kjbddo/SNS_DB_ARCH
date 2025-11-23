package com.sns.repository;

import com.sns.entity.Post;
import com.sns.entity.PostTag;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    List<PostTag> findAllByPost(Post post);
    List<PostTag> findAllByTaggedUser(User taggedUser);
    void deleteAllByPost(Post post);
}


