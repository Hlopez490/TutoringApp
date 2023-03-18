from flask import Flask, request, jsonify, session
from connecter import cursor, db
import bcrypt
import re


app = Flask(__name__)
app.secret_key = "key"


@app.route('/', methods=['POST', "GET"])
def index():

    return {'script': "Hello"}


@app.route('/sign-up', methods=['POST', "GET"])
def signup():
    if request.method == 'POST':
        req = request.get_json()

        # get student data
        netid = req["netid"].upper()
        first_name = req["first_name"].upper()
        last_name = req['last_name'].upper()
        phone = req['phone']
        email = req['email']
        passowrd = req['password']

        # check if netid or email or phone already exists
        select_student = f"SELECT * FROM Student WHERE netid = %s or email = %s or phone = %s"
        cursor.execute(select_student,(netid, email, phone))
        result = cursor.fetchall()
        print(result)
        if len(result) > 0:
            return {"msg": "Student NetId or email or phone number already been used."}, 400

        
        # check if netid or email or phone already exists
        select_student = f"SELECT * FROM Student WHERE netid = %s or email = %s or phone = %s"
        cursor.execute(select_student,(netid, email, phone))
        result = cursor.fetchall()

        if len(result) > 0:
            return {"msg": "Student NetId or email or phone number already been used."}, 400

        # check if netid is correct
        # a netid should start with 3 letters and follow by 6 digits
        if not re.match(r"^[A-Z]{3}\d{6}$", netid):
            return {"msg": "Invalid NetId."}, 400

        
        # check if phone number is correct
        # a phone number must be 10 digits long
        if not re.match(r"^[\d]{10}$", phone):
            return {"msg": "Invalid phone number."}, 400

        
        # check if email is correct format
        # match a string starting with any alphabetic character, digits, dots, hyphens or underscores
        # follow by @ with any alphabetic character, digits or hyphens
        # follow by . with 2 to 8 numbers of alphabetic character or digit
        if not re.match(r"^[a-zA-Z\d\.\-_]+@[a-zA-Z\d-]+\.[a-zA-Z\d]{2,8}$", email):
            return {"msg": "Invalid email format."}, 400

        
        # check if password is correct format
        # a password must contain at least 12 characters, at least 1 digits, 
        # at least 1 lower case letter, at least 1 upper case letter and at least 1 special character
        if not re.match(r"^(?=.*[\d]{1,})(?=.*[a-z]{1,})(?=.*[A-Z]{1,})(?=.*[<>(){}\"|;':.,~!?@#$%^=&*\\\[\]]{1,})[a-z\dA-Z<>(){}\"|;':.,~!?@#$%^=&*\\\[\]]{12,}$", passowrd):
            return {"msg": "A password mush contains at least 12 characters with at least 1 digits, 1 upper case letter, 1 lower case letter and 1 special character."}, 400 

        
        #hash passowrd
        hashed_pw = bcrypt.hashpw(passowrd.encode('utf-8'), bcrypt.gensalt())
        
        #insert into student table 
        insert_new_student = f"INSERT INTO Student (netid, first_name, last_name, phone, email, password, minutes_tutored) VALUES" \
                            f"(%s,%s,%s,%s,%s,%s,%s) "
        
        cursor.execute(insert_new_student, (netid, first_name, last_name, phone, email, hashed_pw, 0 ))
        db.commit()

        return {"msg": "Thanks for signing up. Your account has been succesfully created."}
        
    return {'msg': "SignUp"}


@app.route('/login', methods=['POST', "GET"])
def login():
    if request.method == 'POST':
        req = request.get_json()

        netid = req["netid"].upper()
        password = req["password"]

        # match netid and password
        select_student = f"SELECT netid, password FROM Student WHERE netid = %s"
        cursor.execute(select_student, (netid,))
        result = cursor.fetchall()
        if len(result) < 1:
            return {"msg": "no such netid"}, 400
        print(result)
        # check password with hashed password
        if bcrypt.checkpw(password.encode('utf-8'), result[0][1].encode('utf-8')):

            # add session to student
            session["net_id"] = result[0][0]
            return {"msg": "login successful"}, 200
        else:
            return {"msg": "incorrect password"}, 400




@app.route('/favorites', methods=['POST', "GET"])
def favorite(): 
    #Method to add someone to a students favorite list
    if request.method == 'POST':
        req = request.get_json()
        netid = req["netid"]
        tutor_id = req["tutor_id"]
        insert_new_favorite = f"INSERT INTO Favorites (tutor_id, student_id) VALUES" \
            f"(%s,%s)"

        cursor.execute(insert_new_favorite, (tutor_id, netid))
        db.commit()
        return jsonify({"msg" : "Successful"})
    
    #get list of a student's favorite tutors
    if request.method == 'GET':

        req = request.get_json()
        netid = req["netid"]

        select_favorites = f"SELECT first_name, last_name, phone, email, about_me FROM Favorites, Tutor, Student WHERE student_id = %s AND Tutor.tutor_id = Favorites.tutor_id AND Tutor.tutor_id = Student.tutor_id"
        cursor.execute(select_favorites, (netid,))
        result = cursor.fetchall()
        return jsonify(result)

       


@app.route('/tutorList', methods=["GET"])
def tutorList(): 
    #get list of all tutors
    if request.method == 'GET':
        select_tutors = f"SELECT first_name, last_name, phone, email, about_me FROM  Tutor, Student WHERE Tutor.tutor_id = Student.tutor_id"
        cursor.execute(select_tutors)
        result = cursor.fetchall()
        return jsonify(result)




if __name__ == '__main__':
    app.run(debug = True)


