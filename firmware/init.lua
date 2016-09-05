uart.setup(0, 9600, 8, 0, 1, 0)
print("initialzed")

if file.open("config.lua", "r") then
	settings = file.readline()
	file.close()

	ssid, psk, deskname = string.match(settings, "ssid={(.+)}:psk={(.+)}:deskname={(.+)}")
    print("ssid: ", ssid)
    print("psk: ", psk)

    wifi.setmode(wifi.STATION)
	wifi.sta.config(ssid, psk)

	tmr.alarm(0, 3000, 0, function()
		--dofile("client.lua")
        print("client started")

	end)
end
