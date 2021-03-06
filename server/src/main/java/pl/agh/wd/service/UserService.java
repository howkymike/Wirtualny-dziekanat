package pl.agh.wd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.UpdateClerkRequest;
import pl.agh.wd.payload.request.UpdateLecturerRequest;
import pl.agh.wd.payload.request.UpdateStudentRequest;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.repository.*;

import javax.validation.constraints.NotNull;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public User getUserById(Long id){
        return userRepository.findById(id).orElse(null);
    }
    public Optional<Student> getStudentById(Long id){
        return studentRepository.findById(id);
    }

    public Optional<Clerk>  getClerkById(Long id){
        return clerkRepository.findById(id);
    }

    public Optional<Lecturer>  getLecturerById(Long id){
        return lecturerRepository.findById(id);
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

        Set<Role> newRoles = updateRoles(user, request);

        user.setRoles(newRoles);
        userRepository.save(user);
    }

    public void createUser(@NotNull User user, @NotNull UpdateUserRequest request) {
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setPostalCode(request.getPostalCode());
        user.setTelephone(request.getTelephone());
        user.setAddress(request.getAddress());

        Set<Role> newRoles = updateRoles(user, request);

        user.setRoles(newRoles);
        userRepository.save(user);
    }

    public void deleteUser(@NotNull User user){
        for (Role role : user.getRoles()) {
            switch (role.getName()){
                case ROLE_STUDENT:
                    studentRepository.deleteById(user.getId());
                    break;
                case ROLE_LECTURER:
                    lecturerRepository.deleteById(user.getId());
                    break;
                case ROLE_CLERK:
                    clerkRepository.deleteById(user.getId());
                    break;
            }
        }

        userRepository.deleteById(user.getId());
    }
    
    public Iterable<Student> getStudentList() {
        return studentRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Iterable<Clerk> getClerkList() {
        return clerkRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Iterable<Lecturer> getLecturerList() {
        return lecturerRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    private Set<Role> updateRoles(@NotNull User user, @NotNull UpdateUserRequest request) {
        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles != null) {
            strRoles.forEach(role -> {
                switch (role) {
                    case "ROLE_ADMIN":
                        Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "ROLE_LECTURER":
                        Role modRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        UpdateLecturerRequest lecturerData = request.getLecturer();
                        updateLecturer(user, lecturerData);

                        break;
                    case "ROLE_CLERK":
                        Role adminClerk = roleRepository.findByName(RoleEnum.ROLE_CLERK)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminClerk);

                        UpdateClerkRequest clerkData = request.getClerk();
                        updateClerk(user, clerkData);

                        break;
                    case "ROLE_STUDENT":
                        Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);

                        UpdateStudentRequest studentData = request.getStudent();
                        updateStudent(user, studentData);

                        break;
                    default:
                        throw new RuntimeException("Error: Role is not found.");
                }
            });
        }
        else {
            throw new RuntimeException("Error: No roles defined in request.");
        }

        deleteEmptyRoles(user, strRoles);

        return roles;
    }

    private void deleteEmptyRoles(@NotNull User user, Set<String> strRoles) {
        user.getRoles().forEach(role -> {
            switch(role.getName()) {
                case ROLE_LECTURER:
                    if(!strRoles.contains("ROLE_LECTURER")) {
                        Optional <Lecturer> optionalLecturer = lecturerRepository.findById(user.getId());
                        if(optionalLecturer.isPresent())
                            lecturerRepository.deleteById(user.getId());
                    }
                    break;
                case ROLE_CLERK:
                    if(!strRoles.contains("ROLE_CLERK")) {
                        Optional <Clerk> optionalClerk = clerkRepository.findById(user.getId());
                        if(optionalClerk.isPresent())
                            clerkRepository.deleteById(user.getId());
                    }
                    break;
                case ROLE_STUDENT:
                    if(!strRoles.contains("ROLE_STUDENT")) {
                        Optional <Student> optionalStudent = studentRepository.findById(user.getId());
                        if(optionalStudent.isPresent())
                            studentRepository.deleteById(user.getId());
                    }
                    break;
                default:
                    break;
            }
        });
    }

    private void updateLecturer(@NotNull User user, @NotNull UpdateLecturerRequest request) {
        Optional<Lecturer> existingLecturer = lecturerRepository.findById(user.getId());
        Lecturer lecturer;

        if(existingLecturer.isEmpty()) {
            lecturer = new Lecturer(user, "PhD");
        }
        else {
            lecturer = existingLecturer.get();
        }

        lecturer.setTitle(request.getTitle());

        Optional<Faculty> facultyLecturer = facultyRepository
                .findById(request.getFacultyId());

        if(facultyLecturer.isPresent()) {
            lecturer.setFaculty(facultyLecturer.get());
        }
        else {
            throw new RuntimeException("Error: Faculty is not found.");
        }
        lecturerRepository.save(lecturer);
    }

    private void updateClerk(@NotNull User user, @NotNull UpdateClerkRequest request) {
        Optional<Clerk> existingClerk = clerkRepository.findById(user.getId());
        Clerk clerk;

        if(existingClerk.isEmpty()) {
            clerk = new Clerk(user);
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
            student = new Student(user, (int)request.getIndex(), "in??ynierskie", 2018, 9, 1);
        }
        else {
            student = existingStudent.get();
            student.setIndex((int)request.getIndex());
        }
        studentRepository.save(student);
    }

    public Optional<User> findByUsername(String username) { return userRepository.findByUsername(username); }


}
