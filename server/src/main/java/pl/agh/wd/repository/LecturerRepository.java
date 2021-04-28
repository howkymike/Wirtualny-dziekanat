package pl.agh.wd.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Lecturer;

import java.util.Optional;

@Repository
public interface LecturerRepository extends CrudRepository<Lecturer, Long> {
    Optional<Lecturer> findByUserUsername(String username);
}