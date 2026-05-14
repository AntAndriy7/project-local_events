package com.local_events.repository;

import com.local_events.entity.FavoriteEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface FavoriteEventRepository extends JpaRepository<FavoriteEvent, Long> {
    List<FavoriteEvent> findAllByUserId(Long userId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    @Transactional
    void deleteByUserIdAndEventId(Long userId, Long eventId);

    @Query("SELECT f.event.id FROM FavoriteEvent f WHERE f.user.id = :userId")
    Set<Long> findAllFavoriteEventIdsByUserId(@Param("userId") Long userId);
}
