from flask import Blueprint, render_template, redirect, url_for

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def root():
    return redirect(url_for("pages.courses_page"))


@pages_bp.route("/login")
def login_page():
    return render_template("login.html", page_title="Авторизация")


@pages_bp.route("/courses")
def courses_page():
    return render_template("courses.html", page_title="Курсы")


@pages_bp.route("/courses/<slug>")
def course_detail_page(slug: str):
    return render_template("course_detail.html", page_title="О курсе", course_slug=slug)


@pages_bp.route("/profile")
def profile_page():
    return render_template("profile.html", page_title="Профиль")


@pages_bp.route("/learn/<slug>")
def learn_page(slug: str):
    return render_template("learn.html", page_title="Прохождение курса", course_slug=slug)
