package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "fields_of_study")
@Getter
@Setter
@NoArgsConstructor
public class FieldOfStudy {
    @Id
    @GeneratedValue
    private long fieldOfStudy_id;

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=false)
    private Faculty faculty;

    @OneToMany(mappedBy="fieldOfStudy")
    private Set<Course> courses;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "fieldOfStudy_students",
            joinColumns = @JoinColumn(name = "fieldOfStudy_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<Course> currentStudents;
}