-- ws2812.writergb(4, string.char(255, 0, 0))

--  Connect to the quiet bot server
conn = net.createConnection(net.TCP, 0)
conn:connect(1337, "127.0.0.1")

--  On successful connection, send the deskid
--  so the server can register it to this device
conn:on("connection", function(conn)
	conn:send("qd1:connect")
end)

--  Execute commamd received from bot server.
conn:on("receive", function(conn, data)
	ws2812.init()
	toggle = false

	if data ~= nill then
		if data == "ACK" then
			--print("ACK")
			tmr.stop(2)
		else
			ws2812.writergb(4, string.char(0, 0, 0))
			tmr.delay(500000)
			--ws2812.writergb(4, string.char(0, 0, 0, 0, 0, 0))

			-- start the interval timer for flashing the leds
			tmr.alarm(5, 300, 1, function()
				if toggle then
					ws2812.writergb(4, string.char(254, 0, 0, 0, 0, 254))
				else
					ws2812.writergb(4, string.char(0, 0, 254, 254, 0, 0))
				end
				toggle = not toggle
			end)

			--clear the led interval after 10 seoncds
			tmr.alarm(6, 10000, 0, function()
				ws2812.writergb(4, string.char(0, 0, 0, 0, 0, 0))
				tmr.stop(5)
			end)

			--ws2812.writergb(4, string.char(255, 0, 0, 255, 0, 0))
		end
	end
end)

-- 	Send heartbeat to server every 5 minutes and wait
--	for an acknowlegdement. If no ACK is received within 15
--	seconds, reconnect (by restarting) to the bot server.
--  This is necessary becuase firewalls often timeout a
--  TCP connection after a set period of time. Might have
--  to adjust the interval based on firewall config.
tmr.alarm(1, 300000, 1, function()
	--print("qd1:heartbeat")
	conn:send("qd1:heartbeat")
	tmr.alarm(2, 15000, 0, function()
		node.restart()
	end)
end)

-- -- i = 0
-- -- while i < 50 do
-- --     ws2812.writergb(4, string.char(0, 0, 255, 255, 0, 0))
-- --     tmr.delay(100000)
-- --
-- --     ws2812.writergb(4, string.char(255, 0, 0, 0, 0, 255))
-- --     tmr.delay(100000)
-- --
-- --     i = i + 1
-- -- end
