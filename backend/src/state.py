from typing import TypedDict

class EmailsState(TypedDict):
    emails: list[dict]
    classified_emails: list[dict]