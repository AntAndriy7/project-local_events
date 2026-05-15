package com.local_events.repository;

import com.local_events.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.eventsVisitedCount = COALESCE(u.eventsVisitedCount, 0) + 1 WHERE u.id IN :userIds")
    void incrementEventsVisitedCountForUsers(@Param("userIds") List<Long> userIds);

    @Modifying
    @Query("UPDATE User u SET u.eventsCreatedCount = COALESCE(u.eventsCreatedCount, 0) + 1 WHERE u.id = :userId")
    void incrementEventsCreatedCount(@Param("userId") Long userId);
}
