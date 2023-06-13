package com.example.MyDailyPlanner.SharedTask;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SharedTaskRequest {
    private Integer friendshipId;
    private String title;
    private String description;
    private LocalDate date;
    private String status;
    private String priority;
    private String tag;
    private int sendTo;
}
