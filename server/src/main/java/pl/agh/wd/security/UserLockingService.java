package pl.agh.wd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.agh.wd.repository.UserRepository;

import java.util.Date;


/**
 * Service responsible for locking user accounts
 *
 * @author howkymike
 */
@Service
public class UserLockingService {
    @Value("${dziekanat.security.failedlogincount}")
    private int maxFailedLogins;

    @Autowired
    UserRepository userRepository;

    public UserLockingService() {
    }

    public void increaseLoginFailure(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            if (!user.isLocked()) {
                int failedLoginCounter = user.getFailedLoginCounter();
                if (failedLoginCounter >= maxFailedLogins) {
                    user.setLocked(true);
                    user.setLockedAt(new Date());
                }
                else
                    user.setFailedLoginCounter(failedLoginCounter + 1);
                userRepository.save(user);
            }
        });
    }

    public void resetLoginFailure(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setFailedLoginCounter(0);
            user.setLocked(false);
            userRepository.save(user);
        });
    }

}
