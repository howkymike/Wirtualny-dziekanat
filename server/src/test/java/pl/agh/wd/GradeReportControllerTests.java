package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import pl.agh.wd.jwt.JwtAuthEntryPoint;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.CreateGradeReportRequest;
import pl.agh.wd.repository.*;
import pl.agh.wd.service.UserDetailsImpl;
import pl.agh.wd.service.UserDetailsServiceImpl;

import java.util.*;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = pl.agh.wd.controller.GradeReportController.class)
public class GradeReportControllerTests {

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
    private CourseRepository courseRepository;

    @MockBean
    private GradeReportRepository gradeReportRepository;

    private static final UserDetailsImpl adminUser = new UserDetailsImpl(1L,"admin",
            "hey@wp.com","xxx",true,
            Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN")),
            false,null);

    @Test
    void givenGradeReportRequest_withIncorrectCourse_returnBadRequest() throws Exception {
        when(courseStudentRepository.findById(any())).thenReturn(Optional.empty());

        RequestBuilder request = MockMvcRequestBuilders
                .post("/api/gradeReports/5")
                .accept(MediaType.APPLICATION_JSON)
                .content("{\"lecturerId\":1,\"message\":\"You rock!\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(adminUser));

        mvc.perform(request)
            .andExpect(status().is(400))
            .andExpect(jsonPath("$.msg", is("Course not exist.")));
    }

    @Test
    void givenGradeReportRequest_withIncorrectLecturer_returnBadRequest() throws Exception {
        CourseStudent courseStudent = new CourseStudent();
        when(courseStudentRepository.findById(any())).thenReturn(Optional.of(courseStudent));
        when(lecturerRepository.findById(any())).thenReturn(Optional.empty());

        RequestBuilder request = MockMvcRequestBuilders
                .post("/api/gradeReports/5")
                .accept(MediaType.APPLICATION_JSON)
                .content("{\"lecturerId\":1,\"message\":\"You rock!\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(adminUser));

        mvc.perform(request)
                .andExpect(status().is(400))
                .andExpect(jsonPath("$.msg", is("Lecturer not exist.")));
    }

    @Test
    void givenGradeReportRequest_withInvalidLecturer_returnBadRequest() throws Exception {
        CourseStudent courseStudent = new CourseStudent();
        when(courseStudentRepository.findById(any())).thenReturn(Optional.of(courseStudent));
        Lecturer lecturer = new Lecturer();
        when(lecturerRepository.findById(any())).thenReturn(Optional.of(lecturer));
        Course course = new Course();
        course.setCourseLecturers(new HashSet<Lecturer>());//(Collections.singleton(lecturer));
        when(courseRepository.findById(any())).thenReturn(Optional.of(course));

        RequestBuilder request = MockMvcRequestBuilders
                .post("/api/gradeReports/5")
                .accept(MediaType.APPLICATION_JSON)
                .content("{\"lecturerId\":1,\"message\":\"You rock!\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(adminUser));

        mvc.perform(request)
                .andExpect(status().is(400))
                .andExpect(jsonPath("$.msg", is("Invalid Lecturer.")));
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void givenGradeReportRequest_returnGradeReport() throws Exception {
        CreateGradeReportRequest createGradeReportRequest = new CreateGradeReportRequest();
        createGradeReportRequest.setLecturerId(1L);
        createGradeReportRequest.setMessage("You rock!");

        CourseStudent courseStudent = new CourseStudent();
        when(courseStudentRepository.findById(any())).thenReturn(java.util.Optional.of(courseStudent));

        Lecturer lecturer = new Lecturer();
        when(lecturerRepository.findById(any())).thenReturn(java.util.Optional.of(lecturer));

        Course course = new Course();
        course.setCourseLecturers(Collections.singleton(lecturer));
        when(courseRepository.findById(any())).thenReturn(java.util.Optional.of(course));


        RequestBuilder request = MockMvcRequestBuilders
                .post("/api/gradeReports/5")
                .accept(MediaType.APPLICATION_JSON)
                .content("{\"lecturerId\":1,\"message\":\"You rock!\"}")
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(adminUser));


        MvcResult result = mvc.perform(request)
                .andExpect(status().isOk()).andReturn();

        verify(gradeReportRepository, times(1)).save(Mockito.any(GradeReport.class));

    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void setReadReport() throws Exception {

        when(gradeReportRepository.setIsReadFor(any(), eq(true))).thenReturn(1);

        RequestBuilder request = MockMvcRequestBuilders
                .post("/api/gradeReports/5/read")
                .accept(MediaType.APPLICATION_JSON)
                .with(user(adminUser));


        MvcResult result = mvc.perform(request)
                .andExpect(status().isMethodNotAllowed()).andReturn();

    }
}
