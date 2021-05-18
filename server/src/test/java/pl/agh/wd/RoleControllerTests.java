package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import pl.agh.wd.controller.RoleController;
import pl.agh.wd.repository.RoleRepository;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RoleControllerTests {

    @Autowired
    RoleController roleController;

    @Autowired
    RoleRepository roleRepository;


    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testGetRoles() {
        ResponseEntity<?> response = roleController.getRoles();
        assert(response.getStatusCode().toString().equals("200 OK"));
    }
}
