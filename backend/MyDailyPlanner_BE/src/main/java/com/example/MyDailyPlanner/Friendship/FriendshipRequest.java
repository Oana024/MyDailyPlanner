package com.example.MyDailyPlanner.Friendship;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendshipRequest {
    private Integer firstUserId;
    private Integer secondUserId;
    private String status;
}
