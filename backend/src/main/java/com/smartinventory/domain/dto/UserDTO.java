package com.smartinventory.domain.dto;

import com.smartinventory.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password; // Optional - only used for create/update, never returned in responses
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
