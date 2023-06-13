package com.example.MyDailyPlanner.Friendship;

import com.example.MyDailyPlanner.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT f FROM Friendship f WHERE f.firstUser.id = :userId OR f.secondUser.id = :userId")
    List<Friendship> findAllFriends(@Param("userId") int userId);

    @Query("SELECT f FROM Friendship f WHERE " +
            "f.status = 'accepted' AND" +
            "(f.firstUser = :user1 AND f.secondUser = :user2) OR " +
            "(f.firstUser = :user2 AND f.secondUser = :user1)")
    Optional<Friendship> areFriends(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT f FROM Friendship f WHERE f.secondUser = :user AND f.status = 'pending'")
    List<Friendship> findPendingFriendshipsBySecondUser(@Param("user") User user);
}
