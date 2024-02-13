import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from pymongo import MongoClient
import random
import os

try:
    MONGO_IP = os.environ["MONGO_IP"]
except KeyError as e:
    raise RuntimeError("Could not find a MONGO_IP in environment") from e

client = MongoClient(MONGO_IP)
django_project = client['django_project']
tasks = django_project['tasks']

def index(request):
    return render(request, 'myapp/home.html')

def on_load(request):
    tasks_cursor = tasks.find({})
    tasks_list = list(tasks_cursor)
    for task in tasks_list:
        task['_id'] = str(task['_id'])

    return JsonResponse({'tasks': tasks_list})

def create_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id = random.randint(0,10000) # Implement actual uuid OR maybe use '_id' instead
        title = data.get('title')
        description = data.get('description')
        task = {
            'id': id,
            'title': title,
            'description': description 
        }

        success = JsonResponse(
            {
                'status': 'success',
                'message': 'Task created successfully.',
                'id': id,
                'title': task,
                'description': description,
            }
        )

        failure = JsonResponse(
            {
                'status': 'failure',
                'message': 'Failed to create task.',
                'id': id,
                'title': title,
                'description': description,
            }
        )

        try:
            task_insert_result = tasks.insert_one(task)
            if task_insert_result.inserted_id:
                return success
            else:
                return failure
        except:
            return failure
        
@require_http_methods(["DELETE"])
def delete_task(request, task_id):
    success = JsonResponse(
        {
            'status': 'success',
            'message': 'Task deleted successfully.',
            'id': task_id
        }
    )

    failure = JsonResponse(
        {
            'status': 'failure',
            'message': 'Failed to delete task.',
            'id': task_id
        }
    )

    try:
        delete_result = tasks.delete_one({'id': task_id})
        if delete_result.deleted_count > 0:
            return success
        else:
            return failure
    except:
        return failure

@require_http_methods(["PUT"])
def edit_task(request, task_id):
    data = json.loads(request.body)
    title = data.get('title')
    description = data.get('description')
    new_values = {
        '$set': {
            'title': title,
            'description': description
        }
    }

    success = JsonResponse(
    {
        'status': 'success',
        'message': 'Task ediited successfully.',
        'id': task_id,
        'title': title,
        'description': description
    }
    )

    failure = JsonResponse(
        {
            'status': 'failure',
            'message': 'Failed to edit task.',
            'id': task_id,
            'title': title,
            'description': description
        }
    )

    try:
        update_result = tasks.update_one({'id': task_id}, new_values)
        if update_result.modified_count > 0:
            return success
        else:
            return failure
    except:
        return failure

