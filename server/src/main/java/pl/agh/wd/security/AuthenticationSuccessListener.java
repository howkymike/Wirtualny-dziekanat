package pl.agh.wd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

/**
 * Executes every time there is a successful authentication
 * Purpose: Reset authentication login attempt counter for the user
 * @author howkymike
 */
@Component
public class AuthenticationSuccessListener
        implements ApplicationListener<AuthenticationSuccessEvent> {

    @Autowired
    private UserLockingService userLockingService;

    public void onApplicationEvent(AuthenticationSuccessEvent e) {
        String username = e.getAuthentication().getName();

        userLockingService.resetLoginFailure(username);
    }
}