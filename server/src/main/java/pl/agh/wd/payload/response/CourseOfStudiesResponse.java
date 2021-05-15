package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.FieldOfStudy;
import pl.agh.wd.model.Student;
import pl.agh.wd.model.User;

import javax.validation.constraints.NotBlank;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class CourseOfStudiesResponse {

    @NotBlank
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @NotBlank
    private int index;

    @NotBlank
    private String levelOfStudies;

    private Set<FieldOfStudyResponse> fieldsOfStudies;

    private String commencmentOfStudies;

    public CourseOfStudiesResponse(User user, Student student, Set<FieldOfStudy> fieldOfStudies) {
        this.id = user.getId();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.index = student.getIndex();

        this.fieldsOfStudies = new HashSet<>();
        for(FieldOfStudy field : fieldOfStudies) {

            this.fieldsOfStudies.add(new FieldOfStudyResponse(field));
        }

        this.levelOfStudies = student.getLevelOfStudies();
        this.commencmentOfStudies = getStrDate(student.getCommencmentOfStudies());
    }

    String getStrDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        String year = "" + calendar.get(Calendar.YEAR);

        int monthNum= calendar.get(Calendar.MONTH) + 1;
        String month;
        if(monthNum < 10) {
            month = "0" + monthNum;
        } else {
            month = "" + monthNum;
        }

        int dayNum = calendar.get(Calendar.DAY_OF_MONTH);
        String day;
        if(dayNum < 10) {
            day = "0" + dayNum;
        } else {
            day = "" + dayNum;
        }

        return year + "-" + month + "-" + day;
    }
}
