package com.smartinventory.service.impl;

import com.smartinventory.domain.dto.UserDTO;
import com.smartinventory.domain.entity.User;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.mapper.UserMapper;
import com.smartinventory.repository.UserRepository;
import com.smartinventory.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // Validate password is provided for new users
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required for new users");
        }
        
        User user = userMapper.toEntity(userDTO);
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Update fields
        if (userDTO.getFirstName() != null) {
            existingUser.setFirstName(userDTO.getFirstName());
        }
        if (userDTO.getLastName() != null) {
            existingUser.setLastName(userDTO.getLastName());
        }
        if (userDTO.getEmail() != null) {
            existingUser.setEmail(userDTO.getEmail());
        }
        if (userDTO.getActive() != null) {
            existingUser.setActive(userDTO.getActive());
        }
        if (userDTO.getRole() != null) {
            existingUser.setRole(userDTO.getRole());
        }
        
        // Update password only if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return userMapper.toDTO(user);
    }
}
