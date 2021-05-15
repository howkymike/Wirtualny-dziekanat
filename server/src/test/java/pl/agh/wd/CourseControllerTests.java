package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.CourseController;
import pl.agh.wd.model.Course;
import pl.agh.wd.payload.request.CourseRequest;
import pl.agh.wd.repository.*;

import java.util.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CourseControllerTests {

    @Autowired
    private CourseController controller;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CourseStudentRepository courseStudentRepository;

    @Autowired
    LecturerRepository lecturerRepository;

    void createCourse() {
        CourseRequest courseRequest = new CourseRequest();
        courseRequest.setName("Sven and Dawid");
        courseRequest.setEcts(5);
        courseRequest.setFieldOfStudyId(10);
        courseRequest.setExam(false);
        courseRequest.setLaboratory_time(11);
        courseRequest.setLecture_time(12);
        Set<Long> lecturers = new HashSet<>();
        lecturers.add(4L);
        lecturers.add(7L);
        Set<Long> students = new HashSet<>();
        students.add(2L);
        courseRequest.setCourseStudentIds(students);
        courseRequest.setCourseLecturerIds(lecturers);
        ResponseEntity response = controller.createCourse(courseRequest);
        assert(response.getStatusCode().toString().equals("200 OK"));
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testCreateCourse() {
        createCourse();
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testDeleteCourse() {
        createCourse();
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
        ResponseEntity response = controller.deleteCourse(course.get().getId());
        assert(response.getStatusCode().toString().equals("200 OK"));
        course = courseRepository.findByName("Sven and Dawid");
        assert(course.isEmpty());
    }
}
