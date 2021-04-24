package pl.agh.wd.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Faculty;

@Repository
public interface FacultyRepository extends CrudRepository<Faculty, Long> {

}