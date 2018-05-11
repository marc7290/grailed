# grailed
 
Usage Notes:

The project in the chat_node folder starts the server. This is a node.js
project, so a node installation is required.  Some initial configuration
is necessary.  The chat.sql file must be processed into a postgres db
(cmd e.x.: psql -f chat.sql). The database information on line 9 of
queries.js may also need to be changed if your postgres setup differs
from the default.

Once the initial configuration is done the server should run with the
execution of "npm start" at the root of the directory.

Once the server is started, the driver program, also a node project, can
be run with "node driver.js".  This project is a command-line based
interface for the chat API implementation.   If for some reason the API
server needs to be hosted on a different port, the serviceBaseUrl
variable can be changed in driver.js.

The driver will allow you to assume the roles of any user in the
database, set a conversation partner, send a message to the set
conversation partner, view message history with your conversation
partner, and change which user you're logged in as.  One quirk of the
implementation (to cut down on complexity), is the necessity of setting
a conversation partner in order to send a message or view history.

Implementation notes:

I have some exposure to Node.js, but none to any of its networking
features.

There is a decent amount of code that was imported by the frameworks I
chose to use (as Node is wont to do).  The code that I wrote in the
chat_node project is in or wholly the following files:

routes/index.js (partially generated) 
app.js (largely generated) 
chat.sql
queries.js
server.js

As for the chat_driver project, the only file I wrote is driver.js.