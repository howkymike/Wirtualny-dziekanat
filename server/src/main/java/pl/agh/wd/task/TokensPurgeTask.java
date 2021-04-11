package pl.agh.wd.task;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.agh.wd.repository.PasswordResetTokenRepository;

import javax.transaction.Transactional;
import java.util.Date;
import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class TokensPurgeTask {

    @Autowired
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Scheduled(cron = "${purge.cron.expression}")
    public void purgeExpired(){
        Date now = Date.from(Instant.now());
        passwordResetTokenRepository.deleteAllExpiredTokens(now);
    }
}
