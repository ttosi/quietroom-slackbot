## TODO & BUGS
### quietbot server
* ~~refactor desks.js -> -- change property name to id and friendly to name, delete friendly~~
* ~~need to check if a parameter is required (do in commands.parse)~~
* refactor plural module names to singular
* timer to monitor how long user has been assigned to a desk
	* if user has been assigned to desk for > 8 hours auto-unassign
	* if user has been assigned to desk for > 4 hours send reminder
* must be @user ~~allow username parameters to be username or full name (maybe fuzzy serach?) - if no exact match list matches~~
* must be by deskId ~~allow deskname to be searched by  name~~
* ~~make bot "semi-conversational"~~
	* ~~if user asks to use a desk when already using one, ask if they'd like to switch to the new desk they requested. Give snide response if they ask to use a desk they're already sitting in.~~
	* ~~if they ask for a desk that is matches closely, but not exactly, list the matches and prompt for which one they want~~
	* ~~conversational responses that accept yes or no.~~
	* need to have timeout on user response?
* ~~implement conifg.js for settings and/or .env~~
* ~~move commands implementation to commands.js, rename commands.js -> command.js~~
* in console output, show username along with slack id

### quietbot firmware
* ~~implement config.lua for settings (ssid, psk, server address, port, etc)~~

### quietbot protocol
* ~~poll or detect when the deskbot has been disconnected~~

### bugs
