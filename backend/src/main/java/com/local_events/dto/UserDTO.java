package com.local_events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String userName;
    private String email;
    private String phoneNumber;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role;
    private String district;
    private LocalDate createdAt;
    private LocalDate recentActivity;
    private String avatarUrl;
    private LocalDate birthDate;
    private Long eventsVisitedCount;
    private Long eventsCreatedCount;
    private Long activeDaysCount ;
    private Long reviewsWrittenCount;
}
