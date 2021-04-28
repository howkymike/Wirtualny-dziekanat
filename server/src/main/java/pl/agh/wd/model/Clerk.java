package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * same note as in the Lecturer.java
 *
 * @author howkymike
 * @author bakoo
 */
@Entity
@Table(name = "clerk")
@Getter
@Setter
@NoArgsConstructor
public class Clerk {

    @Id
    private Long id;

    @OneToOne(fetch= FetchType.LAZY)
    @MapsId
    protected User user;

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=true)
    private Faculty faculty;

    public Clerk(User user) {
        this.user = user;
    }
}