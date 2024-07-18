import os
import time
from datetime import datetime, timedelta

from langchain_community.agent_toolkits import GmailToolkit
from langchain_community.tools.gmail.search import GmailSearch

class Nodes():
    def __init__(self):
        self.gmail = GmailToolkit()

    def check_email(self, state):
        print("# Checking for new emails")
        search = GmailSearch(api_resource=self.gmail.api_resource)
        
        # Get current date
        current_date = datetime.now()
        
       # Calculate the date 1 days ago
        one_days_ago = current_date - timedelta(days=1)
        
        # Calculate the date 1 days ago
        two_days_after = current_date + timedelta(days=2)
        
  # Format the dates as required by Gmail search
        before_date = two_days_after.strftime("%Y/%m/%d")
        after_date = one_days_ago.strftime("%Y/%m/%d")
        
  # Construct the search query
        search_query = f'in:inbox after:{after_date} before:{before_date}'
        
        print(f"Searching emails with query: {search_query}")
        emails = search(search_query)
        
        all_emails = []
        
        print("### All Accessed Emails:")
        for email in emails[:15]:  # Limit to 15 emails
            email_info = {
                "id": email['id'],
                "threadId": email['threadId'],
                "snippet": email['snippet'],
                "sender": email["sender"],
                "subject": email.get("subject", "No Subject")
            }
            all_emails.append(email_info)
            print(f"ID: {email_info['id']}, Thread ID: {email_info['threadId']}, From: {email_info['sender']}, Subject: {email_info['subject']}, Snippet: {email_info['snippet'][:50]}...")
        
        return {
            **state,
            "emails": all_emails,
        }

    def wait_next_run(self, state):
        print("## Waiting for 20 minutes before checking for new emails again")
        time.sleep(1200)
        return state

    def new_emails(self, state):
        if len(state['emails']) == 0:
            print("## No emails found")
            return "end"
        else:
            print(f"## {len(state['emails'])} emails found")
            return "continue"