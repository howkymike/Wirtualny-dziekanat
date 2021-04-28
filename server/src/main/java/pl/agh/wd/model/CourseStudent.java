package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

/**
 * Relationship class between Course and the Student
 * 2x ManyToOne instead on ManyToMany in the parent classes because relationship need additional parameters (i.e. finalGrade)
 *
 * @author howkymike
 */
@JsonIgnoreProperties({"course", "student"})
@Getter
@Setter
@NoArgsConstructor
@Entity
public class CourseStudent {

    @EmbeddedId
    CourseStudentKey id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    Course course;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    Student student;

    boolean hasPassed;

    private double finalGrade;

    public CourseStudent(Course course, Student student) {
        this.id = new CourseStudentKey(course.getId(), student.getId());
        this.course = course;
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if (!(o instanceof CourseStudent)) return false;
        CourseStudent that = (CourseStudent) o;
        return Objects.equals(course.getId(), that.course.getId()) &&
                Objects.equals(student.getId(), that.student.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(course.getId(), student.getId());
    }
}
