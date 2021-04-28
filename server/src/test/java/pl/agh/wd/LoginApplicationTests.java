package pl.agh.wd;


import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.agh.wd.controller.AuthController;
import pl.agh.wd.model.FirstTimeToken;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.FirstTimeRequest;
import pl.agh.wd.payload.request.LoginRequest;
import pl.agh.wd.repository.FirstTimeTokenRepository;
import pl.agh.wd.repository.UserRepository;

import java.util.UUID;


@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class LoginApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private AuthController controller;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FirstTimeTokenRepository tokenRepository;

    @Autowired
    PasswordEncoder encoder;



    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    public void greetingShouldReturnDefaultMessage() {
        assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/",
                String.class)).contains("Unauthorized");
    }

    @Test
    public void testLoginSuccess() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("admin");

        ResponseEntity<?> response = controller.authenticateUser(loginRequest);

        assert(response.getStatusCode().toString().equals("200 OK"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.JwtResponse"));
    }

    @Test
    public void testLoginFailure() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("Dawid Jarosz");
        loginRequest.setPassword("Kocham Svena");

        try {
            controller.authenticateUser(loginRequest);
        }
        catch(BadCredentialsException exception)
        {
            assert(exception.getMessage().equals("Bad credentials"));
        }
    }

    @Test
    public void testFirstLogin() {
        User user = new User("Dawid Jarosz", "dawidsven69@gmail.com", encoder.encode("Kocham Svena"));
        userRepository.save(user);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("Dawid Jarosz");
        loginRequest.setPassword("Kocham Svena");
        ResponseEntity<?> response = controller.authenticateUser(loginRequest);

        assert(response.getStatusCode().toString().equals("200 OK"));
        assert (response.getBody().toString().contains("pl.agh.wd.payload.response.FirstTimeResponse"));
    }

    @Test
    public void testFirstTimeLogin() {
        User user = new User("Dawid Jarosz2", "dawidsven696@gmail.com", encoder.encode("Kocham Svena"));
        userRepository.save(user);
        FirstTimeToken token = new FirstTimeToken(UUID.randomUUID().toString(), user);
        tokenRepository.save(token);
        FirstTimeRequest firstTimeRequest = new FirstTimeRequest();
        firstTimeRequest.setToken(token.getToken());
        firstTimeRequest.setPassword("aaabbb");
        firstTimeRequest.setPassword2("aaabbb");
        controller.firstTime(firstTimeRequest);
        user = userRepository.findByUsername("Dawid Jarosz2").get();
        assert(!user.getIsNew());
        assert(encoder.matches("aaabbb", user.getPassword()));
    }

    @Test
    public void testFirstTimeLoginUserNotPresent() {
        User user = new User("Dawid Jarosz", "dawidsven696@gmail.com", encoder.encode("Kocham Svena"));
        FirstTimeToken token = new FirstTimeToken(UUID.randomUUID().toString(), user);
        FirstTimeRequest firstTimeRequest = new FirstTimeRequest();
        firstTimeRequest.setToken(token.getToken());
        firstTimeRequest.setPassword("aaabbb");
        firstTimeRequest.setPassword2("aaabbb");
        ResponseEntity<?> response = controller.firstTime(firstTimeRequest);
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.SuccessResponse"));
    }

    @Test
    public void testFirstTimeLoginPasswordsNoEqual() {
        User user = new User("Dawid Jarosz21", "dawidsven6969@gmail.com", encoder.encode("Kocham Svena"));
        userRepository.save(user);
        FirstTimeToken token = new FirstTimeToken(UUID.randomUUID().toString(), user);
        tokenRepository.save(token);
        FirstTimeRequest firstTimeRequest = new FirstTimeRequest();
        firstTimeRequest.setToken(token.getToken());
        firstTimeRequest.setPassword("aaabbb");
        firstTimeRequest.setPassword2("aaabbb2");
        ResponseEntity<?> response = controller.firstTime(firstTimeRequest);
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.SuccessResponse"));
    }
}
