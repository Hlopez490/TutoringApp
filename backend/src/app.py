from flask import Flask, request, session
from connecter import cursor, db
import re
import datetime
import random
import string
import json
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "key"

UPLOAD_FOLDER = "static/images"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route('/', methods=['POST', "GET"])
def index():

    return {'script': "Hello"}


@app.route('/sign-up', methods=['POST', "GET"])
def signup():
    if request.method == 'POST':
        req = request.get_json()
        
        print(req)
        # get student data
        netid = req["netid"].upper()
        first_name = req["first_name"].upper()
        last_name = req['last_name'].upper()
        phone = req['phone']
        email = req['email']
        passowrd = req['password']

        # check if netid or email already exists
        select_student = f"SELECT * FROM Student WHERE netid = %s or email = %s"
        cursor.execute(select_student,(netid, email))
        result = cursor.fetchall()
        
        if len(result) > 0:
            return {"msg": "Student NetId or email already been used."}, 400

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
        #hashed_pw = bcrypt.hashpw(passowrd.encode('utf-8'), bcrypt.gensalt())
        #hashed_pw = hashed_pw.decode()
        hashed_pw = generate_password_hash(passowrd)
        
        #insert into student table 
        insert_new_student = f"INSERT INTO Student (netid, first_name, last_name, phone, email, password, minutes_tutored, tutor_id) VALUES" \
                            f"(%s,%s,%s,%s,%s,%s,%s,%s) "
        
        cursor.execute(insert_new_student, (netid, first_name, last_name, phone, email, hashed_pw, 0, "None"))
        db.commit()

        return {"msg": "Thanks for signing up. Your account has been succesfully created."}
        
    return {'msg': "SignUp"}

@app.route('/reg_tutor', methods=['POST'])
def reg_tutor():
    if request.method == 'POST':

        student_id = session["net_id"].upper()
        about = request.form.get('about')
        subjects = request.form.get('subjects')
        subjects = list(subjects.split(", "))

        # use default image if no profile picture uploaded
        if 'image' not in request.files:
            image_name = "default.jpg"
        else:
            image = request.files["image"]
            # save the image in "static\images"
            image.save(os.path.join(os.path.abspath(os.path.dirname(__file__)),app.config["UPLOAD_FOLDER"], secure_filename(image.filename)))
            #image.save(os.path.join(os.path.abspath(os.pardir),"backend", app.config["UPLOAD_FOLDER"], secure_filename(image.filename)))
            image_name = image.filename
        

        # tutor id = student_id + 6 random ascii letters
        rad = "".join([random.choice(string.ascii_letters + string.digits) for _ in range(6)])
        tutor_id = student_id + rad

        #insert into student table 
        insert_new_tutor = f"INSERT INTO Tutor (tutor_id, about_me, profile_pic) VALUES (%s,%s,%s)"
        
        #update student table
        update_student_table = f"UPDATE Student SET tutor_id = %s WHERE netid = %s"

        # save tutor subjects into
        assign_subjects = f"INSERT INTO Subjects (tutor_id, subject) VALUES" \
                                f"(%s, %s)"

        # update student's tutor id 
        cursor.execute(update_student_table, (tutor_id, student_id))
        db.commit()
        
        # insert new tutor
        cursor.execute(insert_new_tutor, (tutor_id, about, image_name))
        db.commit()

        for subject in subjects:
            cursor.execute(assign_subjects, (tutor_id, subject.upper()))
            db.commit()

        return {"msg": "register successfully"}, 200
    


@app.route('/login', methods=['POST', "GET"])
def login():
    if request.method == 'POST':
        req = request.get_json()

        netid = req["netid"].upper()
        password = req["password"]

        # match netid and password
        select_student = f"SELECT netid, password, tutor_id FROM Student WHERE netid = %s"
        cursor.execute(select_student, (netid,))
        result = cursor.fetchall()
        if len(result) < 1:
            return {"msg": "no such netid",
                    "success": False}, 400
        
        # check password with hashed password
        #if bcrypt.checkpw(password.encode('utf-8'), result[0][1].encode('utf-8')):
        if check_password_hash(result[0][1], password):
            # indicate if the user is also a tutor
            if result[0][2] == "None":
                status = "student"
            else:
                status = "tutor"

            # add session to student
            session["net_id"] = result[0][0]
            return {"msg": "login successful",
                    "status": status,
                    "success": True}, 200
        else:
            return {"msg": "incorrect password",
                    "success": False}, 400
        
# logout
@app.route("/logout", methods = ["POST"])
def logout():
    if request.method == "POST":
        session.pop("net_id", None)
        return {"msg": "Logged out"}, 200
    

