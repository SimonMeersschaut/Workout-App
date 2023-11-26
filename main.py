from flask import Flask, render_template, request, redirect, url_for, Response
import json
from user import User

app = Flask(__name__, template_folder='templates')


@app.route('/file/<filename>')
def render_file(filename):
    match filename.split('.')[-1]:
        case 'css':
            mimetype = 'text/css'
        case 'js':
            mimetype = 'text/javascript'
        case 'svg':
            mimetype = 'image/svg+xml'
        case _:
            mimetype = 'text'
    with open('templates/'+filename, 'r') as f:
        return Response(f.read(), mimetype=mimetype)


@app.route('/')
@app.route('/workout')
def workout():
    # Render a page with a list of available workouts
    # You can retrieve workout data from a database or another source
    # and pass it to the template for rendering
    return render_template('workout.html')


@app.route('/profile')
def profile():
    return render_template('profile.html')


@app.route('/workout/<int:workout_id>')
def workout_detail(workout_id):
    # Render a page with details for a specific workout
    # You can retrieve detailed workout data based on workout_id
    # and pass it to the template for rendering
    workout_details = {...}  # Replace with actual workout details
    return render_template('workout_detail.html', workout=workout_details)


@app.route('/my-exercices')
def my_exercices():
    my_user = User()
    return {"success": True, "exercices": my_user.get_my_exercices()}


@app.route('/submitExercice', methods=['POST'])
def submitExercice():
    print(request.get_json(force=True))
    return {'success': True, 'status': 'ok'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
