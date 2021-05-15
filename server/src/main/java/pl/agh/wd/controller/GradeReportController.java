package pl.agh.wd.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.agh.wd.model.CourseStudent;
import pl.agh.wd.model.CourseStudentKey;
import pl.agh.wd.model.GradeReport;
import pl.agh.wd.payload.request.CreateGradeReportRequest;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.CourseStudentRepository;
import pl.agh.wd.repository.GradeReportRepository;
import pl.agh.wd.service.UserDetailsImpl;

import java.util.Optional;

@RestController
@RequestMapping("/api/gradeReports")
public class GradeReportController {

    @Autowired
    CourseStudentRepository courseStudentRepository;

    @Autowired
    GradeReportRepository gradeReportRepository;

    @PostMapping("/{courseId}")
    public ResponseEntity<?> createNewReport(
            @PathVariable Long courseId, @RequestBody CreateGradeReportRequest request, Authentication authentication){
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        CourseStudentKey key = new CourseStudentKey(courseId, user.getId());
        Optional<CourseStudent> student = courseStudentRepository.findById(key);
        if(student.isEmpty()){
            return  ResponseEntity.badRequest().body(new SuccessResponse(false, "Course not exist."));
        }

        GradeReport report = new GradeReport();

        report.setMessage(request.getMessage());
        report.setCourseStudent(student.get());
        gradeReportRepository.save(report);

        return ResponseEntity.ok(new SuccessResponse(true, "Report sent."));
    }
}
