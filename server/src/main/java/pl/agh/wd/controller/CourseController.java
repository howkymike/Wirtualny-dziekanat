package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.val;
import pl.agh.wd.model.*;
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
    FieldOfStudyStudentRepository fieldOfStudyStudentRepository;

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

        List<Course> list = courseStudentRepository.findAllByStudentId(currentUser.getId())
        .stream().map(CourseStudent::getCourse).collect(Collectors.toList());

        list.forEach(value -> {
            Set<CourseStudent> cs = value.getCourseStudents();

            cs.removeIf(val -> val.getStudent().getId() != currentUser.getId());

            value.setCourseStudents(cs);
        });

        return list;
    }

    // TODO: for now it just recreate the course, maybe it's alright maybe it's not
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    Course replaceCourse(@RequestBody Course newCourse, @PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setName(newCourse.getName());
                    course.setCourseLecturers(newCourse.getCourseLecturers());
                    course.setCourseStudents(newCourse.getCourseStudents());
                    course.setEcts(newCourse.getEcts());
                    course.setExam(newCourse.isExam());
                    course.setLaboratory_time(newCourse.getLaboratory_time());
                    course.setLecture_time(newCourse.getLecture_time());
                    course.setSemester(newCourse.getSemester());
                    //course.setFieldOfStudy(newCourse.getFieldOfStudy());
                    return courseRepository.save(course);
                })
                .orElseGet(() -> {
                    newCourse.setId(id);
                    return courseRepository.save(newCourse);
                });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) {
        courseRepository.deleteById(id);

        return ResponseEntity.ok(new SuccessResponse(true, "Course deleted"));
    }


    @PostMapping
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest){
        Course newCourse = new Course(courseRequest.getName(),
                courseRequest.getLecture_time(),
                courseRequest.getLaboratory_time(),
                courseRequest.getEcts(),
                courseRequest.isExam());
            
            newCourse.setSemester(courseRequest.getSemester());
            
        if(courseRequest.getFieldOfStudyId() != 0)
            fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId()).ifPresent(newCourse::setFieldOfStudy);
        

        if(courseRequest.getCourseStudentIds() != null) {
            for(Long courseStudentId : courseRequest.getCourseStudentIds())
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(newCourse, s);
                    courseStudentRepository.save(courseStudent);

                    Optional<FieldOfStudy> fieldOfStudy = fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId());
                    if(fieldOfStudy.isPresent()) {
                        FieldOfStudyStudent fieldOfStudyStudent = new FieldOfStudyStudent(fieldOfStudy.get(), s);
                        fieldOfStudyStudentRepository.save(fieldOfStudyStudent);
                    }
                });
        }

        if(courseRequest.getCourseLecturerIds() != null) {
            Set<Lecturer> lecturers = new HashSet<>();
            for(Long courseLecturerId : courseRequest.getCourseLecturerIds())
                lecturerRepository.findById(courseLecturerId).ifPresent(lecturers::add);
            newCourse.setCourseLecturers(lecturers);
        }

        editLecturers(courseRequest, newCourse);

        Course savedCourse =  courseRepository.save(newCourse);

        return ResponseEntity.ok(new SuccessResponse(true, "Course created"));
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> editCourse(@RequestBody CourseRequest courseRequest, @PathVariable Long id) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Dany kurs nie istnieje elo"));
        }

        Course course = optionalCourse.get();

        course.setName(courseRequest.getName());
        course.setEcts(courseRequest.getEcts());
        course.setLecture_time(courseRequest.getLecture_time());
        course.setSemester(courseRequest.getSemester());

        editLecturers(courseRequest, course);
        editCourseStudents(courseRequest, course);

        course.setLaboratory_time(courseRequest.getLaboratory_time());
        course.setExam(courseRequest.isExam());
        if (courseRequest.getFieldOfStudyId() != 0)
            fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId()).ifPresent(course::setFieldOfStudy);
        courseRepository.save(course);
        return ResponseEntity.ok(new SuccessResponse(true, "Course changed"));
    }

    @PostMapping("/{courseId}/{studentId}/confirmGrade")
    public ResponseEntity<?> confirmGrade(@PathVariable Long courseId, @PathVariable Long studentId){

        CourseStudentKey key = new CourseStudentKey(courseId, studentId);
        Optional<CourseStudent> course = courseStudentRepository.findById(key);

        if(course.isEmpty()) {
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Course not found."));
        }

        CourseStudent courseStudent = course.get();

        if(courseStudent.getFinalGrade() > 0){
            if(!courseStudent.isGradeAccepted()){
                courseStudent.setGradeAccepted(true);
                courseStudentRepository.save(courseStudent);
            }
            return ResponseEntity.ok(new SuccessResponse(true,"Grade accepted."));
        }else{
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Cannot accept grade."));
        }
    }

    private void editLecturers(CourseRequest request, Course course) {
        if (request.getCourseLecturerIds() != null) {
            Set<Lecturer> lecturers = new HashSet<>();
            for (Long courseLecturerId : request.getCourseLecturerIds())
                lecturerRepository.findById(courseLecturerId).ifPresent(lecturers::add);
            course.setCourseLecturers(lecturers);
        }
    }

    private void editCourseStudents(CourseRequest request, Course course) {
        if (course.getCourseStudents() != null) {
            for (CourseStudent courseStudent : course.getCourseStudents()) {
                courseStudentRepository.deleteById(courseStudent.getId());
            }
        }

        if (request.getCourseStudentIds() != null) {
            for (Long courseStudentId : request.getCourseStudentIds())
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(course, s);
                    courseStudentRepository.save(courseStudent);

                    Optional<FieldOfStudy> fieldOfStudy = fieldOfStudyRepository.findById(request.getFieldOfStudyId());
                    if(fieldOfStudy.isPresent()) {
                        FieldOfStudyStudent fieldOfStudyStudent = new FieldOfStudyStudent(fieldOfStudy.get(), s);
                        fieldOfStudyStudentRepository.save(fieldOfStudyStudent);
                    }
                });
        }
    }

}
