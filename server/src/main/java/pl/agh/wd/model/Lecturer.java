package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

/**
 * Important note!
 * Lecturer has only foreign key (user_id)
 * If you want to create new Lecturer you can not provide existing user!
 * save() method works ONLY for the transient object (not saved in the database)
 *
 * @author howkymike
 * @author bakoo
 */
@JsonIgnoreProperties({"courses"})
@Entity
@Table(name = "lecturer")
@Getter
@Setter
@NoArgsConstructor
public class Lecturer {

    @Id
    private Long id;

    @OneToOne(fetch= FetchType.LAZY) // performance
    @MapsId
    private User user;

    @Column(name="title")
    private String title;

    @ManyToMany(mappedBy = "courseLecturers")  // This should get us a many-to-many through a Lecturer weak entity that has a User PKEY id as user_id.
    private List<Course> courses;

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=true)
    private Faculty faculty;

    public Lecturer(User user, String title) {
        this.user = user;
        this.title = title;
    }

}