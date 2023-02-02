
## Backend

### How to run

1. Navigate to the [server](./server/) directory
2. Install the dependencies `pip install -r requirements.txt`
3. Run the server `python manage.py runserver`

Note: If you use MacOs you may need to call python3 instead of python (or just create a symlink!)

### How to make POST request to OpenAI model

1. Run the server as previously described
2. Open Postman/Insomnia
3. Create new POST request to `http://127.0.0.1:8000/excelsimplify/`
4. Enter a valid payload and click send

Example of valid payload
```
{
    "body": "How do I find the average of my row?"
}
```