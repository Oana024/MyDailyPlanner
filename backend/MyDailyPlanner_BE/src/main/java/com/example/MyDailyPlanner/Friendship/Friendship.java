package com.example.MyDailyPlanner.Friendship;

import com.example.MyDailyPlanner.SharedTask.SharedTask;
import com.example.MyDailyPlanner.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="friendship_db")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    private String status;

    @ManyToOne
    @JoinColumn(name = "firstUserId")
    private User firstUser;

    @ManyToOne
    @JoinColumn(name = "secondUserId")
    private User secondUser;

    @OneToMany(mappedBy = "friendship", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SharedTask> sharedTaskList;
}
