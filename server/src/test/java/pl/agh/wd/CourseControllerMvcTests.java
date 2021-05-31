package pl.agh.wd;

import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.CourseController;
import pl.agh.wd.jwt.JwtAuthEntryPoint;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.model.*;
import pl.agh.wd.repository.*;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.agh.wd.service.UserDetailsImpl;
import pl.agh.wd.service.UserDetailsServiceImpl;

import java.util.*;


@WebMvcTest(controllers = CourseController.class)
public class CourseControllerMvcTests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private CourseRepository courseRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private FieldOfStudyRepository fieldOfStudyRepository;

    @MockBean
    private StudentRepository studentRepository;

    @MockBean
    private CourseStudentRepository courseStudentRepository;

    @MockBean
    private FieldOfStudyStudentRepository fieldOfStudyStudentRepository;

    @MockBean
    private LecturerRepository lecturerRepository;

    private static final UserDetailsImpl adminUser = new UserDetailsImpl(1L,"admin",
            "hey@wp.com","xxx",true,
            Arrays.asList(new SimpleGrantedAuthority("ROLE_STUDENT")),
            false,null);

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void getCourses() throws Exception {
        Faculty iet = new Faculty("IET");
        Faculty gig = new Faculty("GiG");

        Course courseOne = new Course("courseOne", 5, 5,5,false);
        Course courseTwo = new Course("courseTwo", 5, 5,5,false);

        List<Course> allCourses = Arrays.asList(courseOne, courseTwo);

        given(courseRepository.findAll()).willReturn(allCourses);

        mvc.perform(get("/api/courses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                //.andDo(print())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("courseOne")))
                .andExpect(jsonPath("$[1].name", is("courseTwo")));
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void getMyCourses() throws Exception {
//
//
//        User testUserOne = new User("testUserOne", "aaa", "aaa");
//        User testUserTwo = new User("testUserTwo", "aaa", "aaa");
//        Student testStudentOne = new Student(testUserOne, 11, "aaa", 1,1,1);
//        Student testStudentTwo = new Student(testUserTwo, 11, "aaa", 1,1,1);
//
//        Course courseOne = new Course("courseOne", 5, 5,5,false);
//        Course courseTwo = new Course("courseTwo", 5, 5,5,false);
//
//        CourseStudent coStOne = new CourseStudent(courseOne, testStudentOne);
//        CourseStudent coStTwo = new CourseStudent(courseTwo, testStudentTwo);
//        List<CourseStudent> allCS = Arrays.asList(coStOne, coStTwo);
//
//        when(courseStudentRepository.findById(any())).thenReturn(Optional.of(coStOne));
//
//        mvc.perform(get("/api/courses/my/1")
//                .contentType(MediaType.APPLICATION_JSON));
        // no impl yet.
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void getCourseLecturers() throws Exception {


        User testUserOne = new User("testUserOne", "aaa", "aaa");
        User testUserTwo = new User("testUserTwo", "aaa", "aaa");
        Lecturer testLecturerOne = new Lecturer(testUserOne, "pHD");
        Lecturer testLecturerTwo = new Lecturer(testUserTwo, "mgr");
        Set<Lecturer> allLecturers = new HashSet<Lecturer>();
        allLecturers.add(testLecturerOne);
        allLecturers.add(testLecturerTwo);

        Course courseOne = new Course("courseOne", 5, 5,5,false);
        courseOne.setCourseLecturers(allLecturers);

        when(courseRepository.findById((any()))).thenReturn(Optional.of(courseOne));

        mvc.perform(get("/api/courses/1/lecturers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

}