package com.example.MyDailyPlanner.SharedTask;

import com.example.MyDailyPlanner.Friendship.Friendship;
import com.example.MyDailyPlanner.Friendship.FriendshipRepository;
import com.example.MyDailyPlanner.Task.Task;
import com.example.MyDailyPlanner.Task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SharedTaskService {
    private final SharedTaskRepository repository;
    private final FriendshipRepository friendshipRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public SharedTaskService(SharedTaskRepository repository,
                             FriendshipRepository friendshipRepository,
                             TaskRepository taskRepository) {
        this.repository = repository;
        this.friendshipRepository = friendshipRepository;
        this.taskRepository = taskRepository;
    }

    public List<SharedTask> getAll() {
        return repository.findAll();
    }

    public List<SharedTask> getPendingTasksForUser(int sendTo) {
        Optional<List<SharedTask>> tasks = repository.getSharedTasksBySendToAndStatus(sendTo, "pending");

        return tasks.orElse(null);
    }

    public SharedTask addTask(SharedTask task) {
        return repository.save(task);
    }

    public SharedTask deleteById(int id) {
        Optional<SharedTask> task = repository.findById(id);
        if(task.isEmpty()) {
            //throw new IllegalStateException("task with id " + id + " does not exists");
            return null;
        }
        repository.deleteById(id);
        return task.get();
    }

    public boolean acceptRequest(int id){
        Optional<SharedTask> sharedTask = repository.findById(id);
        if(sharedTask.isEmpty()){
            return false;
        }

        sharedTask.get().setStatus("accepted");

        Optional<Friendship> friendship = friendshipRepository.findById(sharedTask.get().getFriendship().getId());

        if(friendship.isEmpty()){
            return false;
        }

        int user1Id = friendship.get().getFirstUser().getId();
        int user2Id = friendship.get().getSecondUser().getId();

        Task task = new Task();
        task.setUserId(user1Id);
        task.setTitle(sharedTask.get().getTitle());
        task.setDescription(sharedTask.get().getDescription());
        task.setDate(sharedTask.get().getDate());
        task.setStatus("waiting");
        task.setPriority(sharedTask.get().getPriority());

        taskRepository.save(task);
        task.setUserId(user2Id);
        taskRepository.save(task);

        return true;
    }

}
