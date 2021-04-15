package pl.agh.wd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.agh.wd.model.Role;
import pl.agh.wd.model.RoleEnum;
import pl.agh.wd.model.Student;
import pl.agh.wd.model.User;
import pl.agh.wd.repository.RoleRepository;
import pl.agh.wd.repository.StudentRepository;
import pl.agh.wd.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
        user.setRoles(roles);
        user.setIsNew(false);
        userRepository.save(user);

        Student student = new Student();
        student.setOwner(user);
        
    }


    private void createClerk() {
        Set<Role> roles = new HashSet<>();
        Role clerkRole = roleRepository.findByName(RoleEnum.ROLE_STUFF)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(clerkRole);
        User user = new User("baba",
                "wirtualnt2@gmail.com",
                encoder.encode("baba"));
        user.setName("Baba");
        user.setSurname("Z dziekanatu");
        user.setRoles(roles);
        user.setIsNew(false);
        userRepository.save(user);
    }

    private void createProfessor() {
        Set<Role> roles = new HashSet<>();
        Role professorRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                .orElseThrow(() -> new RuntimeException("Error: Clerk Role is not found."));
        roles.add(professorRole);
        User user = new User("onder",
                "wirt21ualnt2@gmail.com",
                encoder.encode("onder"));
        user.setName("Zdzisław");
        user.setSurname("Onderka");
        user.setRoles(roles);
        user.setIsNew(false);
        userRepository.save(user);
    }


    public void run(ApplicationArguments args) {
        createAdmin();
        createStudent();
        createClerk();
        createProfessor();
    }
}