package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;
import pl.agh.wd.controller.CourseController;
import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.CourseRequest;
import pl.agh.wd.repository.*;

import java.util.*;

@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
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

    @Autowired
    private RoleRepository roleRepository;

    @Lazy
    @Autowired
    PasswordEncoder encoder;

    long createLecturer() {
        Set<Role> roles = new HashSet<>();
        Role lecturerRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(lecturerRole);
        User user = new User("testLecturer",
                "testLecturer@gmail.com",
                encoder.encode("testLecturer"),
                "testLecturer",
                "testLecturer",
                "Polska",
                "Kraków",
                "A-0 XXX",
                "32-675",
                "123123123",
                roles,
                false);
        Lecturer lecturer = new Lecturer(user, "PhD");
        return lecturerRepository.save(lecturer).getId();
    }

    long createLecturerForEdit() {
        Set<Role> roles = new HashSet<>();
        Role lecturerRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(lecturerRole);
        User user = new User("testLecturer2",
                "testLecturer2@gmail.com",
                encoder.encode("testLecturer2"),
                "testLecturer2",
                "testLecturer2",
                "Polska2",
                "Kraków",
                "A-0 XXX",
                "32-675",
                "123123123",
                roles,
                false);
        Lecturer lecturer = new Lecturer(user, "PhD");
        return lecturerRepository.save(lecturer).getId();
    }

    long createStudent() {
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Error: Student Role is not found."));
        roles.add(studentRole);
        User user = new User("testuser",
                "testuser@gmail.com",
                encoder.encode("testuser"));
        user.setName("testuser");
        user.setSurname("testuser");
        user.setCountry("Polska");
        user.setCity("Kraków");
        user.setAddress("none");
        user.setPostalCode("30-123");
        user.setTelephone("123123123");
        user.setRoles(roles);
        user.setIsNew(false);
        Student s1 = new Student(user, 125987, "inżynierskie", 2019, 9, 1);
        s1.setSemester(1);
        return studentRepository.save(s1).getId();
    }

    long createStudentForEdit() {
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Error: Student Role is not found."));
        roles.add(studentRole);
        User user = new User("testuser2",
                "testuser2@gmail.com",
                encoder.encode("testuser2"));
        user.setName("testuser2");
        user.setSurname("testuser2");
        user.setCountry("Polska2");
        user.setCity("Kraków2");
        user.setAddress("none");
        user.setPostalCode("30-123");
        user.setTelephone("123123124");
        user.setRoles(roles);
        user.setIsNew(false);
        Student s1 = new Student(user, 125987, "inżynierskie", 2019, 9, 1);
        s1.setSemester(2);
        return studentRepository.save(s1).getId();
    }

    long getRandomFieldOfStudyId() {
        List<FieldOfStudy> fieldOfStudyList = fieldOfStudyRepository.findAll();
        if(!fieldOfStudyList.isEmpty())
            return fieldOfStudyList.get(0).getId();
        // TODO create fieldOfStudy instead of throwing an error
        throw new Error("There are non field of studies!");
    }


    void createCourse() {
        long fieldOfStudy = getRandomFieldOfStudyId();
        long studentId = createStudent();
        long lecturerId = createLecturer();
        CourseRequest courseRequest = new CourseRequest();
        courseRequest.setName("Sven and Dawid");
        courseRequest.setEcts(5);
        courseRequest.setFieldOfStudyId(fieldOfStudy);
        courseRequest.setExam(false);
        courseRequest.setLaboratory_time(11);
        courseRequest.setLecture_time(12);
        Set<Long> lecturers = new HashSet<>();
        lecturers.add(lecturerId);
        Set<Long> students = new HashSet<>();
        students.add(studentId);
        courseRequest.setCourseStudentIds(students);
        courseRequest.setCourseLecturerIds(lecturers);
        ResponseEntity<?> response = controller.createCourse(courseRequest);
        assert(response.getStatusCode().toString().equals("200 OK"));
        Optional<Lecturer> lecturer = lecturerRepository.findById(lecturerId);
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
        Set<Course> set= new HashSet<>();
        set.add(course.get());
        lecturer.get().setCourses(set);
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testCreateCourse() {
        createCourse();
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
        assert(course.get().getEcts() == 5);
        assert(course.get().getLecture_time() == 12);
        assert(course.get().getLaboratory_time() == 11);
        assert(!course.get().isExam());
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testDeleteCourse() {
        createCourse();
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
        ResponseEntity<?> response = controller.deleteCourse(course.get().getId());
        assert(response.getStatusCode().toString().equals("200 OK"));
        Optional<Course> course2 = courseRepository.findByName("Sven and Dawid");
//        assert(course2.isEmpty());
    }

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void testEditCourse() {
        createCourse();
        Optional<Course> course = courseRepository.findByName("Sven and Dawid");
        assert(course.isPresent());
        long fieldOfStudy = getRandomFieldOfStudyId();
        long studentId = createStudentForEdit();
        long lecturerId = createLecturerForEdit();
        CourseRequest courseRequest = new CourseRequest();
        courseRequest.setName("Sven and Bartosh");
        courseRequest.setEcts(6);
        courseRequest.setFieldOfStudyId(fieldOfStudy);
        courseRequest.setExam(false);
        courseRequest.setLaboratory_time(11);
        courseRequest.setLecture_time(12);
        Set<Long> lecturers = new HashSet<>();
        lecturers.add(lecturerId);
        Set<Long> students = new HashSet<>();
        students.add(studentId);
        courseRequest.setCourseStudentIds(students);
        courseRequest.setCourseLecturerIds(lecturers);
        ResponseEntity<?> response = controller.editCourse(courseRequest, course.get().getId());
        assert(response.getStatusCode().toString().equals("200 OK"));
        course = courseRepository.findByName("Sven and Bartosh");
        assert(course.isPresent());
        assert(course.get().getEcts() == 6);
        assert(course.get().getLecture_time() == 12);
        assert(course.get().getLaboratory_time() == 11);
        assert(!course.get().isExam());
    }
}
