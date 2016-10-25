
-- Define pixel colors
red =   { 0, 255, 0 }
blue =  { 0, 0, 255 }
green = { 255, 0, 0 }
black = { 0, 0, 0 }
white = { 128, 128, 128 }

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
			print("command received => " .. data)
			toggle = false

			if(data == "911") then
				-- Start the interval timer for flashing the leds
				tmr.alarm(5, 90, 1, function ()
					if toggle then
						buffer:set(1, red)
						buffer:set(2, red)
						buffer:set(3, blue)
						buffer:set(4, blue)
					else
						buffer:set(1, blue)
						buffer:set(2, blue)
						buffer:set(3, red)
						buffer:set(4, red)
					end

					toggle = not toggle
					ws2812.write(buffer)
				end)
			end

			if(data == "yell") then
				tmr.alarm(5, 300, 1, function ()
					if toggle then
						buffer:fill(128, 128, 0)
					else
						buffer:fill(0, 0, 0)
					end

					toggle = not toggle
					ws2812.write(buffer)
				end)
			end

			if(data == "call") then
				tmr.alarm(5, 1250, 1, function ()
					if toggle then
						buffer:fill(0, 128, 128)
					else
						buffer:fill(0, 0, 0)
					end

					toggle = not toggle
					ws2812.write(buffer)
				end)
			end

			-- Clear the led interval after X seconds;
			-- currently set to be enabled for 20 seconds
			tmr.alarm(6, 10000, 0, function()
				buffer:fill(0, 0, 0)
				ws2812.write(buffer)
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
