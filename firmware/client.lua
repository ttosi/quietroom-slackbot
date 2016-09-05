print("client started")

--  Connect to the quiet bot server
conn = net.createConnection(net.TCP, 0)
conn:connect(1337, "tdc2.turningdigital.com")

--  On successful connection, send the deskid
--  so the server can register it to this device
conn:on("connection", function(conn)
	conn:send(u .. ":" .. p)
end)

--  Alert commamd has been recieved from server. Don't
--  feel like learning LUA OOP so this implements the
--  command execution via if then (LUA doesn't have a switch
--  statment)
conn:on("receive", function(conn, data)
	if data ~= nill then
		if data == "ACK" then
			tmr.stop(2)
		else
			for param in string.gmatch(data, "(%w+)") do
				uart.write(0, string.char(param))
			end
			uart.write(0, string.char(10))
		end
	end
end)

-- 	Send heartbeat to server every 5 minutes and wait
--	for an acknowlegdement. If no ACK is received within 15
--	seconds, restart and reconnect to the bot server.
--  This is necessary becuase firewalls often timeout a
--  TCP connection after a set period of time. Might has
--  to adjust the interval based on firewall config.
tmr.alarm(1, 300000, 1, function()
	conn:send(u .. ":heartbeat")
	tmr.alarm(2, 15000, 0, function()
		node.restart()
	end)
end)

-- i = 0
-- while i < 50 do
--     ws2812.writergb(4, string.char(0, 0, 255, 255, 0, 0))
--     tmr.delay(100000)
--
--     ws2812.writergb(4, string.char(255, 0, 0, 0, 0, 255))
--     tmr.delay(100000)
--
--     i = i + 1
-- end
