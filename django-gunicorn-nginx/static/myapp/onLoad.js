document.addEventListener('DOMContentLoaded', () => {
    fetch('/on_load')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const taskListDiv = document.getElementById('taskList');
            data.tasks.forEach(task => {
                const card = createTaskCard(task.id, task.title, task.description);
                taskListDiv.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
});
