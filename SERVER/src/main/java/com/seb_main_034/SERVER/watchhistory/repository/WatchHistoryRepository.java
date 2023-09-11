package com.seb_main_034.SERVER.watchhistory.repository;

import com.seb_main_034.SERVER.watchhistory.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
}
