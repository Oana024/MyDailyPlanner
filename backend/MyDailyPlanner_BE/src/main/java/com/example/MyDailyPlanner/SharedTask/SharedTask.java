package com.example.MyDailyPlanner.SharedTask;

import com.example.MyDailyPlanner.Friendship.Friendship;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sharedtask_db")
public class SharedTask {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;
    private String title;
    private String description;
    private LocalDate date;
    private String status;
    private String priority;
    private String tag;
    private int sendTo;

    public SharedTask(SharedTaskRequest sharedTaskRequest){
        this.title = sharedTaskRequest.getTitle();
        this.description = sharedTaskRequest.getDescription();
        this.date = sharedTaskRequest.getDate();
        this.status = sharedTaskRequest.getStatus();
        this.priority = sharedTaskRequest.getPriority();
        this.tag = sharedTaskRequest.getTag();
        this.sendTo = sharedTaskRequest.getSendTo();
    }

    @ManyToOne
    @JoinColumn(name = "friendshipId")
    private Friendship friendship;
}
