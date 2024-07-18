from crewai import Crew
from .agents import EmailClassificationAgents
from .tasks import EmailClassificationTasks

class EmailClassificationCrew():
    def __init__(self):
        agents = EmailClassificationAgents()
        self.classifier_agent = agents.email_classifier_agent()

    def kickoff(self, state):
        print("\n### Classifying emails")
        tasks = EmailClassificationTasks()
        crew = Crew(
            agents=[self.classifier_agent],
            tasks=[
                tasks.classify_emails_task(self.classifier_agent, self._format_emails(state['emails']))
            ],
            verbose=True
        )
        result = crew.kickoff()
        
        return {**state, "classified_emails": result}

    def _format_emails(self, emails):
        emails_string = []
        for email in emails:
            arr = [
                f"ID: {email['id']}",
                f"- Thread ID: {email['threadId']}",
                f"- Subject: {email['subject']}",
                f"- Snippet: {email['snippet']}",
                f"- From: {email['sender']}",
                f"--------"
            ]
            emails_string.append("\n".join(arr))
        return "\n".join(emails_string)