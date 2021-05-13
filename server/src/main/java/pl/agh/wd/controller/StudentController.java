package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.wd.model.Student;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.response.CourseOfStudiesResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.repository.StudentRepository;
import pl.agh.wd.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @PreAuthorize("hasRole('ROLE_STUDENT') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}/course-of-studies")
    public ResponseEntity<?> getCourseOfStudies(@PathVariable("id") Long id) {

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

        return ResponseEntity.badRequest().body(new CourseOfStudiesResponse(user, student));
    }
}
