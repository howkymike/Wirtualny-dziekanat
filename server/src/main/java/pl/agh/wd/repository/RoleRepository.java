package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.Role;
import pl.agh.wd.model.RoleEnum;

import java.util.List;
import java.util.Optional;

/**
 * Basic repository for Role
 *
 * @author howkymike
 */

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleEnum name);
}
