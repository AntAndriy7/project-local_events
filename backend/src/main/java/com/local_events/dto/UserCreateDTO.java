package com.local_events.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserCreateDTO {
    private String userName;
    private String email;
    private String password;
    private String phoneNumber;
    private LocalDate birthDate;
}