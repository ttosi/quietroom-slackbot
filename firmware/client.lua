-- Define some colors
red = string.char(255, 0, 0)
green = string.char(0, 128, 0)
blue = string.char(0, 0, 255)
yellow = string.char(255, 255, 0)
cyan = string.char(0, 255, 255)
magenta = string.char(255, 0, 255)

toggle = false

-- Initialize the pixels and set them to offline
ws2812.init(ws2812.MODE_SINGLE)
ws2812.write(string.char(0, 0, 0, 0, 0, 0))

--  Connect to the quiet bot server
conn = net.createConnection(net.TCP, 0)
conn:connect(serverport, serveraddress)

--  On successful connection, send the deskid
--  so the server can register it to this device
conn:on("connection", function(conn, c)
	conn:send(deskid ..":".. deskname .."|".. desklocation)
end)

--  Execute commamd received
conn:on("receive", function(conn, data)
	if data ~= nill then
		if data == "ACK" then
			tmr.stop(2)
		else
			-- start the interval timer for flashing the leds
			tmr.alarm(5, 300, 1, function()
				if toggle then
					ws2812.write(string.char(red, blue))
				else
					ws2812.write(string.char(blue, red))
				end
				toggle = not toggle
			end)

			--clear the led interval after X seoncds
			tmr.alarm(6, 20000, 0, function()
				ws2812.write(string.char(0, 0, 0, 0, 0, 0))
				tmr.stop(5)
			end)
		end
	end
end)

-- 	Send heartbeat to server every 10 seconds and wait
--	for an acknowlegdement. If no ACK is received within 2.5
--	seconds, reconnect to the bot server by restarting.
tmr.alarm(1, 10000, 1, function()
	conn:send(deskid .. ":heartbeat")
	tmr.alarm(2, 2500, 0, function()
		node.restart()
	end)
end)
