from flask import Flask, render_template

app = Flask(__name__, 
            template_folder="../templates",
            static_folder="../static")


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    return render_template("login.html", error="Test Error")


@app.route("/signup", methods=["GET"])
def signup():
    return render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    return render_template("signup.html")


@app.route("/verifyuser", methods=["GET"])
def verify_user():
    return render_template("verify-user.html")


@app.route("/verifyuser", methods=["POST"])
def verify_user_post():
    return render_template("verify-user.html")


@app.route("/")
def index():
    context = {"user_logged_in": False, "login": ""}
    return render_template("index.html", **context)


if __name__ == "__main__":
    app.run(debug=True)
