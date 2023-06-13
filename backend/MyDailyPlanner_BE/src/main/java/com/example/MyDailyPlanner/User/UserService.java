package com.example.MyDailyPlanner.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getUserByEmail(String email){
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public User getById(int id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }
}
