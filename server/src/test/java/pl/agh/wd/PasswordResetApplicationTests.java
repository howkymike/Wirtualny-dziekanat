package pl.agh.wd;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.agh.wd.controller.ForgetPasswordController;
import pl.agh.wd.model.PasswordResetToken;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.ChangePasswordRequest;
import pl.agh.wd.payload.request.ForgetPasswordRequest;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.repository.PasswordResetTokenRepository;
import pl.agh.wd.repository.UserRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PasswordResetApplicationTests {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ForgetPasswordController controller;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    PasswordResetTokenRepository prTokenRepository;


    @Test
    public void testForgetPasswordSuccess() throws Exception {
        User user = new User("howkymike", "howkymike123@gmail.com", encoder.encode("jestemKozakiemZWietu"));
        userRepository.save(user);
        Optional<User> userOptional = userRepository.findByUsername("howkymike");
        assert(userOptional.isPresent());

        ForgetPasswordRequest fpRequest = new ForgetPasswordRequest();
        fpRequest.setUsername("howkymike");

        ResponseEntity response = controller.forgetPassword(fpRequest);

        // forgetPassword should send an email with a token that leads to password reset - would that even be testable?

        assert(response.getStatusCode().toString().equals("200 OK"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.MessageResponse"));
    }

    @Test
    public void testForgetPasswordFailure() throws Exception {

        Optional<User> userOptional = userRepository.findByUsername("howkymike");
        // Assert for "howkymike" not being in DB - this test relies on that being true
        assert(userOptional.isEmpty());

        ForgetPasswordRequest fpRequest = new ForgetPasswordRequest();
        fpRequest.setUsername("howkymike");
        ResponseEntity response = controller.forgetPassword(fpRequest);

        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.MessageResponse"));
    }

    @Test
    public void testChangePasswordSuccess() throws Exception {
        User user = new User("howkymike", "howkymike123@gmail.com", encoder.encode("jestemKozakiemZWietu"));
        user.setIsNew(false);
        userRepository.save(user);
        {
            Optional<User> userOptional = userRepository.findByUsername("howkymike");
            assert(userOptional.isPresent());
        }

        PasswordResetToken prToken = new PasswordResetToken("TokenDlaHowkymike", user);
        prTokenRepository.save(prToken);

        //Optional<PasswordResetToken> prTokenOptional = prTokenRepository....
        // TODO: determine if the world will collapse if we change to Optional in PR repository

        {
            PasswordResetToken testToken  = prTokenRepository.findByToken("TokenDlaHowkymike");
            assert(testToken!=null);
        }
        ChangePasswordRequest cpRequest = new ChangePasswordRequest();
        cpRequest.setNewPassword("WietKrule");
        cpRequest.setToken("TokenDlaHowkymike");

        ResponseEntity response = controller.changePassword(cpRequest);
        assert(response.getStatusCode().toString().equals("200 OK"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.MessageResponse"));

        Optional<User> testUser = userRepository.findByUsername("howkymike");
        assert(testUser.isPresent());
        assert(encoder.matches("WietKrule", testUser.get().getPassword()));
    }

    @Test
    public void testChangePasswordFailure() throws Exception {

        User user = new User("howkymike", "howkymike123@gmail.com", encoder.encode("jestemKozakiemZWietu"));
        userRepository.save(user);
        PasswordResetToken prToken = new PasswordResetToken("TokenDlaHowkymike", user);

        {
            Optional<User> userOptional = userRepository.findByUsername("howkymike");
            assert(userOptional.isPresent());

            PasswordResetToken testToken  = prTokenRepository.findByToken("TokenDlaHowkymike");
            assert(testToken==null);

        }

        ChangePasswordRequest cpRequest = new ChangePasswordRequest();
        cpRequest.setNewPassword("WietKrule");
        cpRequest.setToken("TokenDlaHowkymike");

        ResponseEntity response = controller.changePassword(cpRequest);

        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.MessageResponse"));

        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(new Date().getTime());

        prToken.setExpiryDate(new Date(cal.getTime().getTime()));
        Thread.sleep(1000); // Sleep for 1s (should expire token)
        prTokenRepository.save(prToken);
        {
            PasswordResetToken testToken  = prTokenRepository.findByToken("TokenDlaHowkymike");
            assert(testToken!=null);
        }

        response = controller.changePassword(cpRequest);

        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.MessageResponse"));

    }
}
