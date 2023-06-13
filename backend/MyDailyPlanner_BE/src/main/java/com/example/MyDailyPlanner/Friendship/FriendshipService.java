package com.example.MyDailyPlanner.Friendship;

import com.example.MyDailyPlanner.Task.Task;
import com.example.MyDailyPlanner.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    @Autowired
    public FriendshipService(FriendshipRepository friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }

    public List<Friendship> getAll(){
        return friendshipRepository.findAll();
    }

    public Friendship getById(int id){
        Optional<Friendship> friendship = friendshipRepository.findById(id);

        return friendship.orElse(null);
    }

    public List<Friendship> getUserFriendships(int id){
        return friendshipRepository.findAllFriends(id);
    }

    public Friendship addFriendship(Friendship friendship){
        return friendshipRepository.save(friendship);
    }

    public Friendship existsFriendship(User user1, User user2) {
        Optional<Friendship> friendship = friendshipRepository.areFriends(user1, user2);
        return friendship.orElse(null);
    }

    public List<Friendship> getFriendshipRequests(User user) {
        return friendshipRepository.findPendingFriendshipsBySecondUser(user);
    }

    @Transactional
    public Friendship acceptRequest(int id){
        Optional<Friendship> friendship = friendshipRepository.findById(id);

        if(friendship.isEmpty()){
            return null;
        }

        Friendship acceptedFriendship = friendship.get();
        acceptedFriendship.setStatus("accepted");
        return acceptedFriendship;
    }

    public void removeById(int id){
        friendshipRepository.deleteById(id);
    }
}
