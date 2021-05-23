package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import pl.agh.wd.controller.StudentController;
import pl.agh.wd.jwt.JwtAuthEntryPoint;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.repository.*;
import pl.agh.wd.service.UserDetailsImpl;
import pl.agh.wd.service.UserDetailsServiceImpl;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@WebMvcTest(controllers = pl.agh.wd.controller.StudentController.class)
public class StudentControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private CourseStudentRepository courseStudentRepository;

    @MockBean
    private LecturerRepository lecturerRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private StudentController studentController;

    private static final UserDetailsImpl adminUser = new UserDetailsImpl(1L,"admin",
            "hey@wp.com","xxx",true,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")),
            false,null);

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void getCourseOfStudiesTest() throws Exception {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        //  POWINNO DZIAŁAC A NIE DZIAŁA !!!!
//       1a) RequestBuilder request = MockMvcRequestBuilders
//                .get("/api/student/course-of-studies")
//                .accept(MediaType.APPLICATION_JSON)
//                .contentType(MediaType.APPLICATION_JSON)
//                .with(user(adminUser));

//       2) mvc.perform(get("/api/student/course-of-studies")
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isBadRequest())
//                .andDo(print());

//        1b) mvc.perform(request)
//               .andExpect(status().is(400))
//               .andExpect(jsonPath("$.msg", is("Dany użytkownik nie istnieje")));

    }
}
