package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "field_of_study")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"courses"})
public class FieldOfStudy {
    @Id
    @GeneratedValue
    private long id;

    @NotBlank
    private String name;

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=false)
    private Faculty faculty;

    @OneToMany(mappedBy="fieldOfStudy")
    private Set<Course> courses;

    @OneToMany(mappedBy = "fieldOfStudy")
    @NotFound(action = NotFoundAction.IGNORE)
    private Set<FieldOfStudyStudent> courseStudents = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "fieldOfStudy_students",
            joinColumns = @JoinColumn(name = "fieldOfStudy_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<Course> currentStudents;

    public FieldOfStudy(String name) {
        this.name = name;
    }
}