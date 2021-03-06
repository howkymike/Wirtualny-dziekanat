package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.CourseRequest;
import pl.agh.wd.payload.request.GradeList;
import pl.agh.wd.payload.request.SetGradeRequest;
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
    UserRepository userRepository;

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
        return courseRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping("/{id}")
    public Course getCourse(@PathVariable("id") Long id){
        Optional<Course> optional = courseRepository.findById(id);

        if(optional.isPresent()) {

            Course course = optional.get();
            return course;
        }


        return courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(id.toString()));
    }

    @GetMapping("/my/{type}")
    public List<Course> getMyCourses(Authentication authentication, @PathVariable("type") String type){
        UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();

        List<Course> list = Collections.emptyList();

        if(type.equals("student")) {
            list = courseStudentRepository.findAllByStudentId(currentUser.getId())
                    .stream().map(CourseStudent::getCourse).collect(Collectors.toList());

            list.forEach(value -> {
                Set<CourseStudent> cs = value.getCourseStudents();

                cs.removeIf(val -> !val.getStudent().getId().equals(currentUser.getId()));

                value.setCourseStudents(cs);
            });
        }
        else if(type.equals("lecturer")) {
            Optional<Lecturer> lecturer = lecturerRepository.findById(currentUser.getId());
            if(lecturer.isPresent()) {
                list = new ArrayList<>(lecturer.get().getCourses());
            }
        }

        return list;
    }

    @GetMapping("/{id}/students")
    public List<Student> getCourseStudents(@PathVariable("id") Long id){
        return courseStudentRepository.findAllByCourseId(id)
                .stream().map(CourseStudent::getStudent).collect(Collectors.toList());
    }

    @GetMapping("/{id}/lecturers")
    public Set<Lecturer> getCourseLecturers(@PathVariable("id") Long id){
        Set<Lecturer> lecturers = new HashSet<>();
        Optional<Course> course = courseRepository.findById(id);
        if(course.isPresent()) {
            lecturers = course.get().getCourseLecturers();
        }

        return lecturers;
    }

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
        courseRepository.findById(id).ifPresent(course -> {
            course.getCourseLecturers().forEach(lecturer -> {
                lecturer.getCourses().remove(course);
                lecturerRepository.save(lecturer);
            });
            courseRepository.deleteById(id);
        });
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

        if(courseRequest.getCourseLecturerIds() != null) {
            Set<Lecturer> lecturers = new HashSet<>();
            for(Long courseLecturerId : courseRequest.getCourseLecturerIds())
                lecturerRepository.findById(courseLecturerId).ifPresent(lecturers::add);
            newCourse.setCourseLecturers(lecturers);
        }

        if(courseRequest.getFieldOfStudyId() != 0) {
            Optional<FieldOfStudy> optionalFieldOfStudy = fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId());
            if(optionalFieldOfStudy.isPresent())
                newCourse.setFieldOfStudy(optionalFieldOfStudy.get());
            else
                return ResponseEntity.ok(new SuccessResponse(false, "Field of study not found!"));
        }

        Course savedCourse =  courseRepository.save(newCourse);

        if(courseRequest.getCourseStudentIds() != null) {
            Set<Student> courseStudents = new HashSet<>();
            for(Long courseStudentId : courseRequest.getCourseStudentIds()) {
                studentRepository.findById(courseStudentId).ifPresent(s -> {
                    CourseStudent courseStudent = new CourseStudent(newCourse, s);
                    courseStudentRepository.save(courseStudent);
                    courseStudents.add(s);
                });
            }

            // implicitly assign students to fieldOfStudy only if there are not already signed (why?)
            if(courseRequest.getFieldOfStudyId() != 0) {
                fieldOfStudyRepository.findById(courseRequest.getFieldOfStudyId()).ifPresent(fieldOfStudy -> {
                    courseStudents.forEach(student -> {
                        if(fieldOfStudyStudentRepository.findById(new FieldOfStudyStudentKey(fieldOfStudy.getId(), student.getId())).isEmpty())
                            fieldOfStudyStudentRepository.save(new FieldOfStudyStudent(fieldOfStudy, student));
                    });
                });
            }
        }

        return ResponseEntity.ok(new SuccessResponse(true, "Course created (" + savedCourse.getId() + ")"));
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasRole('ROLE_CLERK') or hasRole('ROLE_LECTURER') or hasRole('ROLE_ADMIN')")
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
        // co?? tu nie dzia??a
        System.out.println(courseStudent.getFinalGrade());
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

    @PutMapping("/grade")
    public ResponseEntity<?> setGrade(@RequestBody SetGradeRequest request) {

        Optional<Course> opcourse = courseRepository.findById(request.getId());

        if(!opcourse.isPresent()) 
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Course not found."));

        Course course = opcourse.get();

        Set<CourseStudent> students = course.getCourseStudents();

        students.forEach(value -> {
            GradeList fromRequest = new GradeList();

            for(GradeList gl : request.getGrades()) {
                if(gl.getStudentId() == value.getId().getStudentId()) 
                    fromRequest = gl;
            }

            if(
                !(fromRequest.getLaboratoryGrade() < 2 || fromRequest.getLaboratoryGrade() > 5 || fromRequest.getLaboratoryGrade() % 0.5 != 0) &&
                !(fromRequest.getExamGrade() < 2 || fromRequest.getExamGrade() > 5 || fromRequest.getExamGrade() % 0.5 != 0) &&
                !(fromRequest.getFinalGrade() < 2 || fromRequest.getFinalGrade() > 5 || fromRequest.getFinalGrade() % 0.5 != 0)
            ) {
                value.setLaboratoryGrade(fromRequest.getLaboratoryGrade());
                value.setExamGrade(fromRequest.getExamGrade());
                value.setFinalGrade(fromRequest.getFinalGrade());
            }
        });

        course.setCourseStudents(students);

        courseRepository.save(course);

        return ResponseEntity.ok(new SuccessResponse(true, "Grade set"));

        /*CourseStudentKey key = new CourseStudentKey(request.getCourseId(), request.getCourseId());
        Optional<CourseStudent> courseStudentOptional = courseStudentRepository.findById(key);

        if(courseStudentOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Course not found."));
        }

        CourseStudent courseStudent = courseStudentOptional.get();
        Course course = courseStudent.getCourse();

        switch(request.getType()) {
            case "final":
                courseStudent.setFinalGrade(request.getGrade());
                break;
            case "exam":
                if(!course.isExam()) 
                    courseStudent.setExamGrade(request.getGrade());
                else
                    return ResponseEntity.badRequest().body(new SuccessResponse(false, "Could not set exam grade"));
                break;
            case "laboratory":
                courseStudent.setLaboratoryGrade(request.getGrade());
                break;
            default:
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Wrong type"));
        }

        courseStudentRepository.save(courseStudent);
        

        return ResponseEntity.ok(new SuccessResponse(true, "Grade set"));*/
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
        Set<Long> courseStudentIds = request.getCourseStudentIds();
        if (course.getCourseStudents() != null) {
            for (CourseStudent courseStudent : course.getCourseStudents()) {
                if(courseStudentIds.contains(courseStudent.getId().getStudentId())){
                    courseStudentIds.remove(courseStudent.getId().getStudentId());
                }else{
                    courseStudentRepository.deleteById(courseStudent.getId());
                }
            }
        }

        if (request.getCourseStudentIds() != null) {
            for (Long courseStudentId : courseStudentIds)
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
