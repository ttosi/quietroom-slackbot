## TODO

### quiet bot node
* desks.js -- move name to id and friendly to name, delete friendly
* need tp check if a required paramter is missing (do in commands.parse)
* refactor plural module names to singular
* timer to monitor how long user has been assigned to a desk
    * if user has been assigned to desk for > 4 hours send reminder
    * if user has been assigned to desk for > 8 hours auto-unassign
    * if they ask for one that is close but not exact match, list the close matches and ask for which one they want
* allow username paramters to be username or full (maybe fuzzy serach?)
* allow deskname to be used with friendly name
* make bot "semi-conversational"
    * if user asks to use a desk when already using one, ask if they'd like to switch to the new desk they requested. Give snide response if they ask to use a desk they're already sitting in.
* conversational responses that accept yes or no.
    * need to have timeout on user resonse?
* implement conifg.js for settings

### quiet bot firmware
* implement config.lua for settings (ssid, psk, server address, port, etc)