@app.route('/appointment/<tutor_id>', methods = ['POST'])
def make_appointment(tutor_id):
    if request.method == 'POST':
        req = request.get_json()
        student_id = session["net_id"]
        start_time = req["start_time"]
        end_time = req["end_time"]
        subject = req["subject"].upper()

        #insert into Appointments table 
        insert_new_appointment = f"INSERT INTO Appointments (tutor_id, student_id, start_time, end_time, subject) VALUES" \
                                f"(%s,%s,%s,%s,%s) "
        
        # get student's current appointments
        student_appointments =f"SELECT start_time, end_time FROM Appointments WHERE student_id = %s AND start_time > %s"

        # delete available Appointments from Availability table
        delete_availability = f"DELETE FROM Availability WHERE tutor_id = %s" \
                                f"AND start_time = %s AND end_time = %s"
        
        update_student_hour = f"UPDATE Student SET minutes_tutored = minutes_tutored + %s" \
                                f"WHERE netid = %s"
        
        update_tutor_hour = f"UPDATE Student SET minutes_tutored = minutes_tutored + %s" \
                            f"WHERE tutor_id = %s"
        
        # Check if a student has booked a past time appointment
        current_datetime = datetime.datetime.now()
        
        
        format = "%Y-%m-%d %H:%M:%S"
        # convert str start_time to datetime object
        start_time_datetime = datetime.datetime.strptime(start_time,format)
        end_time_datetime = datetime.datetime.strptime(end_time,format)

        if start_time_datetime < current_datetime:
            return {"msg": "overdue appointment"}, 400
        
    
        # check if the appointment time is conflicting with student's current appointment
        cursor.execute(student_appointments, (student_id, current_datetime))
        result = cursor.fetchall()
        
        def time_in_range(start, end, time):
            """Return true if x is in the range [start, end]"""
            if start <= end:
                time = start <= time <= end
                return time
            else:
                print(1)
                return start <= time or time <= end

        if len(result) > 1:
            for time in result:
                if time_in_range(time[0], time[1], start_time_datetime):
                    return {"msg":"appointment time conflict"}, 400
                elif time_in_range(time[0], time[1], end_time_datetime):
                    return {"msg":"appointment time conflict"}, 400
                elif time_in_range(start_time_datetime, end_time_datetime, time[0]) \
                    and time_in_range(start_time_datetime, end_time_datetime, time[1]):
                    return {"msg":"appointment time conflict"}, 400
                
        minutessince = int((end_time_datetime - start_time_datetime).total_seconds() / 60)

        # book an appointment
        cursor.execute(insert_new_appointment, (tutor_id, student_id, start_time, end_time, subject))
        db.commit()
        
        cursor.execute(delete_availability, (tutor_id, start_time, end_time))
        db.commit()

        # update tutor total tutored hours
        cursor.execute(update_tutor_hour, (minutessince, tutor_id))
        db.commit()
        
        # update student total tutored hours
        cursor.execute(update_student_hour, (minutessince, student_id))
        db.commit()
        
        return {"msg": "Appointment Scheduled !!"}, 200
    
    return {"msg": "No Appointment Scheduled"}, 200



@app.route('/dashboard/<tutor_id>/<start_time>/<end_time>', methods=['DELETE'])
def delete_appointment(tutor_id, start_time, end_time):
    if request.method == 'DELETE':
        student_id = session["net_id"]

        update_student_hour = f"UPDATE Student SET minutes_tutored = minutes_tutored - %s" \
                                f"WHERE netid = %s"
        
        update_tutor_hour = f"UPDATE Student SET minutes_tutored = minutes_tutored - %s" \
                            f"WHERE tutor_id = %s"

        delete_appointment = f"DELETE FROM Appointments WHERE student_id = %s AND " \
                            f"tutor_id = %s AND start_time = %s"
        
        insert_available = f"INSERT INTO Availability (tutor_id, start_time, end_time) VALUES"\
                            f"(%s,%s,%s)"
        
        # Appointment can be canceled until 24 hours prior to the scheduled tutoring session
        current_date = datetime.datetime.now()

        format = "%Y-%m-%d %H:%M:%S"
        # convert str start_time to datetime object
        start_time_datetime = datetime.datetime.strptime(start_time,format)
        end_time_datetime = datetime.datetime.strptime(end_time,format)

        if current_date+datetime.timedelta(hours=24) >= start_time_datetime:
            
            return {"msg": "Appointments can be canceled until 24 hours prior"\
                    " to the scheduled tutoring session."}, 400
        else:
            minutessince = int((end_time_datetime - start_time_datetime).total_seconds() / 60)

            # cancel the scheduled tutoring session
            cursor.execute(delete_appointment, (student_id, tutor_id, start_time))
            db.commit()
            # update the tutoring session
            cursor.execute(insert_available, (tutor_id, start_time, end_time))
            db.commit()
            # update tutor total tutored hours
            cursor.execute(update_tutor_hour, (minutessince, tutor_id))
            db.commit()
            # update student total tutored hours
            cursor.execute(update_student_hour, (minutessince, student_id))
            db.commit()


            return {"msg": "appointment is canceled"}, 200
        
    return {"msg": "no appointments were canceled"}, 200


