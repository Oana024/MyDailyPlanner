package com.example.MyDailyPlanner.SharedTask;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedTaskRepository extends JpaRepository<SharedTask, Integer> {
    Optional<List<SharedTask>> getSharedTasksBySendToAndStatus(int sendTo, String status);
}
