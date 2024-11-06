document.addEventListener('DOMContentLoaded', function() {
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

    function displayNotes() {
        const transaction = db.transaction(['notes'], 'readonly');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const notes = event.target.result;
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            notes.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.innerHTML = `
                    <p>${note.content}</p>
                    <button class="edit-button" data-id="${note.id}">Edit</button>
                    <button class="delete-button" data-id="${note.id}">Delete</button>
                `;
                notesList.appendChild(noteItem);
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', function() {
                    const id = Number(this.getAttribute('data-id'));
                    deleteNote(id);
                });
            });

            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', function() {
                    const id = Number(this.getAttribute('data-id'));
                    editNote(id);
                });
            });
        };
    }

    function deleteNote(id) {
        const transaction = db.transaction(['notes'], 'readwrite');
        const objectStore = transaction.objectStore('notes');
        const request = objectStore.delete(id);

        request.onsuccess = function() {
            displayNotes();
        };

        request.onerror = function(event) {
            console.error('Delete note error:', event.target.errorCode);
        };
    }

    function editNote(id) {
        const transaction = db.transaction(['notes'], 'readonly');
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
    }
});