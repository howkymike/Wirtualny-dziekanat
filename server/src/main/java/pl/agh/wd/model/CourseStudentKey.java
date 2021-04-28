package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Embedded key for the CourseStudent model,
 * it gives the ability to use existing pair of keys in the CourseStudent (not to create another key)
 *
 * @author howkymike
 */
@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class CourseStudentKey implements Serializable {
    @Column(name = "course_id")
    Long courseId;

    @Column(name = "student_id")
    Long studentId;

    public CourseStudentKey(Long courseId, Long studentId) {
        this.courseId = courseId;
        this.studentId = studentId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if (!(o instanceof CourseStudentKey)) return false;
        CourseStudentKey that = (CourseStudentKey) o;
        return Objects.equals(getCourseId(), that.getCourseId()) &&
                Objects.equals(getStudentId(), that.getStudentId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getStudentId(), getCourseId());
    }
}
