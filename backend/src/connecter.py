import mysql.connector

db = mysql.connector.connect(
    user="Li",
    password="26285194",
    host="cs4347.c3bw7ao2sqoy.us-west-2.rds.amazonaws.com",
    database="Tutoring"
)

cursor = db.cursor()