# On-My-Way

Front-End: React-Native, Redux, Google Maps API;
Back-End: Socket.io, Node, Express, Postgres;

User/host have a small difference in views, but most of the views should be the same.
workflow for a user: Create account. Add contacts. Accept invites to events. Accept invites to connect. Opt in to share location info with host.
workflow for a host: Create account. Add contacts. Create events. Add contacts to events. Request location sharing to/from event with event's guests.

Models:

User hasMany Event
Event hasMany User

Trip (Join table between User and Event)

- userId
- eventId
- to_start_time
- to_end_time
- from_start_time
- from_end_time
- from_destination
- status
- type

Contact (through table between User and User)

Proof of Concept: 1 user (host) should be able to see another user's (guest's) location on a map & it should change as the user is moving.
(sockets + maps must work together)
