package com.example.MyDailyPlanner.SharedTask;

import com.example.MyDailyPlanner.Friendship.Friendship;
import com.example.MyDailyPlanner.Friendship.FriendshipService;
import com.example.MyDailyPlanner.Task.Task;
import com.example.MyDailyPlanner.User.User;
import com.example.MyDailyPlanner.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/sharedTask")
public class SharedTaskController {
    private final SharedTaskService service;
    private final FriendshipService friendshipService;
    private final UserService userService;

    @Autowired
    public SharedTaskController(SharedTaskService service, FriendshipService friendshipService, UserService userService) {
        this.service = service;
        this.friendshipService = friendshipService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<SharedTask>> getAllSharedTasks() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping(path = "pending/user={id}")
    public ResponseEntity<?> getPendingTasksForUser(@PathVariable("id") int id){
        User user = userService.getById(id);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + id + " does not exist.");
        }

        List<SharedTask> tasks = service.getPendingTasksForUser(id);

        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<SharedTask> addSharedTask(@RequestBody SharedTaskRequest sharedTaskRequest){
        System.out.println(sharedTaskRequest);
        SharedTask sharedTask = new SharedTask(sharedTaskRequest);
        Friendship friendship = friendshipService.getById(sharedTaskRequest.getFriendshipId());
        if(friendship == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        sharedTask.setFriendship(friendship);
        return ResponseEntity.ok(service.addTask(sharedTask));
    }

    @PostMapping(path="{id}")
    public ResponseEntity<?> acceptInvitation(@PathVariable("id") int id){
        boolean isSuccessful = service.acceptRequest(id);

        if(isSuccessful){
            return ResponseEntity.ok("Ok");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
    }

    @DeleteMapping(path = "{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") int id){
        SharedTask task = service.deleteById(id);
        if(task == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with id " + id + " does not exist.");
        }
        return ResponseEntity.ok(task);
    }
}
