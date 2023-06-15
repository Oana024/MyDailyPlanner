package com.example.MyDailyPlanner.Task;

public class Stat {
    int total;
    int completed;

    public Stat() {
    }

    public Stat(int total, int completed) {
        this.total = total;
        this.completed = completed;
    }

    public int getTotal() {
        return total;
    }

    public int getCompleted() {
        return completed;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }
}
