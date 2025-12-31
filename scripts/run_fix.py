import time
from tracker import TimeTracker
from doc_generator import DocumentationGenerator

def main():
    tracker = TimeTracker()
    
    # Simulate the work done in the previous turn
    tracker.start("Fixing Android Build")
    time.sleep(5)  # Simulating the time spent on fixing the build
    tracker.stop()

    tracker.start("Adding File Manager Feature")
    time.sleep(8)  # Simulating the time spent on adding the feature
    tracker.stop()

    # Generate the documentation
    doc_generator = DocumentationGenerator("WHAT_WAS_CREATED.md")
    doc_generator.generate(tracker.get_all_tasks())

    print("Successfully generated WHAT_WAS_CREATED.md")

if __name__ == "__main__":
    main()
