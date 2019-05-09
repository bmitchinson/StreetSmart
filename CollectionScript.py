import overpy
import RPi.GPIO as GPIO
import threading
import serial
import string
import pynmea2
import obd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from time import sleep

#connect to the usb OBD port
connection = obd.OBD()

#google auth stuff
cred = credentials.Certificate("/home/pi/IOT/street_smart/streetsmart-2cf68-firebase-adminsdk-z3uo1-d6b17c358a.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

speedArr = [None] * 2
api = overpy.Overpass()

latOff = -0.00017
lonOff = 0.000351

driverStatus = "Good"
driverName = "Tyler"
lat = 0
lon = 0
speed = 0
runTime = 0
reatData = True
speedLimit = 0
#create an int from array
def magic(numList):
    s = ''.join(map(str, numList))
    return int(s)

def maxspeed(latN, lonN, radius):
    lon = "{:.7}".format(lonN)
    lat = str(latN)
    print(lon)
    #lon = str(lonN)
    api = overpy.Overpass()

# fetch all ways and nodes
    result = api.query("""
            way(around:""" + radius + """,""" + lat  + """,""" + lon  + """) ["maxspeed"];
                (._;>;);
                    out body;
                        """)
    #print("result len: " +str( len(result.ways)))
    #if result.ways is not None:
    try:
        way = result.ways[0]
        speedWay = way.tags.get("maxspeed", "n/a")
        speedArr[0] = speedWay[0]
        speedArr[1] = speedWay[1]
        speedLimit = magic(speedArr)
        print("Speed Limit: " + str(speedLimit))
        return speedLimit
    except IndexError:
        return 0

def parseGPS(data):
    #print("Parse GPS: ")
    #print(data[0:6].decode())
    #if '$GPGGA' in str or '$GPRMC' in str:
    if data[0:6].decode() == '$GPGGA':
        print(data)
        #msg = pynmea2.parse(data)
        latArr = data[17:20] + data[22:27]
        print(latArr)
        lonArr = data[31:34] + data[36:41]
        print(lonArr)
        lat = magic(latArr)
        lon = magic(lonArr)
        #lat = lat/100
        #lon = (lon/100)*-1
        print(lat)
        print(lon)
        #speedLimit =  maxspeed(lat, lon, "500")

def getCarOBD():
    cmd = obd.commands.SPEED
    resSpeed = connection.query(cmd)
    speed = str(resSpeed.value.to('mph'))
    speed = float(speed.replace(' mph',''))
    print(speed)
    #print(resSpeed.value.to("mph"))
    #cmd = obd.commands.RUN_TIME
    #resRun = connection.query(cmd)
    #runTime = resRun.value
    #print(runTime)
    return speed

def sendData(driveTime, driver, lat, lon, speed, limit, deltaSpeed):
    #client = firestore.client()
    print("data send")
    if deltaSpeed < 0:
        GPIO.output(40, 0)
    else:
        GPIO.output(40, 1)
    location=firestore.GeoPoint(lat, lon)
    timestamp = firestore.SERVER_TIMESTAMP
    doc_ref = db.collection(u'events').document()
    doc_ref.set({
        u'Battery': 100,
        u'Driver': driver,
        u'Location': location,
        u'RealData': reatData,
        u'Speed': speed,
        u'SpeedLimit': limit,
        u'SpeedStatus': deltaSpeed,
        u'StatusCode': "",
        u'Time': timestamp
    })


ser = serial.Serial()
ser.port = "/dev/ttyAMA0"
ser.baudrate = 115200
ser.timeout = 1
ser.open()
GPIO.setmode(GPIO.BOARD)
GPIO.setup(40,GPIO.OUT)

data = "test"
data.encode()
#gpgga = nmea.GPGGA()
print("start")
while True:
    try:
        data = ser.readline()
    except Exception as e:
        print(e)
        ser.close()
        ser.open()

    if data[0:6].decode('utf-8', 'ignore') == '$GPGGA' and data:
        latArr = data[17:19].decode() + '.' + data[22:27].decode()
        lat = float(latArr)
        #print("Lat OG: " + str(lat))
        lat = lat - (lat * latOff)
        print(lat)
        lonArr = data[31:33].decode() + '.' + data[36:41].decode()
        lon = float(lonArr)
        #print("Lon OG: " + str(lon))
        lon = lon - (lon * lonOff)
        lon = lon * -1
        print(lon)
        speedLimit = maxspeed(lat, lon, '50')
        if speedLimit == 0:
            speedLimit = int(input("Enter a speed limit: "))
        speed = getCarOBD()
        sendData(runTime, driverName, lat, lon, speed, speedLimit, speed - speedLimit)



#serialPort = serial.Serial("/dev/ttyAMA0", 115200, timeout=0.5)
#dataout  = pynmea2.NMEAStreamReader()
# (Lat, Lon)
#speedLimit = maxspeed("41.72854", "-91.63861", "100")
#results = maxspeed("41.7260105", "-91.6422925", "100")
#results = maxspeed("41.3863578", "-91.3359519", "1000")
#41.4171429
#-91.3676123
#serialPort = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
#serialPort.close()
#serialPort.open()

#print("Start")
#while True:
#    try:
        #serialPort = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
        #serialPort.open()
        #dataout  = pynmea2.NMEAStreamReader()
        #serialPort.flushInput()
#        gps_string = serialPort.readline()
#        parseGPS(gps_string)
        #serialPort.close()
        #parseGPS(gps_string)
        #parseGPS(gps_string)
        #results = maxspeed("41.7260105", "-91.6422925", "100")
        #cmd = obd.commands.SPEED
        #resSpeed = connection.query(cmd)
        #speed = resSpeed.value.to("mph")
        #print(speed)
        #print(resSpeed.value.to("mph"))
        #cmd = obd.commands.RUN_TIME
        #resRun = connection.query(cmd)
        #runTime = resRun.value
        #print(runTime)
        #speedLimit = int(input("Enter a speed limit: "))
        #cmd = obd.commands.STATUS
        #res = connection.query(cmd)
        #print(res.value)

        #sendData(runTime, driverName, lat, lon, speed, speedLimit, speed - speedLimit)
        #print("sent data to db")
#        sleep(1)
#    except Exception as e:
#        print(e)
#        serialPort = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
#        sleep(1)
