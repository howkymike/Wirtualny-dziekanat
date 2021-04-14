package pl.agh.wd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

/**
 * Executes every time there is an unsuccessful authentication
 * Purpose: Increase authentication login attempt counter for the user
 *          or lock the account
 * @author howkymike
 */
@Component
public class AuthenticationFailureListener
        implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    @Autowired
    private UserLockingService userLockingService;

    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent e) {
        String username = e.getAuthentication().getName();

        userLockingService.increaseLoginFailure(username);
    }
}