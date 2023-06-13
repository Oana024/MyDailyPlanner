package com.example.MyDailyPlanner.Friendship;

import com.example.MyDailyPlanner.User.User;
import com.example.MyDailyPlanner.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/friendship")
public class FriendshipController {
    private final FriendshipService friendshipService;
    private final UserService userService;

    @Autowired
    public FriendshipController(FriendshipService friendshipService, UserService userService) {
        this.friendshipService = friendshipService;
        this.userService = userService;
    }

    @GetMapping
    public List<Friendship> getAllFriendships() {
        return friendshipService.getAll();
    }

    @GetMapping(path = "user/{id}")
    public ResponseEntity<List<Friendship>> getUserFriendships(@PathVariable("id") int id) {
        List<Friendship> friendships = friendshipService.getUserFriendships(id);
        if (friendships == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(friendships);
    }

    @GetMapping(path = "check")
    public ResponseEntity<?> existsFriendship(@RequestParam("user1Id") int id1, @RequestParam("user2Id") int id2) {
        User user1 = userService.getById(id1);
        if (user1 == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + id1 + " does not exist.");
        }

        User user2 = userService.getById(id2);
        if (user2 == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + id2 + " does not exist.");
        }

        Friendship friendship = friendshipService.existsFriendship(user1, user2);
        if (friendship == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Friendship does not exist.");
        }

        return ResponseEntity.ok(friendship);
    }

    @GetMapping(path = "requests/{id}")
    public ResponseEntity<?> getFriendshipRequests(@PathVariable int id) {
        User user = userService.getById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + id + " does not exist.");
        }

        return ResponseEntity.ok(friendshipService.getFriendshipRequests(user));
    }

    @PostMapping
    public ResponseEntity<?> addFriendship(@RequestBody FriendshipRequest friendshipRequest) {
        System.out.println(friendshipRequest);

        User firstUser = userService.getById(friendshipRequest.getFirstUserId());
        User secondUser = userService.getById(friendshipRequest.getSecondUserId());

        if (firstUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + friendshipRequest.getFirstUserId() + " does not exist.");
        }
        if (secondUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id " + friendshipRequest.getSecondUserId() + " does not exist.");
        }

        Friendship checkFriendship = friendshipService.existsFriendship(firstUser, secondUser);

        if (checkFriendship != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Friendship already exists.");
        }

        Friendship friendship = new Friendship();
        friendship.setFirstUser(firstUser);
        friendship.setSecondUser(secondUser);
        friendship.setStatus(friendshipRequest.getStatus());

        return ResponseEntity.ok(friendshipService.addFriendship(friendship));
    }

    @PutMapping(path = "{id}/accept")
    public  ResponseEntity<?> acceptRequest(@PathVariable("id") int id){
        Friendship friendship = friendshipService.acceptRequest(id);

        if(friendship == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Friendship with id " + id + " does not exist.");
        }

        return ResponseEntity.ok(friendship);
    }

    @DeleteMapping(path = "{id}")
    public ResponseEntity<String> removeFriendship(@PathVariable int id){
        Friendship friendship = friendshipService.getById(id);

        if(friendship == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Friendship with id " + id + " does not exist.");
        }

        friendshipService.removeById(id);
        return ResponseEntity.ok("Removed successfully");
    }

}
