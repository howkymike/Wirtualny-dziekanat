package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "clerks")
@Getter
@Setter
@NoArgsConstructor
public class Clerk {
    @Id
    @Column(name="user_id")
    private long user_id;

    @OneToOne(cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn(name="user_id", referencedColumnName="id")
    protected User owner;

    public void setOwner(User owner)
    {
        this.owner = owner;
        this.user_id = owner.getId();
    }

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=false)
    private Faculty faculty;
}