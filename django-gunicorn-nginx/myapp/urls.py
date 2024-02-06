from django.urls import path 
from . import views 

urlpatterns = [
    path('', views.index, name='index'),
    path('on_load', views.on_load, name='on_load'),
    path('create_task', views.create_task, name='create_task'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('edit_task/<int:task_id>/', views.edit_task, name="edit_task"),
]