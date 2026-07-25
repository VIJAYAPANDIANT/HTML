package com.intellisphere.server.modules.auth.dto;

import com.intellisphere.server.modules.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
