import time

class TimeTracker:
    def __init__(self):
        self._tasks = {}
        self._start_time = None
        self._task_name = None

    def start(self, task_name: str):
        self._task_name = task_name
        self._start_time = time.time()
        print(f"Starting task: {task_name}...")

    def stop(self):
        if self._start_time is None:
            print("Error: Timer not started.")
            return

        end_time = time.time()
        elapsed_time = end_time - self._start_time
        
        if self._task_name in self._tasks:
            self._tasks[self._task_name] += elapsed_time
        else:
            self._tasks[self._task_name] = elapsed_time
        
        print(f"Finished task: {self._task_name}. Time elapsed: {elapsed_time:.2f}s")
        self._start_time = None
        self._task_name = None

    def get_total_time(self, task_name: str) -> float:
        return self.tasks.get(task_name, 0)

    def get_all_tasks(self) -> dict:
        return self._tasks

    def get_total_duration(self) -> float:
        return sum(self._tasks.values())
