package pl.agh.wd.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.CreateGradeReportRequest;
import pl.agh.wd.payload.response.ReportResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.CourseRepository;
import pl.agh.wd.repository.CourseStudentRepository;
import pl.agh.wd.repository.GradeReportRepository;
import pl.agh.wd.repository.LecturerRepository;
import pl.agh.wd.service.UserDetailsImpl;

import javax.transaction.Transactional;
import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/gradeReports")
public class GradeReportController {

    @Autowired
    CourseStudentRepository courseStudentRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    LecturerRepository lecturerRepository;

    @Autowired
    GradeReportRepository gradeReportRepository;

    @GetMapping()
    public ResponseEntity<?> getReports(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        List<GradeReport> reports = gradeReportRepository.getAllByLecturerId(user.getId());

        List<ReportResponse> reportResponses = new ArrayList<>();
        for ( GradeReport report : reports) {
            reportResponses.add(new ReportResponse(report));
        }

        return ResponseEntity.ok(reportResponses);
    }

    @PutMapping("/{id}/read")
    @Transactional
    public ResponseEntity<?> setReadReport(@PathVariable Long id) {
        if (gradeReportRepository.setIsReadFor(id, true) > 0) {
            return ResponseEntity.ok(new SuccessResponse(true, "success xdd"));
        } else {
            return ResponseEntity.ok(new SuccessResponse(false, "errr"));
        }
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<?> createNewReport(
            @PathVariable Long courseId, @RequestBody CreateGradeReportRequest request, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        CourseStudentKey key = new CourseStudentKey(courseId, user.getId());
        Optional<CourseStudent> student = courseStudentRepository.findById(key);
        if (student.isEmpty()) {
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Course not exist."));
        }

        Optional<Lecturer> lecturer = lecturerRepository.findById(request.getLecturerId());

        if (lecturer.isEmpty()) {
            return ResponseEntity.badRequest().body(new SuccessResponse(false, "Lecturer not exist."));
        }

        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isPresent()) {
            Set<Lecturer> lecturers = course.get().getCourseLecturers();
            if (!lecturers.contains(lecturer.get())) {
                return ResponseEntity.badRequest().body(new SuccessResponse(false, "Invalid Lecturer."));
            }
        }

        GradeReport report = new GradeReport();

        report.setMessage(request.getMessage());
        report.setCourseStudent(student.get());
        report.setLecturerId(request.getLecturerId());
        report.setSendDate(Date.from(Instant.now()));
        gradeReportRepository.save(report);

        return ResponseEntity.ok(new SuccessResponse(true, "Report sent."));
    }
}
