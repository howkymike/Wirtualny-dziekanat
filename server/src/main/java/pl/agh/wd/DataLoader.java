package pl.agh.wd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.agh.wd.model.*;
import pl.agh.wd.repository.*;

import java.util.*;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseStudentRepository courseStudentRepository;

    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Lazy
    @Autowired
    PasswordEncoder encoder;

    @Value( "${spring.mail.username}" )
    private String adminMail;

    private void createAdmin() {
        Set<Role> roles = new HashSet<>();
        Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Admin Role is not found."));
        roles.add(adminRole);
        User user = new User("admin",
                adminMail,
                encoder.encode("admin"));
        user.setName("Sven");
        user.setSurname("Raucha-Cumilaa");
        user.setCountry("Polska");
        user.setCity("Kraków");
        user.setAddress("Al. Mickiewicza 25");
        user.setPostalCode("31-445");
        user.setTelephone("696969696");
        user.setRoles(roles);
        user.setIsNew(false);
        userRepository.save(user);
    }

    private void createStudent() {
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Error: Student Role is not found."));
        roles.add(studentRole);
        User user = new User("kamil",
                "wirtualnt@gmail.com",
                encoder.encode("kamil"));
        user.setName("Kamil");
        user.setSurname("Wiercik");
        user.setCountry("Polska");
        user.setCity("Kraków");
        user.setAddress("Al. Mickiewicza 25");
        user.setPostalCode("31-445");
        user.setTelephone("696969696");
        user.setRoles(roles);
        user.setIsNew(false);
        studentRepository.save(new Student(user, 123456));
    }


    private void createClerk() {
        Set<Role> roles = new HashSet<>();
        Role clerkRole = roleRepository.findByName(RoleEnum.ROLE_STAFF)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(clerkRole);
        User user = new User("baba",
                "wirtualnt2@gmail.com",
                encoder.encode("baba"));
        user.setName("Baba");
        user.setSurname("Z dziekanatu");
        user.setCountry("Polska");
        user.setCity("Kraków");
        user.setAddress("Al. Linux jest z****isty 25");
        user.setPostalCode("31-445");
        user.setTelephone("420420420");
        user.setRoles(roles);
        user.setIsNew(false);
        clerkRepository.save(new Clerk(user));
    }

    private void createLecturer() {
        Set<Role> roles = new HashSet<>();
        Role lecturerRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(lecturerRole);
        User onderkaUser = new User("onder",
                "wirt21ualnt2@gmail.com",
                encoder.encode("onder"),
                "Zdzisław",
                "Onderka",
                "Polska",
                "Kraków",
                "A-0 Kanciapa",
                "31-445",
                "696969696",
                roles,
                false);
        lecturerRepository.save(new Lecturer(onderkaUser, "***PhD"));
    }

    private void createFaculties() {
        List<Faculty> facultyList = new ArrayList<>();
        facultyList.add(new Faculty("GGIOS"));
        facultyList.add(new Faculty("GGIS"));
        facultyList.add(new Faculty("IET"));
        facultyRepository.saveAll(facultyList);
    }

    private void createFieldOfStudy() {
        FieldOfStudy it = new FieldOfStudy("Computer Science");
        facultyRepository.findByName("IET").ifPresent(it::setFaculty);
        fieldOfStudyRepository.save(it);

        FieldOfStudy wildlife = new FieldOfStudy("Wildlife");
        facultyRepository.findByName("GGIOS").ifPresent(wildlife::setFaculty);
        fieldOfStudyRepository.save(wildlife);

        FieldOfStudy sexualityStudies = new FieldOfStudy("Sexuality Studies");
        facultyRepository.findByName("GGIS").ifPresent(sexualityStudies::setFaculty);
        fieldOfStudyRepository.save(sexualityStudies);
    }

    private void createCourses() {
        Course ecoCourse = new Course("Ecological space and sustainable development",
                30,15,3,false);
        fieldOfStudyRepository.findByName("Wildlife").ifPresent(ecoCourse::setFieldOfStudy);
        lecturerRepository.findByUserUsername("onder").ifPresent(l -> ecoCourse.setCourseLecturers(new HashSet<>(Collections.singletonList(l))));
        //studentRepository.findByUserUsername("kamil").ifPresent(s -> ecoCourse.setCourseStudents(new HashSet<>(Collections.singletonList(new CourseStudent(ecoCourse, s)))));
        courseRepository.save(ecoCourse);
        studentRepository.findByUserUsername("kamil").ifPresent(k -> courseStudentRepository.save(new CourseStudent(ecoCourse, k)));

        Course blockChainCourse = new Course("Blockchain",
                15,15,3,true);
        fieldOfStudyRepository.findByName("Computer Science").ifPresent(blockChainCourse::setFieldOfStudy);
        courseRepository.save(blockChainCourse);
    }

    public void run(ApplicationArguments args) {
        createAdmin();
        createStudent();
        createClerk();
        createLecturer();

        createFaculties();
        createFieldOfStudy();
        createCourses();
    }
}