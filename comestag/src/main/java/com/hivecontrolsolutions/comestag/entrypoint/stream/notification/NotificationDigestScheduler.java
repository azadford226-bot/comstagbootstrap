package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.application.usecase.notification.BuildNotificationDigestUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationDigestScheduler {

    private final BuildNotificationDigestUseCase digestUseCase;

    @Scheduled(cron = "0 0 9 * * *")  // Daily at 9:00 AM UTC
    public void dailyDigest() {
        log.info("Running daily notification digest");
        digestUseCase.execute("daily");
    }

    @Scheduled(cron = "0 0 9 * * MON")  // Weekly on Monday at 9:00 AM UTC
    public void weeklyDigest() {
        log.info("Running weekly notification digest");
        digestUseCase.execute("weekly");
    }
}
