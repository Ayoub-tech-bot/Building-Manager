package back_end.Building.Manager.repository;

import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserReppsitory extends JpaRepository<User, UUID> {
    List<User> findByRole(Role role);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
