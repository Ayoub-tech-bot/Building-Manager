package back_end.Building.Manager.service.Impl;

import back_end.Building.Manager.repository.UserReppsitory;
import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;
import back_end.Building.Manager.service.Interface.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final UserReppsitory userReppsitory;
    public UserServiceImpl(UserReppsitory userReppsitory) {
        this.userReppsitory = userReppsitory;
    }

    @Override
    @Transactional
    public Optional<User> findById(UUID id) {
        return userReppsitory.findById(id);
    }

    @Override
    @Transactional
    public List<User> findByRole(Role role) {
        return userReppsitory.findByRole(role);
    }

    @Override
    public List<User> findAll() {
        return userReppsitory.findAll();
    }

    @Override
    @Transactional
    public boolean deleteById(UUID id) {
        if(!userReppsitory.existsById(id)) {
            return false;
        }
        userReppsitory.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (user.getEmail() != null && userReppsitory.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email is already in use: " + user.getEmail());
        }
        if (user.getRole() == null) {
            user.setRole(Role.Owner);
        }
        return userReppsitory.save(user);
    }

    @Override
    @Transactional
    public Optional<User> updateUser(UUID id, User updatedUser) {
        if (updatedUser == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return userReppsitory.findById(id).map(exist -> {
            if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().equalsIgnoreCase(exist.getEmail()) &&
                userReppsitory.existsByEmail(updatedUser.getEmail())) {
                throw new IllegalArgumentException("Email is already in use: " + updatedUser.getEmail());
            }

            exist.setEmail(updatedUser.getEmail());
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                exist.setPassword(updatedUser.getPassword());
            }
            if (updatedUser.getRole() != null) {
                exist.setRole(updatedUser.getRole());
            }
            exist.setPhoneNumber(updatedUser.getPhoneNumber());
            exist.setUsername(updatedUser.getUsername());
            return userReppsitory.save(exist);
        });
    }
}
