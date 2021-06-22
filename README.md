# EMAIL DASHBOARD

This project utilizes JavaScript to show and hide all tabs on a Email Dashboard. 
Tabs that are included are Inbox, Compose, Sent, Archived, Signout.
Django is used as the backend to handle to API along side the Login/Register account validation.
API calls to Django are made in JavaScript to access the users data. 
Once the Calls have been made the data is converted into Json Objects then displayed on screen within the given tab.
Similar process is taken with sending the data Via compose, data is sent as a post request to the api to store the data in the SQLite database.
If a email has been viewed by a user the email will appear in grey and if it has yet to be viewed it will appear in white.
Functionality to Archive and Reply are featured on/in each Email.

## TOOLS: 
- JavaScript
- Python 3.9.5
- Django 3.1 
- SQLite 
- Bootstrap 4.4


## LAUNCH

#### *Website is being hosted at:* 
(http://jsemail.pythonanywhere.com)

If you choose to not create a User account, dummy account can be used at login.
#### Login Credentials:
```Email: john@email.com```
```Password: password```

For cloning the project, all the dependencies are within the ```requirements.txt``` file in the root directory. 
Once you download all the dependencies, run ``` python manage.py runserver ``` to run on your local host.
Some users will need to change the run slightly to ```python3 manage.py runserver ``` depending on how you set up python.
