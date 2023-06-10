package com.example.MyDailyPlanner.Task;

import com.example.MyDailyPlanner.Note.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository repository;

    @Autowired
    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task createTask(Task task){
        return repository.save(task);
    }

    public List<Task> getAll() {
        return repository.findAll();
    }

    public Task getById(int id) {
        Optional<Task> task = repository.findById(id);
        return task.orElse(null);
    }

    public List<Task> getByDateForUser(int userId, LocalDate date) {
        Optional<List<Task>> tasks = repository.findTaskByUserIdAndDate(userId, date);

        return tasks.orElse(null);
    }

    public List<Task> getAllForUser(int id){
        Optional<List<Task>> tasks = repository.findTaskByUserId(id);
        return tasks.orElse(null);
    }

    public Task deleteById(int id) {
        Optional<Task> task = repository.findById(id);
        if(task.isEmpty()) {
            //throw new IllegalStateException("task with id " + id + " does not exists");
            return null;
        }
        repository.deleteById(id);
        return task.get();
    }

    public List<String> getTags(int id){
        List<String> tags = repository.findDistinctTagsByUser(id);
        tags = tags.stream().filter(Objects::nonNull)
                .collect(Collectors.toList());
        return tags;
    }

    @Transactional
    public Task update(int id, String status) {
        Optional<Task> task = repository.findById(id);

        if(task.isEmpty()){
            return null;
        }

        Task updatedTask = task.get();
        updatedTask.setStatus(status);
        return updatedTask;
    }
}