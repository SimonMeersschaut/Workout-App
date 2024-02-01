from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import json_util
from datetime import datetime
import json
import time


def parse_json(data):
    return json.loads(json_util.dumps(data))


def remove_duplicates(data: list):
    print(data)
    return [dict(t) for t in set(tuple(sorted(d.items())) for d in data)]

class Database:
    def __init__(self):
        self.uri = "mongodb+srv://WorkoutApp:M3KPJFbpWSxuAoOX@workout-cluser.a7drput.mongodb.net/?retryWrites=true&w=majority"

    def connect(self):
        self.client = MongoClient(self.uri, server_api=ServerApi('1'))
        self.db = self.client["Workout-Cluser"]
        self.users = self.db['users']
        self.workouts = self.db['workouts']
        self.exercices = self.db['exercices']
        # self.workout_collection = self.

        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

    def get_user(self, username: str):
        return User(username, self)

    def get_workouts(self, **kwargs):
        # username, workout_id
        return [Workout(workout) for workout in self.workouts.find(kwargs)]

    def get_workout(self, user, workout_id):
        results = self.get_workouts(id=workout_id)
        if len(results) == 1:
            return results[0].to_json(user)
        else:
            # len == 0 | len > 1
            return {'message': 'workout not found.'}

    def get_exercices(self, **kwargs):
        return [Exercice(exercice).to_json() for exercice in self.exercices.find(kwargs)]

    def get_exercice(self, **kwargs):
        results = self.get_exercices(**kwargs)
        if len(results) == 1:
            return results[0]
        else:
            # len == 0 | len > 1
            return {}

    def register_exercice(self, username, exercice_name=None, exercice_id=None, weight=0, sets=0, reps=0, workout_id=None, timestamp: int = None):
        if timestamp is None:
            timestamp = int(time.time())
        if (exercice_id is None and exercice_name is not None):
            exercice_id = database.get_exercice(name=exercice_name)['id']
        new_exercice_item = {
            'id': int(exercice_id), "timestamp": timestamp,
            'weight': weight, 'sets': sets, 'reps': reps,
            'workout_id': workout_id
        }
        self.users.update_one(
            {"name": username},
            {"$push": {"exercices": new_exercice_item}}
        )


database = Database()
database.connect()


class User:
    def __init__(self, username, db):
        self.username = username
        self.db = db

    def register_exercice(self, **kwargs):
        self.db.register_exercice(
            username=self.username, **kwargs)

    def get_exercices(self) -> list:
        return self.db.users.find({'name': self.username})[0]['exercices']

    def active_days(self) -> list:
        data_list = self.get_exercices()
        current_month = datetime.now().month
        days_found = set()

        for entry in data_list:
            timestamp = entry.get('timestamp', 0)
            date_object = datetime.fromtimestamp(timestamp)

            if date_object.month == current_month:
                days_found.add(date_object.day)

        return sorted(days_found)

    def prs(self) -> list:
        prs = {}

        data_list = self.get_exercices()
        for exercice in data_list:
            if exercice['weight'] != 0:
                # do not include calesthenics
                name = database.get_exercice(
                    id=exercice['id'])['name']
                update_dict = {'type': 'weight',
                               'value': exercice['weight'], 'name': name, 'reps': exercice['reps']}
                if not (exercice['id'] in prs):
                    # create new
                    prs.update({exercice['id']: update_dict})
                elif (exercice['weight'] is not None and prs[exercice['id']]['value'] is not None) and exercice['weight'] > prs[exercice['id']]['value']:
                    # update existing item
                    prs.update({exercice['id']: update_dict})
        return prs


class Exercice:
    def __init__(self, data):
        self.data = data

    def to_json(self, user=None, workout_id=None):
        if user and workout_id:
            self.data['done'] = False
            try:
                user_exercices = user.get_exercices()
            except IndexError:
                # no exercices found in MongoDB
                user_exercices = []
                # return self.data
            for exercice in user_exercices:
                exer = bool(exercice['id'] == self.data['id'])
                if exer:
                    # if right exercice
                    if exercice['workout_id'] is None:
                        # if exercice was out of any workout, count it
                        workout = True
                    else:
                        workout = bool(
                            int(exercice['workout_id']) == int(workout_id))
                    time_diff = bool(
                        time.time() - exercice['timestamp'] < 24*60*60)
                    self.data.update({'reps': exercice['reps'], 'sets': exercice['sets'], 'weight': exercice['weight']})
                    if workout and time_diff:
                        self.data['done'] = True
        global_data = database.exercices.find({'id': self.data['id']})[0]
        self.data.update(global_data)
        try:
            del self.data['_id']
        except KeyError:
            pass
        return self.data


class Workout:
    def __init__(self, data, auto_set=True):
        self.auto_set = auto_set # automatically set the weight to the last one
        self.data = data
        self.exercices = data['exercices']

    def to_json(self, user=None):
        self.data['exercices'] = sorted(self.load_exercices(user), key=lambda exercice: exercice['name'])
        self.data['exercices'] = remove_duplicates(self.data['exercices'])
        try:
            del self.data['_id']
        except KeyError:
            pass
        print(self.data)
        return self.data

    def load_exercices(self, user) -> list:
        return [Exercice(exercice).to_json(user, self.data['id']) for exercice in self.exercices]
