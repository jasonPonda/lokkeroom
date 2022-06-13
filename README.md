# Lokkeroom

## Mission objectives

You have been asked by several sports club to create a platform so that team member could share message with their team, and their team only! Your platform would allow coaches from a team to create a message lobby. Once their lobby is created coaches (admin) can add users to their team so they can access the lobby.

All information has to be stored in a PostgreSQL database.

All the below features have to be implemented in the form of a REST API, this API should only return JSON not HTML!

🌱 Must have features

- Users can sign up using an email and a password
- Users can log in using their email and password
- User can create a message lobby (and become the admin of said lobby)
- Users can view message from their lobby
- Users can post message on their lobby
- Users can edit their own message

🌼 Nice to have features (doable)

- Admin can delete message in their lobby
- Admin can edit message in their lobby
- Implement a pagination system

🌳 Nice to haves (hard)

- Users can join multiple teams
- Implement a direct message system (user to user message)
- Try to implement Anti-bruteforce (ex: people cannot attempt more than 5 failed logins/hour)
- Admins can add people that have not yet registered to the platform.