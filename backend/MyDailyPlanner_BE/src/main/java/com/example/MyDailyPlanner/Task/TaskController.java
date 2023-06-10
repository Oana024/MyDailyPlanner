package com.example.MyDailyPlanner.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(path = "/api/task")
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@RequestBody Task task){
        return taskService.createTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks(){
        return taskService.getAll();
    }

    @GetMapping(path = "{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable("id") int id){
        Task task = taskService.getById(id);

        if(task == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(task);
    }

    @GetMapping(path = "/user/{id}/date={date}")
    public ResponseEntity<List<Task>> getTasksOfUserByDate(@PathVariable("id") int id, @PathVariable("date")LocalDate date){
        List<Task> taskList = taskService.getByDateForUser(id, date);
        if(taskList == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(taskList);
    }

    @GetMapping(path = "/user={id}/tags")
    public ResponseEntity<List<String>> getUserTags(@PathVariable("id") int id){
        List<String> tags = taskService.getTags(id);
        return ResponseEntity.ok(tags);
    }

    @GetMapping(path = "/user/{id}")
    public ResponseEntity<List<Task>> getAllTasksOfUser(@PathVariable("id") int id) {
        List<Task> taskList = taskService.getAllForUser(id);

        if(taskList == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(taskList);
    }

    @DeleteMapping(path = "{id}")
    public ResponseEntity<Task> deleteById(@PathVariable("id") int id){
        Task task = taskService.deleteById(id);
        if(task == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(task);
    }

    @PutMapping(path = "/{id}/status={status}")
    public ResponseEntity<Task> updateStatus(@PathVariable("id") int id, @PathVariable("status") String status) {
        Task task = taskService.update(id, status);
        if(task == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(task);
    }
}
