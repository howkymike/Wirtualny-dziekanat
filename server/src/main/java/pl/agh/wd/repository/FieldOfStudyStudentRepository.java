package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.FieldOfStudyStudentKey;
import pl.agh.wd.model.FieldOfStudyStudent;

import java.util.List;
import java.util.Optional;

@Repository
public interface FieldOfStudyStudentRepository extends JpaRepository<FieldOfStudyStudent, FieldOfStudyStudentKey> {
    Optional<FieldOfStudyStudent> findFieldOfStudyStudentByStudentUserName(String name);
    List<FieldOfStudyStudent> findAllByStudentId(long studentID);
}
