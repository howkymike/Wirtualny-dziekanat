package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.AdminController;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BasicAdminControllerTests {

    @Autowired
    private AdminController adminController;

    @Test
    void contextLoads() throws Exception {
        assertThat(adminController).isNotNull();
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void testSecretText() throws Exception {

        String returnString = adminController.adminSecret();
        System.out.println(returnString);
        assert(returnString.equals("You are powerful now :D"));
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testPlatformInfo() throws Exception {
        ResponseEntity<?> response = adminController.platformInfo();
        assert(response.getBody().toString().contains("pl.agh.wd.payload.response.PlatformInfoResponse"));
        assert(response.getStatusCode().toString().equals("200 OK"));

    }

}
