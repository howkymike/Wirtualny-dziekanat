package pl.agh.wd.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@JsonIgnoreProperties({"fieldOfStudy", "student"})
@Getter
@Setter
@NoArgsConstructor
@Entity
public class FieldOfStudyStudent {

    @EmbeddedId
    FieldOfStudyStudentKey id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("fieldOfStudyId")
    @JoinColumn(name = "field_of_study_id")
    FieldOfStudy fieldOfStudy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    Student student;

    public FieldOfStudyStudent(FieldOfStudy fieldOfStudy, Student student) {
        this.id = new FieldOfStudyStudentKey(fieldOfStudy.getId(), student.getId());
        this.fieldOfStudy = fieldOfStudy;
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if (!(o instanceof FieldOfStudyStudent)) return false;
        FieldOfStudyStudent that = (FieldOfStudyStudent) o;
        return Objects.equals(fieldOfStudy.getId(), that.fieldOfStudy.getId()) &&
                Objects.equals(student.getId(), that.student.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(fieldOfStudy.getId(), student.getId());
    }
}
