from flask import Flask, render_template, request, Response
from database import database
from bson import ObjectId
app = Flask(__name__, template_folder='templates')


@app.route('/api/file/<filename>')
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
@app.route('/<username>/workouts')
def workouts(username=None):
    return render_template('workouts.html')


@app.route('/workouts/<workout_id>')
def workout(workout_id):
    return render_template('workout.html')


@app.route('/api/workouts')
def get_workouts():
    username = request.cookies.get('username')
    return {'success': True, 'data': [workout.to_json() for workout in database.get_workouts(username=username)]}


@app.route('/api/workouts/<int:workout_id>')
def get_workout(workout_id):
    username = request.cookies.get('username')
    user = database.get_user(username=username)
    try:
        return {'success': True, 'data': database.get_workout(user, workout_id=workout_id)}
    except IndexError:
        # IndexError: when exercice id is not found (deleted)
        return {'success': False}


@app.route('/<username>')
def profile(username):
    return render_template('profile.html')


@app.route('/api/addNewExercice', methods=['POST'])
def addNewExercice():
    data = request.get_json(force=True)
    if 'name' in data:
        # new exercice
        if len(database.get_exercices(name=data['name'])) == 0:
            # does not exist
            id = max([ex['id'] for ex in database.get_exercices()]) + 1
            database.exercices.insert_one({'name': data['name'], 'id': id})
        else:
            # does already exist
            id = database.get_exercices(name=data['name'])[0]['id']
        database.workouts.update_one(
            {"id": int(data['workout'])},
            {"$push": {"exercices": {'id': id, 'reps': 13, 'sets': 3, 'weight': 0}}})
        return {'success': True, 'id': id}
    else:
        # update exercice already in workout
        workout = database.workouts.find_one({"id": int(data['workout'])})
        exercise_id = data['id']
        if workout:
            for exercise in workout["exercices"]:
                if exercise["id"] == exercise_id:
                    # Update the reps, sets, and weight
                    exercise["reps"] = data['reps']
                    exercise["sets"] = data['sets']
                    exercise["weight"] = data['weight']

                    # Update the document in the collection
                    database.workouts.update_one({"_id": ObjectId(workout['_id'])}, {
                        "$set": {"exercices": workout["exercices"]}})

                    print("Workout item updated successfully.")
                    return {'success': True}
            print("Exercise not found in the workout.")
        else:
            print("Workout not found.")
        return {'success': False}


@app.route('/api/addWorkout', methods=['POST'])
def addWorkout():
    username = request.cookies.get('username')
    new_id = max([workout.to_json()['id']
                 for workout in database.get_workouts()]) + 1
    database.workouts.insert_one({
        'username': username,
        'title': 'New Workout',
        'exercices': [],
        'description': 'A new workout',
        'id': new_id
    })
    return {'success': True}


@app.route('/api/submitExercice', methods=['POST'])
def submitExercice():
    username = request.cookies.get('username')
    user = database.get_user(username=username)
    data = request.get_json(force=True)
    if data['workout_id'] is None:
        data['workout_id'] = None
    else:
        data['workout_id'] = int(data['workout_id'])
    user.register_exercice(**data)
    return {'success': True}


@app.route('/api/editWorkout', methods=['POST'])
def editWorkout():
    data = request.get_json(force=True)
    database.workouts.update_one({'id': data['id']}, {'$set': data})
    print(data)
    return {'success': True}


@app.route('/api/allExercices')
def allExercices():
    exercices = database.get_exercices()
    return {'success': True, 'data': exercices}


@app.route('/api/user_data/active_days/<username>')
def active_days(username):
    return {'success': True, 'data': database.get_user(username=username).active_days()}


@app.route('/api/user_data/prs/<username>')
def prs(username):
    return {'success': True, 'data': database.get_user(username=username).prs()}


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
