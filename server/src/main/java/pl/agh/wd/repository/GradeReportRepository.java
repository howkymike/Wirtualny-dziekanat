package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.GradeReport;

import java.util.List;

@Repository
public interface GradeReportRepository extends JpaRepository<GradeReport,Long> {
    List<GradeReport> getAllByLecturerId(Long id);

    @Modifying
    @Query("update GradeReport r set r.isRead = ?2 where r.id = ?1")
    int setIsReadFor(Long id, boolean isRead);
}
