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

        Optional<Friendship> friendship = friendshipRepository.findById(sharedTask.get().getFriendship().getId());

        sharedTask.get().setStatus("accepted");

        if(friendship.isEmpty()){
            return false;
        }

        int user1Id = friendship.get().getFirstUser().getId();
        int user2Id = friendship.get().getSecondUser().getId();

        Task task1 = new Task();
        task1.setUserId(user1Id);
        task1.setTitle(sharedTask.get().getTitle());
        task1.setDescription(sharedTask.get().getDescription());
        task1.setDate(sharedTask.get().getDate());
        task1.setStatus("waiting");
        task1.setPriority(sharedTask.get().getPriority());

        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setUserId(user2Id);
        task2.setTitle(sharedTask.get().getTitle());
        task2.setDescription(sharedTask.get().getDescription());
        task2.setDate(sharedTask.get().getDate());
        task2.setStatus("waiting");
        task2.setPriority(sharedTask.get().getPriority());


        taskRepository.save(task2);

        return true;
    }

}
