from flask import Flask
from connecter import cursor


app = Flask(__name__)
app.secret_key = "key"


@app.route('/reg', methods=['GET'])
def index():

    return {"script" : "Hello World"}

if __name__ == '__main__':
    app.run(debug = True)


