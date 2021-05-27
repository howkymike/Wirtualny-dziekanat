package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.agh.wd.model.FieldOfStudy;
import pl.agh.wd.model.FieldOfStudyStudent;
import pl.agh.wd.model.Student;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.response.CourseOfStudiesResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.FieldOfStudyRepository;
import pl.agh.wd.repository.FieldOfStudyStudentRepository;
import pl.agh.wd.repository.StudentRepository;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.service.UserDetailsImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    FieldOfStudyStudentRepository fieldOfStudyStudentRepository;

    @Autowired
    FieldOfStudyRepository fieldOfStudyRepository;

    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    @GetMapping("/students")
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    @GetMapping("/course-of-studies")
    public ResponseEntity<?> getCourseOfStudies(Authentication authentication) {

        UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();
        long id = currentUser.getId();

        Optional<User> optionalUser = userRepository.findById(id);
        if(optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Dany użytkownik nie istnieje"));
        }

        User user = optionalUser.get();

        Optional<Student> optionalStudent = studentRepository.findById(id);
        if(optionalStudent.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Dany użytkownik nie jest studentem"));
        }

        Student student = optionalStudent.get();

        List<FieldOfStudyStudent> fieldStudentList = fieldOfStudyStudentRepository.findAllByStudentId(id);
        Set<FieldOfStudy>  fieldOfStudies = new HashSet<>();

        for(FieldOfStudyStudent fieldStudent : fieldStudentList) {
            Optional<FieldOfStudy> fieldOfStudy = fieldOfStudyRepository.findById(fieldStudent.getFieldOfStudy().getId());
            fieldOfStudy.ifPresent(fieldOfStudies::add);
        }

        return ResponseEntity.ok(new CourseOfStudiesResponse(user, student, fieldOfStudies));
    }

    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    @PostMapping("/{id}/promote")
    public ResponseEntity<?> promote(@PathVariable Long id){
        Optional<Student> student = studentRepository.findById(id);
        if(student.isEmpty()) {
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Student not found."));
        }

        student.get().setSemester(student.get().getSemester() + 1);
        studentRepository.save(student.get());

        return ResponseEntity.ok(new SuccessResponse(true,"Student promoted."));
    }
}
