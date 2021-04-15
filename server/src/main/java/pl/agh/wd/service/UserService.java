package pl.agh.wd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pl.agh.wd.model.*;
import pl.agh.wd.repository.ClerkRepository;
import pl.agh.wd.repository.ProfessorRepository;
import pl.agh.wd.repository.StudentRepository;
import pl.agh.wd.repository.UserRepository;

import javax.validation.constraints.NotNull;

@Service
public class UserService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUser(@NotNull User user){
        for (Role role : user.getRoles()) {
            switch (role.getName()){
                case ROLE_STUDENT:
                    studentRepository.deleteById(user.getId());
                    break;
                case ROLE_LECTURER:
                    professorRepository.deleteById(user.getId());
                    break;
                case ROLE_STUFF:
                    clerkRepository.deleteById(user.getId());
                    break;
            }
        }

        userRepository.deleteById(user.getId());
    }
    
    public Iterable<Student> getStudentList() {
        return studentRepository.findAll();
    }

    public Iterable<Clerk> getClerkList() {
        return clerkRepository.findAll();
    }

    public Iterable<Professor> getProfessorList() {
        return professorRepository.findAll();
    }
}
