package back_end.Building.Manager.ws.mapper;

import back_end.Building.Manager.entity.User;
import back_end.Building.Manager.ws.dto.UserDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class UserMapper {

    public User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        return user;
    }

    public UserDto toDto(User entity) {
        if (entity == null) {
            return null;
        }
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(entity, userDto);
        userDto.setPassword(null);
        return userDto;
    }

    public List<UserDto> toDtos(List<User> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(this::toDto).toList();
    }

    public List<User> toEntities(List<UserDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        return dtos.stream().map(this::toEntity).toList();
    }
}
