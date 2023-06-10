package com.example.MyDailyPlanner.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<List<Task>> findTaskByUserId(int id);

    Optional<List<Task>> findTaskByUserIdAndDate(int id, LocalDate date);

    @Query("SELECT DISTINCT t.tag FROM Task t WHERE t.userId = ?1")
    List<String> findDistinctTagsByUser(int id);

}
