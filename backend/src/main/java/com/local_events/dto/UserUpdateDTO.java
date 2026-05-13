package com.local_events.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDTO {
    private String userName;
    private String email;
    private LocalDate birthDate;
    private String district;
}