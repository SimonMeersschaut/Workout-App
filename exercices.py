class Exercice:
    def __init__(self, user):
        self.user = user

        self.weight = None
        self.reps = None
        self.sets = 3

        self.initialize()

    def initialize(self):
        self.last_performance = self.user.exercice_information(
            type(self).ID
        )['latest_performance']
        self.weight = self.last_performance['weight']
        self.reps = self.last_performance['reps']
        if self.reps >= 15:
            self.reps = 8
            self.weight = self.weight + 2.5
        elif self.reps >= 10:
            self.reps = 15
        else:
            self.reps = 8

    def to_dict(self):
        return {
            "id": type(self).ID,
            "name": type(self).NAME,
            "weight": self.weight,
            "target_reps": self.reps,
            "sets": self.sets,
            "EST": None,
            "1RM": None
        }


class PushUp(Exercice):
    ID = 1
    NAME = "Push Up"

    def initialize(self):
        info = self.user.exercice_information(
            type(self).ID
        )
        if info['max_reps'] == info['latest_performance']['reps']:
            self.reps = info['max_reps'] + 1
        else:
            self.reps = info['max_reps']


EXERCICES = [PushUp]
