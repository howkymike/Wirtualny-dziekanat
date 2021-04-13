package pl.agh.wd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.agh.wd.model.Role;
import pl.agh.wd.model.RoleEnum;
import pl.agh.wd.model.User;
import pl.agh.wd.repository.RoleRepository;
import pl.agh.wd.repository.UserRepository;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
        user.setRoles(roles);
        user.setIsNew(false);
        userRepository.save(user);
    }

    public void run(ApplicationArguments args) {
        createAdmin();
    }
}