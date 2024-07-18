from src.graph import WorkFlow

if __name__ == "__main__":
    workflow = WorkFlow()
    result = workflow.run()
    print("Final state:", result)