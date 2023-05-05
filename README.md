# Online Tutroing Deployment


## Backend
Source code lcoated backend\src directory

Mysql workbench scripts located in backend directory `SQL_scripts.sql`

#### Download all the necessary libraries

[MySQL Connector](https://dev.mysql.com/doc/connector-python/en/connector-python-installation-binary.html)
```bash
pip install mysql-connector-python
```
[Flask](https://pypi.org/project/Flask/)
```bash
pip install Flask
```
#### Files

Tutor profile images must be placed in `src\static\images` directory

#### Database
You can directly access the DB in MySQL Workbench 
by using the `user_name` `password` and `host` provided 
in the the `connector.py`. This DB is hosted on AWS.

## Frontend
