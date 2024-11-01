document.addEventListener('DOMContentLoaded', function() {
    // Open (or create) the database
    let db;
    const request = indexedDB.open('notesDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('content', 'content', { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        displayNotes();
    };

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };

    // Add a new note
    document.getElementById('note-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const noteContent = document.getElementById('note-content').value;
        if (noteContent.trim() === '') return;

        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.add({ content: noteContent });

        request.onsuccess = function() {
            document.getElementById('note-content').value = '';
            displayNotes();
        };

        request.onerror = function(event) {
            console.error('Add note error:', event.target.errorCode);
        };
    });

    // Display all notes
    function displayNotes() {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';

        const transaction = db.transaction(['notes'], 'readonly');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.openCursor();

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.innerHTML = `
                    <p>${cursor.value.content}</p>
                    <button onclick="editNote(${cursor.value.id})">Edit</button>
                    <button onclick="deleteNote(${cursor.value.id})">Delete</button>
                `;
                notesList.appendChild(noteItem);
                cursor.continue();
            }
        };
    }

    // Edit a note
    window.editNote = function(id) {
        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.get(id);

        request.onsuccess = function(event) {
            const note = event.target.result;
            document.getElementById('note-content').value = note.content;
            deleteNote(id);
        };

        request.onerror = function(event) {
            console.error('Edit note error:', event.target.errorCode);
        };
    };

    // Delete a note
    window.deleteNote = function(id) {
        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.delete(id);

        request.onsuccess = function() {
            displayNotes();
        };

        request.onerror = function(event) {
            console.error('Delete note error:', event.target.errorCode);
        };
    };
});