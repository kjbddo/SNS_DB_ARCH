package com.sns.repository;

import com.sns.entity.SavedCollection;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedCollectionRepository extends JpaRepository<SavedCollection, Long> {
    List<SavedCollection> findAllByUser(User user);
}


