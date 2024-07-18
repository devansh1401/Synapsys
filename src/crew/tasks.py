from crewai import Task
from textwrap import dedent

class EmailClassificationTasks:
    def classify_emails_task(self, agent, emails):
        return Task(
            description=dedent(f"""\
                Analyze the following batch of emails and classify each one into one of these categories:
                Important, Promotional, Social, Marketing, Spam, or General.

                Consider the following guidelines:
                - Important: Personal or work-related emails that require immediate attention
                - Promotional: Emails related to sales, discounts, and marketing campaigns
                - Social: Emails from social networks, friends, and family
                - Marketing: Emails related to marketing, newsletters, and notifications
                - Spam: Unwanted or unsolicited emails
                - General: If none of the above categories match

                EMAILS
                -------
                {emails}

                Your final answer MUST be a list of all the email IDs with their corresponding classifications.
                Use the following format:
                - Email ID: [ID], Classification: [Category]
                Also, provide a brief explanation for each classification.
                """),
            agent=agent
        )