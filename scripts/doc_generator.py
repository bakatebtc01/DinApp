from datetime import datetime

class DocumentationGenerator:
    def __init__(self, file_path: str):
        self._file_path = file_path

    def generate(self, tasks: dict):
        with open(self._file_path, "w") as f:
            f.write("# Summary of Work\n\n")
            f.write(f"Report generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("## Tasks Completed\n\n")
            
            if not tasks:
                f.write("No tasks were tracked.\n")
                return

            total_duration = sum(tasks.values())

            for task, duration in tasks.items():
                f.write(f"- **{task}**: {duration:.2f}s\n")
            
            f.write(f"\n**Total Time: {total_duration:.2f} seconds**\n")

