from exercices import EXERCICES
import json


class User:
    def __init__(self):
        with open('database/users/data.json', 'r') as f:
            self.data = json.load(f)

    def get_my_exercices(self):
        return self.get_exercices()

    def get_exercices(self, filter=None):
        return [
            exercice(self).to_dict()
            for exercice in EXERCICES
        ]

    def exercice_information(self, id_):
        # latest performance
        for exercice in self.data["workouts"][-1]["exercices"]:
            if exercice['id'] == id_:
                break
        last_exercice = exercice

        # max reps
        max_reps = 0
        for exercice in self.data["workouts"][-1]["exercices"]:
            if exercice['id'] == id_:
                max_reps = max(exercice['reps'], max_reps)

        return {
            "latest_performance": last_exercice,
            "max_reps": max_reps
        }
