# Online Tutroing Deployment


#### Download necessary tools
Install Code Compiler: Recommend [VsCode](https://code.visualstudio.com/Download)

Install LTS of [Nodejs](https://nodejs.org/en/download)

Install [Python](https://www.python.org/downloads/)

#### Pull from GitHub

- Using VsCode clone Repository 

- Sign in using github account for VsCode

- Paste "https://github.com/Fivetr/Online-Tutoring.git" into Repository name to clone into VsCode

- Save repo in Folder or Documents

## Backend
Source code lcoated in backend\src directory

Mysql workbench scripts located in backend directory `SQL_scripts.sql`

#### Download all the necessary libraries

Using terminal "Ctrl + `" to start terminal

[MySQL Connector](https://dev.mysql.com/doc/connector-python/en/connector-python-installation-binary.html)
```bash
pip install mysql-connector-python
```
[Flask](https://pypi.org/project/Flask/)
```bash
pip install Flask
```
Start backend
```bash
py backend/src/app.py
```
#### Files

Tutor profile images located in `src\static\images` directory

#### Database
You can directly access the DB in MySQL Workbench 
by using the `user_name` `password` and `host` provided 
in the the `connector.py`. This DB is hosted on AWS.

## Frontend

In VsCode open another terminal "Ctrl + `" 

Install React app -- will take a bit to install
```bash
npm install 
``` 

Start React -Allow Nodejs firewall
```bash
npm start
``` 

## DEMO Video
https://www.youtube.com/watch?v=LRjQlXN64q8
