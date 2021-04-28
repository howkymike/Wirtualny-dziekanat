package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name="faculty")
@Getter
@Setter
@NoArgsConstructor
public class Faculty {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="name")
    protected String name;

    public Faculty(String name) {
        this.name = name;
    }


}