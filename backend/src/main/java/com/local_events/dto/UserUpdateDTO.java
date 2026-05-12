package com.local_events.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String userName;
    private String email;
    private String phoneNumber;
    private String district;
}