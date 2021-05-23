package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.CourseStudent;
import pl.agh.wd.model.CourseStudentKey;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, CourseStudentKey> {
    Optional<CourseStudent> findCourseStudentByStudentUserName(String name);
    List<CourseStudent> findAllByStudentId(long studentID);
    List<CourseStudent> findAllByCourseId(long courseID);

    @Modifying
    @Query("update CourseStudent c set c.gradeAccepted = true where c.finalGradeDate < ?1 and c.finalGrade > 0")
    void confirmAllOlderThan(Date date);
}
