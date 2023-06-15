package com.example.MyDailyPlanner.Note;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class NoteService {
    private final NoteRepository repository;

    @Autowired
    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    public Note getNoteById(int id){
        boolean exists = repository.existsById(id);
        if(!exists) {
            throw new IllegalStateException("note with id " + id + " does not exists");
        }
        return repository.findById(id).get();
    }

    public List<Note> getUserNotes(int userId) {
        Optional<List<Note>> notes = repository.findNoteByUserIdOrderById(userId);
        return notes.orElse(null);
    }

    public List<Note> getNotes(){
        return repository.findAll();
    }

    public Note createNote(Note note){
        return repository.save(note);
    }

    public void deleteNote(int noteId) {
        boolean exists = repository.existsById(noteId);
        if(!exists) {
            throw new IllegalStateException("note with id " + noteId + " does not exists");
        }
        repository.deleteById(noteId);
    }

    @Transactional
    public void updateNote(int id, String title, String content) {
        Note note = repository.findById(id).orElseThrow(() ->
                new IllegalStateException("note with id " + id + " does not exist") );
        if(title != null && title.length() > 0 && !Objects.equals(note.getTitle(), title)) {
            note.setTitle(title);
        }

        if(content != null && content.length() > 0 && !Objects.equals(note.getContent(), content)) {
            note.setContent(content);
        }
    }
}
