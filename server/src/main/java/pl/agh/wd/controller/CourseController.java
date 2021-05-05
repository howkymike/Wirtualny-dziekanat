package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import pl.agh.wd.model.Course;
import pl.agh.wd.model.CourseStudent;
import pl.agh.wd.model.Lecturer;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.CourseRequest;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.*;
import pl.agh.wd.service.UserDetailsImpl;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CourseStudentRepository courseStudentRepository;

    @Autowired
    LecturerRepository lecturerRepository;

    @Value("dziekanat.app.frontendUrl")
    String host;

    @GetMapping
    public List<Course> getCourses(){
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Course getCourse(@PathVariable("id") Long id){
        return courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(id.toString()));
    }

    @GetMapping("/my")
    public List<Course> getMyCourses(Authentication authentication){
        UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();
        return courseStudentRepository.findAllByStudentId(currentUser.getId())
                .stream().map(CourseStudent::getCourse).collect(Collectors.toList());
    }

    // TODO: for now it just recreate the course, maybe it's alright maybe it's not
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    Course replaceCourse(@RequestBody Course newCourse, @PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setName(newCourse.getName());
                    course.setCourseLecturers(newCourse.getCourseLecturers());
                    course.setEcts(newCourse.getEcts());
                    course.setExam(newCourse.isExam());
                    course.setLaboratory_time(newCourse.getLaboratory_time());
                    course.setLecture_time(newCourse.getLecture_time());
                    //course.setFieldOfStudy(newCourse.getFieldOfStudy());
                    return courseRepository.save(course);
                })
                .orElseGet(() -> {
                    newCourse.setId(id);
                    return courseRepository.save(newCourse);
                });
    }

    @DeleteMapping("/{id}")
    void deleteCourse(@PathVariable("id") Long id) {
        courseRepository.deleteById(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest){
        Course newCourse = new Course(courseRequest.getName(),
                courseRequest.getLecture_time(),
                courseRequest.getLaboratory_time(),
                courseRequest.getEcts(),
                courseRequest.isExam());
        Course savedCourse =  courseRepository.save(newCourse);

        if(courseRequest.getCourseStudentIds() != null) {
            for(Long courseStudentId : courseRequest.getCourseStudentIds())
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(savedCourse, s);
                    courseStudentRepository.save(courseStudent);
                });
        }

        if(courseRequest.getCourseLecturerIds() != null) {
            Set<Lecturer> lecturers = new HashSet<>();
            for(Long courseLecturerId : courseRequest.getCourseLecturerIds())
                lecturerRepository.findById(courseLecturerId).ifPresent(lecturers::add);
            savedCourse.setCourseLecturers(lecturers);
        }

        if(courseRequest.getFieldOfStudyId() != 0)
            fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId()).ifPresent(savedCourse::setFieldOfStudy);

        if(courseRequest.getCourseStudentIds() != null) {
            for(Long courseStudentId : courseRequest.getCourseStudentIds())
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(savedCourse, s);
                    courseStudentRepository.save(courseStudent);
                });
        }

        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(host);
        UriComponents uriComponents =  uriComponentsBuilder.path("/api/courses/{id}").buildAndExpand(savedCourse.getId());
        var location = uriComponents.toUri();
        return ResponseEntity.created(location).build();
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> editCourse(@RequestBody CourseRequest courseRequest) {
        Optional<Course> course = courseRepository.findByName(courseRequest.getName());
        if (course.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Dany kurs nie istnieje elo"));
        }
        course.get().setEcts(courseRequest.getEcts());
        course.get().setLecture_time(courseRequest.getLecture_time());
        if (courseRequest.getCourseLecturerIds() != null) {
            Set<Lecturer> lecturers = new HashSet<>();
            for (Long courseLecturerId : courseRequest.getCourseLecturerIds())
                lecturerRepository.findById(courseLecturerId).ifPresent(lecturers::add);
            course.get().setCourseLecturers(lecturers);
        }

        if (course.get().getCourseStudents() != null) {
            for (CourseStudent courseStudent : course.get().getCourseStudents()) {
                courseStudentRepository.deleteById(courseStudent.getId());
            }
        }

        if (courseRequest.getCourseStudentIds() != null) {
            for (Long courseStudentId : courseRequest.getCourseStudentIds())
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(course.get(), s);
                    courseStudentRepository.save(courseStudent);
                });
        }

        course.get().setLaboratory_time(courseRequest.getLaboratory_time());
        course.get().setExam(courseRequest.isExam());
        if (courseRequest.getFieldOfStudyId() != 0)
            fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId()).ifPresent(course.get()::setFieldOfStudy);
        courseRepository.save(course.get());
        return ResponseEntity.ok(new SuccessResponse(true, "Course changed"));
    }

}
