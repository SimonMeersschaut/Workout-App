import tkinter as tk
from tkinter import ttk, messagebox


class WorkoutAppGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Workout App")

        self.workouts = {
            "Full Body": ["Push-ups", "Squats", "Plank", "Lunges"],
            "Cardio": ["Running", "Jumping Jacks", "Burpees", "Cycling"],
            "Upper Body": ["Bench Press", "Bicep Curls", "Pull-ups", "Shoulder Press"],
        }

        self.completed_exercises = []

        self.category_var = tk.StringVar()
        self.exercise_var = tk.StringVar()

        self.create_widgets()

    def create_widgets(self):
        self.create_menu_bar()

        tk.Label(self.root, text="Select Workout Category:").pack(pady=10)
        category_menu = tk.OptionMenu(
            self.root, self.category_var, *self.workouts.keys())
        category_menu.pack()

        tk.Button(self.root, text="Show Exercises",
                  command=self.show_exercises).pack(pady=10)
        tk.Label(self.root, text="Select Exercise:").pack(pady=10)

        exercise_menu = tk.OptionMenu(self.root, self.exercise_var, "")
        exercise_menu.pack()

        tk.Button(self.root, text="Mark Completed",
                  command=self.mark_completed).pack(pady=10)
        tk.Button(self.root, text="View Completed Exercises",
                  command=self.view_completed).pack(pady=10)

    def create_menu_bar(self):
        menubar = tk.Menu(self.root)

        file_menu = tk.Menu(menubar, tearoff=0)
        file_menu.add_command(label="New Workout",
                              command=self.new_workout)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.destroy)

        help_menu = tk.Menu(menubar, tearoff=0)
        help_menu.add_command(label="About", command=self.show_about)

        menubar.add_cascade(label="File", menu=file_menu)
        menubar.add_cascade(label="Help", menu=help_menu)

        self.root.config(menu=menubar)

    def new_workout(self):
        result = messagebox.askyesno(
            "New Workout", "Are you sure you want to start a new workout?")
        if result:
            self.completed_exercises = []
            messagebox.showinfo(
                "New Workout", "New workout started. Let's get moving!")

    def show_about(self):
        messagebox.showinfo("About Workout App",
                            "Workout App v1.0\n"
                            "A simple workout app with a GUI.\n"
                            "Developed by [Your Name]")

    def show_exercises(self):
        category = self.category_var.get()
        exercises = self.workouts.get(category, [])
        self.exercise_var.set("")  # Clear previous selection

        menu = self.root.nametowidget(
            self.root.winfo_children()[-2])  # Get exercise menu
        menu["menu"].delete(0, "end")  # Clear previous menu items

        for exercise in exercises:
            menu["menu"].add_command(
                label=exercise, command=tk._setit(self.exercise_var, exercise))

    def mark_completed(self):
        exercise = self.exercise_var.get()
        if exercise:
            self.completed_exercises.append(exercise)
            messagebox.showinfo("Success", f"You completed: {exercise}")
        else:
            messagebox.showwarning("Warning", "Please select an exercise.")

    def view_completed(self):
        completed_str = "\n".join(
            self.completed_exercises) if self.completed_exercises else "No exercises completed yet."
        messagebox.showinfo("Completed Exercises", completed_str)


if __name__ == "__main__":
    root = tk.Tk()
    app = WorkoutAppGUI(root)
    root.mainloop()
