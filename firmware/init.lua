#ws2812.init()

i = 0
while i < 100 do
    ws2812.writergb(4, string.char(0, 0, 255, 255, 0, 0))
    tmr.delay(100000)

    ws2812.writergb(4, string.char(255, 0, 255, 0, 0, 255))
    tmr.delay(100000)

    i = i + 1
end
