package com.example.MyDailyPlanner.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers(){
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping(path = "{userEmail}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable("userEmail") String email){
        User user =  userService.getUserByEmail(email);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        else{
            UserResponse response = new UserResponse(user.getId(), user.getFirstname(), user.getLastname());
            return ResponseEntity.ok(response);
        }
    }

}
