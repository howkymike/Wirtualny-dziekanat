package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.GradeReport;
import pl.agh.wd.model.Student;

@Getter
@Setter
public class ReportResponse {
    private GradeReport report;
    private String courseName;
    private Student student;

    public ReportResponse(GradeReport report){
        this.report = report;
        this.courseName = report.getCourseStudent().getCourse().getName();
        this.student = report.getCourseStudent().getStudent();
    }
}
