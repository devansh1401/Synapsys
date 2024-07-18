from textwrap import dedent
from crewai import Agent
from langchain_community.tools.tavily_search import TavilySearchResults

class EmailClassificationAgents():
    def email_classifier_agent(self):
        return Agent(
            role='Email Classification Specialist',
            goal='Classify emails into categories: Important, Promotional, Social, Marketing, Spam, or General',
            backstory=dedent("""\
                As an Email Classification Specialist, you have extensive experience in analyzing
                email content and determining the most appropriate category for each email. Your
                expertise allows you to quickly and accurately classify emails based on their
                content, sender, and other relevant factors."""),
            tools=[TavilySearchResults()],
            verbose=True,
            allow_delegation=False
        )