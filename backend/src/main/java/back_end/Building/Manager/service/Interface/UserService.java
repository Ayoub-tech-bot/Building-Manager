package back_end.Building.Manager.service.Interface;

import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    Optional<User> findById(UUID id);
    List<User> findByRole(Role role);
    List<User> findAll();
    boolean deleteById(UUID id);
    User createUser(User user);
    Optional<User> updateUser(UUID id, User user);
}
