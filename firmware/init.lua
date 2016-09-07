if file.open("config.txt", "r") then
	-- Load the config settings. This "object" defines a desk
	-- and is the metadata that's expected by the server
	ssid = file.readline()
	psk = file.readline()
	serveraddress = file.readline()
	deskid = file.readline()
	deskname = file.readline()
	desklocation = file.readline()

	print(ssid .. " " .. psk .. " " .. serveraddress .. " " .. deskid)

	file.close()

	wifi.setmode(wifi.STATION)
	--wifi.sta.config(ssid, psk)
	wifi.sta.config("ARM\ Insight", "4rm1n516h7")

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
	print("FATAL ERROR - config.txt could not be opened. Does it exist?")
end
