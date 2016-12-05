ws2812.init(ws2812.MODE_SINGLE)
buffer = ws2812.newBuffer(4, 3)

buffer:fill(0, 0, 0)
ws2812.write(buffer)

if file.open(".config", "r") then
	-- Load the config settings stored in .config
	ssid = file.readline():match("^%s*(.-)%s*$") --regex does trimming
	psk = file.readline():match("^%s*(.-)%s*$")
	serveraddress = file.readline():match("^%s*(.-)%s*$")
	serverport = file.readline():match("^%s*(.-)%s*$")
	deskid = file.readline():match("^%s*(.-)%s*$")
	deskname = file.readline():match("^%s*(.-)%s*$")
	desklocation = file.readline():match("^%s*(.-)%s*$")

	file.close()

	-- Connect to the AP as a client
	wifi.setmode(wifi.STATION)
	wifi.sta.config(ssid, psk)

	--  Wait until an address is offered by the AP
	--  then start client.lua
	tmr.alarm(0, 1000, 1, function()
		-- An IP has been successuly offered by the AP
		if wifi.sta.getip() ~= nil then
			tmr.stop(0);

			print("")
			print("CONFIGURATION")
			print("ssid => " .. ssid);
			print("server address => " .. serveraddress);
			print("server port => " .. serverport);
			print("deskid => " .. deskid);
			print("desk name => " .. deskname);
			print("desk location => " .. desklocation);
			print("device Address => " .. wifi.sta.getip())

			dofile("client.lua")
		end
	end)
else
	print("ERROR - missing .config")
end
