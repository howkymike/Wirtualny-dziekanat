package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.Objects;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class FieldOfStudyStudentKey implements Serializable {
    @Column(name = "field_fo_study_id")
    Long fieldOfStudyId;

    @Column(name = "student_id")
    Long studentId;

    public FieldOfStudyStudentKey(Long fieldOfStudyId, Long studentId) {
        this.fieldOfStudyId = fieldOfStudyId;
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if (!(o instanceof FieldOfStudyStudentKey)) return false;
        FieldOfStudyStudentKey that = (FieldOfStudyStudentKey) o;
        return Objects.equals(getFieldOfStudyId(), that.getFieldOfStudyId()) &&
                Objects.equals(getStudentId(), that.getStudentId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getStudentId(), getFieldOfStudyId());
    }
}
