package pl.agh.wd.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Professor;

@Repository
public interface ProfessorRepository extends CrudRepository<Professor, Long> {
    
}