package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.GradeReport;

@Repository
public interface GradeReportRepository extends JpaRepository<GradeReport,Long> {


}
