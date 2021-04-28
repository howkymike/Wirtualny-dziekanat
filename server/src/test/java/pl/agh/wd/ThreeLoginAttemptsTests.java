package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.agh.wd.controller.AuthController;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.LoginRequest;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.security.UserLockingService;

import java.util.Optional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ThreeLoginAttemptsTests {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthController controller;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserLockingService userLockingService;

    @Test
    public void testThreeLoginAttemptsBlockSuccess() {
        User user = new User("bezimienny", "gothic2nockruka@gmail.com", encoder.encode("gomez"));
        userRepository.save(user);

        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().getFailedLoginCounter() == 0);
            assert(!userOptional.get().isLocked());
            assert(userLockingService != null);
        }

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("bezimienny");
        loginRequest.setPassword("milten");

        try {
            controller.authenticateUser(loginRequest);
        }
        catch(BadCredentialsException exception)
        {
            assert(exception.getMessage().equals("Bad credentials"));
        }
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().getFailedLoginCounter() == 1);
            assert(!userOptional.get().isLocked());
        }

        loginRequest.setPassword("diego");
        try {
            controller.authenticateUser(loginRequest);
        }
        catch(BadCredentialsException exception)
        {
            assert(exception.getMessage().equals("Bad credentials"));
        }
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().getFailedLoginCounter() == 2);
            assert(!userOptional.get().isLocked());
        }

        loginRequest.setPassword("gorn");
        try {
            controller.authenticateUser(loginRequest);
        }
        catch(BadCredentialsException exception)
        {
            assert(exception.getMessage().equals("Bad credentials"));
        }
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().getFailedLoginCounter() == 3);
        }

        loginRequest.setPassword("xardas");
        try {
            controller.authenticateUser(loginRequest);
        }
        catch(BadCredentialsException exception)
        {
            assert(exception.getMessage().equals("Bad credentials"));
        }
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().isLocked());

        }
        boolean exceptionThrown = false;
        loginRequest.setPassword("gomez");
        try {
            controller.authenticateUser(loginRequest);
        }
        catch(LockedException exception)
        {
            assert(exception.getMessage().equals("User account is locked"));
            exceptionThrown = true;
        }
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(userOptional.get().isLocked());
            assert(exceptionThrown);

        }

        userLockingService.resetLoginFailure("bezimienny");
        {
            Optional<User> userOptional = userRepository.findByUsername("bezimienny");
            assert(userOptional.isPresent());
            assert(!userOptional.get().isLocked());

        }




    }

}
