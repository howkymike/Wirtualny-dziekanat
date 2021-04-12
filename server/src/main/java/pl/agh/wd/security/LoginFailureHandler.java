package pl.agh.wd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import pl.agh.wd.model.User;
import pl.agh.wd.repository.UserRepository;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;


@Component
public class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler
        implements AuthenticationFailureHandler {

    @Autowired
    UserRepository userRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        String failedUsername = request.getParameter("username");
        Optional<User> user = userRepository.findByUsername(failedUsername);

        if (user.isPresent()) {
            User failedUser = user.get();
            failedUser.setFailedLoginAttempts(failedUser.getFailedLoginAttempts() + 1);

            if(failedUser.getFailedLoginAttempts() >= 3) {
                failedUser.setBlocked(true);
            }

            userRepository.save(failedUser);
        }
    }
}