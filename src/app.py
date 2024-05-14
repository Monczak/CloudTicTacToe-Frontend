import os
from flask import Flask, make_response, render_template, request, redirect, session
import requests

AUTH_ADDRESS = "https://backend:8001"

app = Flask(__name__, 
            template_folder="../templates",
            static_folder="../static")

app.secret_key = os.environ["FLASK_SECRET_KEY"]


def set_tokens(response, access_token, refresh_token, expires_in):
    response.set_cookie("AccessToken",  access_token, max_age=expires_in)
    response.set_cookie("RefreshToken", refresh_token, max_age=expires_in)
    return response


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    username = request.form["username"]
    password = request.form["password"]
    response = requests.post(f"{AUTH_ADDRESS}/auth?action=login", 
                                        json={"username": username, "password": password}, 
                                        verify=False, timeout=30)
    response_json = response.json()
    
    if response_json["intent"] == "success":
        server_response = make_response(redirect("/"))
        set_tokens(server_response, response_json["access_token"], response_json["refresh_token"], int(response_json["expires_in"]))
        return server_response

    return render_template("login.html", error=response_json["description"])


@app.route("/signup", methods=["GET"])
def signup():
    return render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    email = request.form["email"]
    username = request.form["username"]
    password = request.form["password"]
    response = requests.post(f"{AUTH_ADDRESS}/auth?action=signup", 
                                        json={"email": email, "username": username, "password": password}, 
                                        verify=False, timeout=30)
    response_json = response.json()
    
    if response_json["intent"] == "awaiting_verification":
        session["email"] = email
        session["username"] = username
        return redirect("verifyuser")

    return render_template("signup.html", error=response_json["description"])


@app.route("/verifyuser", methods=["GET"])
def verify_user():
    return render_template("verify-user.html", email=session["email"])


@app.route("/verifyuser", methods=["POST"])
def verify_user_post():
    code = request.form["code"]
    response = requests.post(f"{AUTH_ADDRESS}/auth?action=verify", 
                                        json={"code": code, "username": session["username"]}, 
                                        verify=False, timeout=30).json()

    if response["intent"] == "success":
        return redirect("login")

    return render_template("verify-user.html", email=session["email"], error=response["description"])


@app.route("/logout", methods=["GET"])
def logout():
    access_token = request.cookies.get("AccessToken")
    if access_token is None:
        return redirect("/")
    
    response = requests.get(f"{AUTH_ADDRESS}/auth?action=logout", 
                            headers={"Authorization": f"Bearer {access_token}"}, 
                            verify=False, timeout=30)
    response_json = response.json()

    if response_json["intent"] == "success":
        server_response = make_response(redirect("/"))
        set_tokens(server_response, "", "", 0)
        return server_response
    return f"Couldn't log out: {response_json['description']}", 400


@app.route("/")
def index():
    access_token = request.cookies.get("AccessToken")
    refresh_token = request.cookies.get("RefreshToken")

    if access_token is None:
        return render_template("index.html", user_logged_in=False)
    
    response = requests.get(f"{AUTH_ADDRESS}/auth/get_user", 
                            headers={"Authorization": f"Bearer {access_token}"}, 
                            verify=False, timeout=30)
    
    response_json = response.json()

    if response.status_code == 401:
        refresh_response = requests.post(f"{AUTH_ADDRESS}/auth?action=refresh", 
                            json={"REFRESH_TOKEN": refresh_token}, 
                            verify=False, timeout=30)
        
        response_json = refresh_response.json()
        if response_json["intent"] == "success":
            user_response = requests.get(f"{AUTH_ADDRESS}/auth/get_user", 
                            headers={"Authorization": f"Bearer {access_token}"}, 
                            verify=False, timeout=30)
    
            user_response_json = user_response.json()

            server_response = make_response(render_template("index.html", user_logged_in=True, username=user_response_json["username"]))
            set_tokens(server_response, response_json["access_token"], response_json["refresh_token"], int(response_json["expires_in"]))
            return server_response

    if response_json["intent"] == "success":
        return render_template("index.html", user_logged_in=True, username=response_json["username"])
    
    return render_template("index.html", user_logged_in=False)


if __name__ == "__main__":
    app.run(debug=True)
