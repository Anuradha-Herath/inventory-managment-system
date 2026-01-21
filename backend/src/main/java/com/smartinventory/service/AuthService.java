package com.smartinventory.service;

import com.smartinventory.domain.dto.JwtResponse;
import com.smartinventory.domain.dto.LoginRequest;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
}
