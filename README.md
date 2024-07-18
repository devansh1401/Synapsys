# CrewAI + Gmail

## first create a virtual env using conda or pyenv and then process with the steps

if you dont know to to setup here is a [blog](https://alejandro-ao.com/setup-python-development-environment-for-ai/)

-   **Configure Environment**: Copy ``.env.example` and set up the environment variable
-   **Setup a credentials.json**: Follow the [google instructions](https://developers.google.com/gmail/api/quickstart/python#authorize_credentials_for_a_desktop_application), once you’ve downloaded the file, name it `credentials.json` and add to the root of the project, if having trouble refer [this](https://www.youtube.com/watch?v=5eYg1OcHm5k&t=2511s)
-   **Install Dependencies**: Run `pip install -r requirements.txt`
-   **Execute the Script**: Run `python main.py`

## Details & Explanation

-   **Running the Script**: Execute `python main.py`
-   **Key Components**:
    -   `./src/graph.py`: Class defining the nodes and edges.
    -   `./src/nodes.py`: Class with the function for each node.
    -   `./src/state.py`: State declaration.
    -   `./src/crew/agents.py`: Class defining the CrewAI Agents.
    -   `./src/crew/taks.py`: Class definig the CrewAI Tasks.
    -   `./src/crew/crew.py`: Class defining the CrewAI Crew.
    -   `./src/crew/tools.py`: Class implementing the GmailDraft Tool.

## i have modified the code with relevant logs so troubleshooting the issues
