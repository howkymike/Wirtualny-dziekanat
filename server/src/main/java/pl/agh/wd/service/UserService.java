package pl.agh.wd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.UpdateClerkRequest;
import pl.agh.wd.payload.request.UpdateLecturerRequest;
import pl.agh.wd.payload.request.UpdateStudentRequest;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.repository.*;

import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public User getUserById(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public void updateUser(@NotNull User user, @NotNull UpdateUserRequest request) {
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setPostalCode(request.getPostalCode());
        user.setTelephone(request.getTelephone());
        user.setAddress(request.getAddress());

        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "lecturer":
                        Role modRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        UpdateLecturerRequest lecturerData = request.getLecturerData();
                        updateLecturer(user, lecturerData);

                        break;
                    case "stuff":
                        Role adminStuff = roleRepository.findByName(RoleEnum.ROLE_STUFF)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminStuff);

                        UpdateClerkRequest stuffData = request.getStuffData();
                        updateStuff(user, stuffData);

                        break;
                    case "student":
                        Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);

                        UpdateStudentRequest studentData = request.getStudentData();
                        updateStudent(user, studentData);

                        break;
                    default:
                        throw new RuntimeException("Error: Role is not found.");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
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

    private void updateLecturer(@NotNull User user, @NotNull UpdateLecturerRequest request) {
        Optional<Professor> existingProfessor = professorRepository.findById(user.getId());
        Professor professor;

        if(existingProfessor.isEmpty()) {
            professor = new Professor();
            professor.setOwner(user);
        }
        else {
            professor = existingProfessor.get();
        }

        professor.setTitle(request.getTitle());

        Optional<Faculty> facultyProfessor = facultyRepository
                .findById(request.getFacultyId());

        if(facultyProfessor.isPresent()) {
            professor.setFaculty(facultyProfessor.get());
        }
        else {
            throw new RuntimeException("Error: Faculty is not found.");
        }
        professorRepository.save(professor);
    }

    private void updateStuff(@NotNull User user, @NotNull UpdateClerkRequest request) {
        Optional<Clerk> existingClerk = clerkRepository.findById(user.getId());
        Clerk clerk;

        if(existingClerk.isEmpty()) {
            clerk = new Clerk();
            clerk.setOwner(user);
        }
        else {
            clerk = existingClerk.get();
        }

        Optional<Faculty> facultyClerk = facultyRepository
                .findById(request.getFacultyId());

        if(facultyClerk.isPresent()) {
            clerk.setFaculty(facultyClerk.get());
        }
        else {
            throw new RuntimeException("Error: Faculty is not found.");
        }
        clerkRepository.save(clerk);
    }

    private void updateStudent(@NotNull User user, @NotNull UpdateStudentRequest request) {
        Optional<Student> existingStudent = studentRepository.findById(user.getId());
        Student student;
        if(existingStudent.isEmpty()) {
            student = new Student();
            student.setUser_id(user.getId());
            student.setOwner(user);
        }
        else {
            student = existingStudent.get();
        }
        student.setIndex((int)request.getIndex());
        studentRepository.save(student);
    }
}
