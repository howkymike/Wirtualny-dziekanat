package pl.agh.wd.task;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.agh.wd.repository.CourseStudentRepository;
import pl.agh.wd.repository.PasswordResetTokenRepository;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

@Service
@Transactional
@RequiredArgsConstructor
public class ConfirmGradesTask {

    @Autowired
    private final CourseStudentRepository courseStudentRepository;

    @Scheduled(cron = "${confirmGrades.cron.expression}")
    public void confirmAllOldGrades() {
        Date monthAgo = Date.from(ZonedDateTime.now().minusMonths(1).toInstant());
        courseStudentRepository.confirmAllOlderThan(monthAgo);
    }
}








