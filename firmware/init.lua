if file.open("config.txt", "r") then
	-- Load the config settings. This "object" defines a desk
	-- and is the metadata that's expected by the server
	ssid = file.readline():match("^%s*(.-)%s*$") --regex trims
	psk = file.readline():match("^%s*(.-)%s*$")
	serveraddress = file.readline():match("^%s*(.-)%s*$")
	serverport = file.readline():match("^%s*(.-)%s*$")
	deskid = file.readline():match("^%s*(.-)%s*$")
	deskname = file.readline():match("^%s*(.-)%s*$")
	desklocation = file.readline():match("^%s*(.-)%s*$")
	notificationDuration = ""

	file.close()

	wifi.setmode(wifi.STATION)
	wifi.sta.config(ssid, psk)

	--  Wait until an ip is given by the AP and then
	--  start client.lua
	print("Waiting for IP address...")
	tmr.alarm(0, 1000, 1, function()
		if wifi.sta.getip() ~= nil then
			tmr.stop(0);
			print("IP Address = " .. wifi.sta.getip())
			dofile("client.lua")
		end
	end)
else
	print("ERROR - config.txt could not be opened")
end
