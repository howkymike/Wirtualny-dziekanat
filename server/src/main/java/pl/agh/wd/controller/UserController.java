package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.payload.response.ListResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.*;
import pl.agh.wd.service.UserService;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{type}")
    public ResponseEntity<?> index(@PathVariable("type") String type) {

        switch(type) {
            case "student":
                return ResponseEntity.ok(new ListResponse(type, userService.getStudentList()));
            
            case "clerk":
                return ResponseEntity.ok(new ListResponse(type, userService.getClerkList()));

            case "professor":
                return ResponseEntity.ok(new ListResponse(type, userService.getProfessorList()));

        }

        return ResponseEntity.ok(new SuccessResponse(false, "DDD"));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> putUser(@RequestBody UpdateUserRequest request, @PathVariable Long userId) {
        User user = userService.getUserById(request.getId());

        if(user == null) {
            return  ResponseEntity.badRequest().body(new MessageResponse("User id is invalid."));
        }

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

                        Optional<Professor> existingProfessor = professorRepository.findById(userId);
                        Professor professor;

                        if(existingProfessor.isEmpty()) {
                            professor = new Professor();
                            professor.setOwner(user);
                        }
                        else {
                            professor = existingProfessor.get();
                        }

                        professor.setTitle(request.getLecturerData().getTitle());

                        Optional<Faculty> facultyProfessor = facultyRepository
                                .findById(request.getLecturerData().getFacultyId());

                        if(facultyProfessor.isPresent()) {
                            professor.setFaculty(facultyProfessor.get());
                        }
                        else {
                            throw new RuntimeException("Error: Faculty is not found.");
                        }
                        professorRepository.save(professor);

                        break;
                    case "stuff":
                        Role adminStuff = roleRepository.findByName(RoleEnum.ROLE_STUFF)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminStuff);

                        Optional<Clerk> existingClerk = clerkRepository.findById(userId);
                        Clerk clerk;

                        if(existingClerk.isEmpty()) {
                            clerk = new Clerk();
                            clerk.setOwner(user);
                        }
                        else {
                            clerk = existingClerk.get();
                        }

                        Optional<Faculty> facultyClerk = facultyRepository
                                .findById(request.getLecturerData().getFacultyId());

                        if(facultyClerk.isPresent()) {
                            clerk.setFaculty(facultyClerk.get());
                        }
                        else {
                            throw new RuntimeException("Error: Faculty is not found.");
                        }
                        clerkRepository.save(clerk);

                        break;
                    case "student":
                        Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);

                        Optional<Student> existingStudent = studentRepository.findById(userId);
                        Student student;
                        if(existingStudent.isEmpty()) {
                            student = new Student();
                            student.setUser_id(user.getId());
                            student.setOwner(user);
                        }
                        else {
                            student = existingStudent.get();
                        }
                        student.setIndex((int)request.getStudentData().getIndex());
                        studentRepository.save(student);

                        break;
                    default:
                        throw new RuntimeException("Error: Role is not found.");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User updated."));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId){
        User user = userService.getUserById(userId);

        if(user == null){
            return  ResponseEntity.badRequest().body(new MessageResponse("User id is invalid."));
        }else{
            userService.deleteUser(user);
            return ResponseEntity.ok(new MessageResponse("User deleted."));
        }
    }
}
