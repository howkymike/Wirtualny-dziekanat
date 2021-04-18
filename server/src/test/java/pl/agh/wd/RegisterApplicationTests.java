package pl.agh.wd;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.AuthController;
import pl.agh.wd.payload.request.RegisterRequest;
import pl.agh.wd.repository.FirstTimeTokenRepository;
import pl.agh.wd.repository.RoleRepository;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.service.UserDetailsImpl;

import java.util.Collection;
import java.util.stream.Stream;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class RegisterApplicationTests {

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

    @Autowired
    RoleRepository roleRepository;

    @BeforeAll
    static void seciurityMock() {
        Authentication authentication = Mockito.mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }


    @Test
    void contextLoads() throws Exception {
        assertThat(controller).isNotNull();
    }

    @Test
    void testRegisterNoAuth() throws Exception {
        RegisterRequest signUpRequest = new RegisterRequest();
        signUpRequest.setUsername("kamil");
        signUpRequest.setPassword("admin");
        signUpRequest.setEmail("wirtualnt@gmail.com");
        seciurityMock();
        ResponseEntity response = controller.registerUser(signUpRequest);
        System.out.println(response.getStatusCode());
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void testRegisterWithExistingUsername() throws Exception {
        RegisterRequest signUpRequest = new RegisterRequest();
        signUpRequest.setUsername("kamil");
        signUpRequest.setPassword("admin");
        signUpRequest.setEmail("wirtualnt123@gmail.com");
        ResponseEntity response = controller.registerUser(signUpRequest);
        System.out.println(response.getStatusCode());
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void testRegisterWithExistingEmail() throws Exception {
        RegisterRequest signUpRequest = new RegisterRequest();
        signUpRequest.setUsername("Sven");
        signUpRequest.setPassword("Raucha-Dawidela");
        signUpRequest.setEmail("wirtualnt@gmail.com");
        ResponseEntity response = controller.registerUser(signUpRequest);
        System.out.println(response.getStatusCode());
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testRegisterSuccess() throws Exception {
        RegisterRequest signUpRequest = new RegisterRequest();
        signUpRequest.setUsername("Svenik");
        signUpRequest.setPassword("Raucha-Dawidela");
        signUpRequest.setEmail("wdoope@motzno.com");
        ResponseEntity response = controller.registerUser(signUpRequest);
        assert(response.getStatusCode().toString().equals("200 OK"));
    }
}
