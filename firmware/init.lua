-- Start serial comm
--uart.setup(0, 9600, 8, 0, 1, 0)

wifi.setmode(wifi.STATION)
wifi.sta.config("COLUMBIAVIEW", "j3nny$int3rnet")

--  Wait 3 seconds for DHCP then start client script
tmr.alarm(0, 3000, 0, function()
	--print(wifi.sta.getip())
	dofile("client.lua")
end)
