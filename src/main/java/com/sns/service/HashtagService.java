package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.post.PostDto.PostResponse;
import com.sns.entity.Hashtag;
import com.sns.repository.HashtagRepository;
import com.sns.repository.PostHashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagRepository hashtagRepository;
    private final PostHashtagRepository postHashtagRepository;
    private final PostService postService;

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByHashtag(String tag) {
        Hashtag hashtag = hashtagRepository.findByTag(tag.toLowerCase())
                .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "해시태그를 찾을 수 없습니다."));
        return postHashtagRepository.findAllByHashtag(hashtag)
                .stream()
                .map(postHashtag -> postService.getPost(postHashtag.getPost().getId()))
                .collect(Collectors.toList());
    }
}

