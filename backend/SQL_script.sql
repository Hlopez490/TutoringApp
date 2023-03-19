CREATE TABLE Student(
    netid VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(30),
    email VARCHAR(255),
    password VARCHAR(255),
    minutes_tutored INTEGER,
    tutor_id VARCHAR(255)L,
    index is_tutor(tutor_id),
    PRIMARY KEY(netid)
);

CREATE TABLE Tutor(
    tutor_id VARCHAR(255),
    about_me VARCHAR(5000),
    profile_pic BLOB,
    PRIMARY KEY(tutor_id),
    FOREIGN KEY(tutor_id) REFERENCES Student(tutor_id)
);

CREATE TABLE Availability(
    tutor_id VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    PRIMARY KEY (tutor_id, start_time, end_time),
    FOREIGN KEY(tutor_id) REFERENCES Tutor(tutor_id)
);

CREATE TABLE Favorites(
	tutor_id VARCHAR(255),
    student_id VARCHAR(255),
	PRIMARY KEY(student_id, tutor_id),
    FOREIGN KEY(student_id) REFERENCES Student(netid),
	FOREIGN KEY(tutor_id) REFERENCES Tutor(tutor_id)
);

CREATE TABLE Subjects(
	tutor_id VARCHAR(255),
	subject VARCHAR(255),
    PRIMARY KEY (tutor_id, subject),
    FOREIGN KEY(tutor_id) REFERENCES Tutor(tutor_id)
);

CREATE TABLE Appointments(
	tutor_id VARCHAR(255),
    student_id VARCHAR(255),
	start_time DATETIME,
    end_time DATETIME,
	subject VARCHAR(255),
    PRIMARY KEY (tutor_id, student_id, start_time, end_time),
    FOREIGN KEY(tutor_id) REFERENCES Tutor(tutor_id),
    FOREIGN KEY(student_id) REFERENCES Student(netid)
);