@app.route('/tutor_student_info', methods=['GET'])
def retrive_students_dashboard():
    if request.method == 'GET':
        student_id = session["net_id"].upper()
        
        get_tutor_id = f"SELECT tutor_id FROM Student WHERE netid = %s"
        cursor.execute(get_tutor_id, (student_id,))
        results = cursor.fetchall()
        tutor_id = results[0][0]
        
        # get all students assigned with specified tutor
        get_student = f"SELECT A.*, S.email, S.first_name, S.last_name, S.phone FROM Appointments A, Student S WHERE A.tutor_id = %s AND A.student_id = S.netid"
        
        cursor.execute(get_student, (tutor_id,))
        results = cursor.fetchall()
        counter = 0
        appointments = {}
        # format json data
        for result in results:
            print(result)
            counter += 1
            appointment = {}
            appointment["student_id"] = result[1]
            appointment["start_time"] = result[2]
            appointment["end_time"] = result[3]
            appointment["subject"] = result[4]
            appointment["student_email"] = result[5]
            appointment["student_first_name"] = result[6]
            appointment["student_last_name"] = result[7]
            appointment["student_phone"] = result[8]
            appointments["appointment" + str(counter)] = appointment
        

        return appointments, 200




@app.route('/favorites', methods=['POST', "GET"])
def favorite(): 
    #Method to add someone to a students favorite list
    if request.method == 'POST':
        req = request.get_json()
        netid = session["net_id"].upper()
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
        select_tutors = f"SELECT first_name, last_name, minutes_tutored, phone, email, about_me, profile_pic, Tutor.tutor_id FROM Tutor, Student WHERE Tutor.tutor_id = Student.tutor_id"
        select_subjects = f"SELECT S.subject, T.tutor_id FROM Subjects S, Tutor T WHERE T.tutor_id = S.tutor_id"
        cursor.execute(select_tutors)
        results = cursor.fetchall()
        counter = 0
        Tutors = []
        # format json data
        for result in results:
            counter += 1
            tutor = {}
            tutor["first_name"] = result[0]
            tutor["last_name"] = result[1]
            tutor["minutes_tutored"] = result[2]
            tutor["phone"] = result[3]
            tutor["email"] = result[4]
            tutor["about_me"] = result[5]
            tutor["profile_pic"] = result[6]
            tutor["tutor_id"] = result[7]
            tutor["subjects"] = []
            Tutors.append(tutor)
        
        cursor.execute(select_subjects)
        result_ = cursor.fetchall()
        print(result_)
        for result in result_:
            for tutor in Tutors:
                if tutor["tutor_id"] == result[1]:
                    tutor["subjects"].append(result[0])
                  
        return Tutors


@app.route('/availability', methods=['POST', 'GET'])
def availability():
    if request.method == 'POST':
        req = request.get_json()
        start_time = req["start_time"]
        end_time = req["end_time"]

        # get tutor id
        student_id = session["net_id"].upper()
        
        get_tutor_id = f"SELECT tutor_id FROM Student WHERE netid = %s"
        cursor.execute(get_tutor_id, (student_id,))
        results = cursor.fetchall()
        tutor_id = results[0][0]

        current_availability = f"SELECT start_time, end_time FROM Availability WHERE tutor_id = %s"
        insert_available = f'INSERT INTO Availability (tutor_id, start_time, end_time) VALUES (%s, %s, %s, %s)'
        # Check if a student has booked a past time appointment

        current_datetime = datetime.datetime.now()
        
        
        format = "%Y-%m-%d %H:%M:%S"
        # convert str start_time to datetime object
        start_time_datetime = datetime.datetime.strptime(start_time,format)
        end_time_datetime = datetime.datetime.strptime(end_time,format)

        if start_time_datetime < current_datetime:
            return {"msg": "can't assign pass time availability"}, 400
        
    
        # check if the appointment time is conflicting with student's current appointment
        cursor.execute(current_availability, (tutor_id, ))
        result = cursor.fetchall()
        
        def time_in_range(start, end, time):
            """Return true if x is in the range [start, end]"""
            if start <= end:
                time = start <= time <= end
                return time
            else:
                print(1)
                return start <= time or time <= end

        if len(result) > 1:
            for time in result:
                if time_in_range(time[0], time[1], start_time_datetime):
                    return {"msg":"availability time conflict"}, 400
                elif time_in_range(time[0], time[1], end_time_datetime):
                    return {"msg":"availability time conflict"}, 400
                elif time_in_range(start_time_datetime, end_time_datetime, time[0]) \
                    and time_in_range(start_time_datetime, end_time_datetime, time[1]):
                    return {"msg":"availability time conflict"}, 400

        # add new availability
        cursor.execute(insert_available, (tutor_id, start_time, end_time))
        db.commit()
        
        return {"msg": "New Availability Scheduled !!"}, 200

    elif request.method == 'GET':
        current_availability = f"SELECT * FROM Availability"
        cursor.execute(current_availability)
        results = cursor.fetchall()
        counter = 0
        availabilitys = {}
        # format json data
        for result in results:
            print(result)
            counter += 1
            availability = {}
            availability["tutor_id"] = result[0]
            availability["start_time"] = result[1]
            availability["end_time"] = result[2]
            availabilitys["availability" + str(counter)] = availability
        
        return availabilitys, 200



if __name__ == '__main__':
    app.run(debug = True)


