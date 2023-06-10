package com.example.MyDailyPlanner.Note;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/note")
public class NoteController {
    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getNotes(){
        return noteService.getNotes();
    }

    @GetMapping(path = "/user/{userId}")
    public List<Note> getUserNotes(@PathVariable("userId")int userId){
        return noteService.getUserNotes(userId);
    }

    @GetMapping(path = "{noteId}")
    public Note getNoteById(@PathVariable("noteId") int id){
        return noteService.getNoteById(id);
    }

    @PostMapping
    public Note createNote(@RequestBody Note note){
        //System.out.println(note);
        return noteService.createNote(note);
    }

    @DeleteMapping(path = "{noteId}")
    public void deleteNote(@PathVariable("noteId") int id) {
        noteService.deleteNote(id);
    }

    @PutMapping(path = "{noteId}")
    public void updateNote(@PathVariable("noteId") int id,
                           @RequestBody Note newNote) {
        System.out.println("title" + newNote.getTitle());
        System.out.println(newNote.getContent());
        noteService.updateNote(id, newNote.getTitle(), newNote.getContent());
    }
}
