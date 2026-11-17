package back_end.Building.Manager.ws.controller;

import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.enums.Role;
import back_end.Building.Manager.service.Interface.UserService;
import back_end.Building.Manager.ws.dto.UserDto;
import back_end.Building.Manager.ws.mapper.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> findAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(userMapper.toDtos(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findUserById(@PathVariable UUID id) {
        return userService.findById(id)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDto>> findByRole(@PathVariable Role role) {
        List<User> users = userService.findByRole(role);
        return ResponseEntity.ok(userMapper.toDtos(users));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@jakarta.validation.Valid @RequestBody UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        User savedUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDto(savedUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id, @jakarta.validation.Valid @RequestBody UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        return userService.updateUser(id, user)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        if (!userService.deleteById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
