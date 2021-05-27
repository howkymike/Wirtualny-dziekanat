package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import pl.agh.wd.jwt.JwtAuthEntryPoint;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.model.*;
import pl.agh.wd.repository.*;
import pl.agh.wd.service.UserDetailsImpl;
import pl.agh.wd.service.UserDetailsServiceImpl;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    StudentRepository studentRepository;

    @MockBean
    FieldOfStudyStudentRepository fieldOfStudyStudentRepository;

    @MockBean
    FieldOfStudyRepository fieldOfStudyRepository;

    private static final UserDetailsImpl adminUser = new UserDetailsImpl(1L,"admin",
            "hey@wp.com","xxx",true,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")),
            false,null);

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void usingInexistentUser_returnError() throws Exception {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        mvc.perform(get("/api/student/course-of-studies")
                .with(user(adminUser))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Dany użytkownik nie istnieje")));

    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void usingInexistentStudent_returnError() throws Exception {
        User admUsr = new User();
        when(userRepository.findById(any())).thenReturn(Optional.of(admUsr));
        when(studentRepository.findById(any())).thenReturn(Optional.empty());

        mvc.perform(get("/api/student/course-of-studies")
                .with(user(adminUser))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Dany użytkownik nie jest studentem")));
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void givenStudent_returnCourseOfStudiesResponse() throws Exception {
        User admUsr = new User();
        when(userRepository.findById(any())).thenReturn(Optional.of(admUsr));
        Student student = new Student();
        student.setUser(admUsr);
        student.setCommencmentOfStudies(new Date());
        student.setId(1L);
        when(studentRepository.findById(any())).thenReturn(Optional.of(student));
        Faculty faculty = new Faculty();
        faculty.setName("ggios");
        FieldOfStudy fieldOfStudy = new FieldOfStudy();
        fieldOfStudy.setFaculty(faculty);
        fieldOfStudy.setId(2L);
        fieldOfStudy.setName("Sample");
        FieldOfStudyStudent fieldOfStudyStudent = new FieldOfStudyStudent();
        fieldOfStudyStudent.setStudent(student);
        fieldOfStudyStudent.setFieldOfStudy(fieldOfStudy);
        when(fieldOfStudyStudentRepository.findAllByStudentId(1L)).thenReturn(Collections.singletonList(fieldOfStudyStudent));
        when(fieldOfStudyRepository.findById(2L)).thenReturn(Optional.of(fieldOfStudy));

        mvc.perform(get("/api/student/course-of-studies")
                .with(user(adminUser))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.fieldsOfStudies[0].faculty", is("ggios")))
                .andExpect(jsonPath("$.fieldsOfStudies[0].fieldOfStudy", is("Sample")));
    }
}
