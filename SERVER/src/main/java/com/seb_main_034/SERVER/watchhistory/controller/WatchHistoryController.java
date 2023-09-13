package com.seb_main_034.SERVER.watchhistory.controller;

import com.seb_main_034.SERVER.watchhistory.dto.WatchHistoryDTO;
import com.seb_main_034.SERVER.watchhistory.service.WatchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watch-history")
public class WatchHistoryController {
    @Autowired
    private WatchHistoryService watchHistoryService;

    @PostMapping
    public void saveWatchHistory(@RequestBody WatchHistoryDTO watchHistoryDTO) {
        watchHistoryService.saveWatchHistory(watchHistoryDTO);
    }
}
