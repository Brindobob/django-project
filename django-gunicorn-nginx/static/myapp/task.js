var editedId;

function createNewTask() {
    document.getElementById('createTaskTitle').value = '';
    document.getElementById('createTaskDescription').value = '';
}

function saveNewTask() {
    var taskTitle = document.getElementById('createTaskTitle').value;
    var taskDescription = document.getElementById('createTaskDescription').value;
    var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));

    modal.hide();
    
    fetch('create_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            title: taskTitle,
            description: taskDescription
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            const taskListDiv = document.getElementById('taskList');
            const newTaskCard = createTaskCard(
                data.id,
                document.getElementById('createTaskTitle').value,
                document.getElementById('createTaskDescription').value
            );
            taskListDiv.appendChild(newTaskCard);
        } else {
            console.error(result.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function deleteTask(taskId) {
    var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch(`/delete_task/${taskId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    });

    if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
            const taskCard = document.getElementById(`task-card-${taskId}`);
            if (taskCard) {
                taskCard.remove();
            }
        } else {
            console.error(result.message);
        }
    } else {
        throw new Error('Network response was not ok');
    }
}

function editTask(id) {
    editedId = id;
    var taskCard = document.getElementById(`task-card-${id}`)
    var cardTitle = taskCard.querySelector('.card-title');
    var cardText = taskCard.querySelector('.card-text');
    document.getElementById('editTaskTitle').value = cardTitle.textContent;
    document.getElementById('editTaskDescription').value = cardText.textContent;
}

async function saveEditedTask() {
    var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var updatedTitle = document.getElementById('editTaskTitle').value;
    var updatedDescription = document.getElementById('editTaskDescription').value;

    const response = await fetch(`/edit_task/${editedId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, 
        },
        body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription
        })
    });

    if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
            var taskCard = document.getElementById(`task-card-${editedId}`)
            var cardTitle = taskCard.querySelector('.card-title');
            var cardText = taskCard.querySelector('.card-text');
            cardTitle.textContent = updatedTitle;
            cardText.textContent = updatedDescription;

            var editTaskModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
            editTaskModal.hide();
        } else {
            console.error(result.message);
        }
    } else {
        throw new Error('Network response was not ok');
    }
}

function createTaskCard(id, title, description) {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.id = `task-card-${id}`;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = description;

    const editButton = document.createElement('a');
    editButton.type = "button";
    editButton.className = 'btn btn-secondary';
    editButton.setAttribute('data-bs-toggle', 'modal');
    editButton.setAttribute('data-bs-target', '#editTaskModal');
    editButton.textContent = 'Edit';
    editButton.onclick = function(event) {
        event.preventDefault();
        editTask(id);
    };

    const deleteButton = document.createElement('a');
    deleteButton.type = "button";
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function(event) {
        event.preventDefault();
        deleteTask(id);
    };

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(editButton);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);

    return card;
}