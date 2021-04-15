package pl.agh.wd.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Student;

@Repository
public interface StudentRepository extends CrudRepository<Student, Long> {
    
}
