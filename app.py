from flask import Flask, render_template
from asgiref.wsgi import WsgiToAsgi

app = Flask(__name__)


@app.route("/", methods=["GET"])
async def Home():
    return render_template("index.html")


async_app = WsgiToAsgi(app)
