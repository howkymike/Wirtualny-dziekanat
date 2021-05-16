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
    FieldOfStudyStudentRepository fieldOfStudyStudentRepository;

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
        studentRepository.save(new Student(user, 123456, "inżynierskie", 2018, 9, 1));

        User user2 = new User("meqeq",
        "wirtawdawdualnt@gmail.com",
        encoder.encode("meqeq"));
        user2.setName("Meqeq");
        user2.setSurname("Peqeq");
        user2.setCountry("Polska");
        user2.setCity("Podlasie");
        user2.setAddress("ul. Szkolna");
        user2.setPostalCode("31-445");
        user2.setTelephone("691169696");
        user2.setRoles(roles);
        user2.setIsNew(false);
        studentRepository.save(new Student(user2, 456789, "inżynierskie", 2019, 9, 1));

        User user3 = new User("michal",
        "wir2312t@gmail.com",
        encoder.encode("michal"));
        user3.setName("Michał");
        user3.setSurname("Jaszczombski");
        user3.setCountry("Polska");
        user3.setCity("Kraków");
        user3.setAddress("Ten z wiet'u");
        user3.setPostalCode("31-445");
        user3.setTelephone("696339696");
        user3.setRoles(roles);
        user3.setIsNew(false);
        studentRepository.save(new Student(user3, 123456, "inżynierskie", 2020, 9, 1));

    }


    private void createClerk() {
        Set<Role> roles = new HashSet<>();
        Role clerkRole = roleRepository.findByName(RoleEnum.ROLE_CLERK)
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

        Optional<Faculty> faculty = facultyRepository.findByName("IET");
        Clerk baba = new Clerk(user);
        faculty.ifPresent(baba::setFaculty);

        clerkRepository.save(baba);
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
        Optional<Faculty> faculty = facultyRepository.findByName("GGIOS");
        Lecturer zonder = new Lecturer(onderkaUser, "***PhD");
        faculty.ifPresent(zonder::setFaculty);

        lecturerRepository.save(zonder);
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
        Optional<Student> us = studentRepository.findByUserUsername("kamil");
        Optional<Student> us2 = studentRepository.findByUserUsername("michal");
        Optional<FieldOfStudy> fos = fieldOfStudyRepository.findByName("Wildlife");
        Optional<FieldOfStudy> fos2 = fieldOfStudyRepository.findByName("Computer Science");
        if(!us.isPresent() || !fos.isPresent() || !us2.isPresent() || !fos2.isPresent())
                return;

        Student kamil = us.get();
        FieldOfStudy wild = fos.get();
        Student michal = us2.get();
        FieldOfStudy cs = fos2.get();

        Course c1 = new Course("Aspekty ekonomiczno-prawne w informatyce", 30, 0, 2, false);
        c1.setSemester(2);
        c1.setFieldOfStudy(wild);

        courseRepository.save(c1);
        courseStudentRepository.save(new CourseStudent(c1, kamil));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(wild, kamil));

        Course c2 = new Course("Geologia podstawowa", 30, 30, 3, false);
        c2.setSemester(1);
        c2.setFieldOfStudy(wild);

        courseRepository.save(c2);
        courseStudentRepository.save(new CourseStudent(c2, kamil));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(wild, kamil));

        Course c3 = new Course("Programowanie proceduralne", 30, 30, 3, false);
        c3.setSemester(3);
        c3.setFieldOfStudy(wild);

        courseRepository.save(c3);
        courseStudentRepository.save(new CourseStudent(c3, kamil));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(wild, kamil));


        Course c4 = new Course("Blockchain", 150, 0, 2, false);
        c4.setSemester(2);
        c4.setFieldOfStudy(cs);

        courseRepository.save(c4);
        courseStudentRepository.save(new CourseStudent(c4, michal));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(cs, michal));

        Course c5 = new Course("Co on na tym może mieć", 150, 0, 2, false);
        c5.setSemester(2);
        c5.setFieldOfStudy(cs);

        courseRepository.save(c5);
        courseStudentRepository.save(new CourseStudent(c5, michal));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(cs, michal));

        Course c6 = new Course("Podstawy lakierowania amelinium", 150, 0, 2, false);
        c6.setSemester(2);
        c6.setFieldOfStudy(cs);

        courseRepository.save(c6);
        courseStudentRepository.save(new CourseStudent(c6, michal));
        fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(cs, michal));


        /*Course ecoCourse = new Course("Ecological space and sustainable development",
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

        Course c1 = new Course("Aspekty ekonomiczno-prawne w informatyce", 30, 0, 2, false);
        c1.setSemester(2);

        courseRepository.save(c1);


        .ifPresent(k -> courseStudentRepository.save(new CourseStudent(c1, k)));*/

    }

    public void run(ApplicationArguments args) {
        createFaculties();

        createAdmin();
        createStudent();
        createClerk();
        createLecturer();

        createFieldOfStudy();
        createCourses();
    }
}