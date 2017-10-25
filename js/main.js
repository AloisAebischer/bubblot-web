/*jshint esversion: 6 */
angular.module('bubblot', []).controller('mainController', ['$scope', '$element', '$timeout', '$interval', function ($scope, $element, $timeout, $interval) {
    var mainVm = this,
        serial = '',
        digitalio,
        digitalIoState = 64,
        servo1,
        servo2,
        servo3,
        servo4,
        tilt1,
        tilt2,
        compass,
        latitude,
        divHorizon,
        divHorizon2,
        div3DConnexion,
        div3DConnexion2,
        computeStyle = '',
        transitionTimeout,
        captureTimeout,
        receivedPitch = false,
        receivedRoll = false,
        receivedCompass = false,
        spacerx = 50,
        spacery = 50,
        errmsg = new YErrorMsg(),
        spwDataMax = 5000,
        VSP1Radius = 0,
        VSP1Angle = 0,
        VSP1AngleServo1 = 0,
        VSP1AngleServo2 = 0,
        VSP2Radius,
        VSP2Angle,
        VSP2AngleServo1,
        VSP2AngleServo2,
        VSP3Radius,
        VSP3Angle,
        VSP3AngleServo1,
        VSP3AngleServo2,
        VSP4Radius,
        VSP4Angle,
        VSP4AngleServo1,
        VSP4AngleServo2;

    $scope.leftData = {
        focusLeftIndex: 0,
        positionClass: ["focus-left", "left-one", "left-two", "left-three", "left-four"],
        focusOrigClass: "left-five",
        horizonPitch: 0,
        horizonRoll: 0,
        twistLeft: false,
        twistRight: false,
        threeDAngle: 30,
        turbidity: 0.2,
        turbidityRed: 0.2,
        turbidityBlue: 0.2,
        turbidityGreen: 0.2,
        magnetism: 0.5,
        computeVa: false,
        vaData: [],
        pumpOn: false,
        filledOk: false,
        help: false
    };
    $scope.rightData = {
        focusRightIndex: 0,
        positionClass: ["focus-right", "right-one", "right-two", "right-three", "right-four"],
        focusOrigClass: "right-five",
        depth: 0.3,
        security: 60,
        securityAlert: false,
        ballastFill: 30,
        thrust: 0,
        thrustTopSwitchOn: true,
        thrustBottomSwitchOn: true,
        thrustDragOn: false,
        engine1Angle: -90,
        engine1Radius: 0,
        engine2Angle: -45,
        engine2Radius: 0,
        engine3Angle: 45,
        engine3Radius: 0,
        engine4Angle: 180,
        engine4Radius: 0,
        angleB1: 30,
        angleB2: 240,
        angleB3: 90,
        angleStorage: 30,
        angleNorth: 180,
        distancexToPump: 20,
        distanceyToPump: 20,
        spotlightIntensity: 75,
        foglightIntensity: 75,
        spotlightSwitchOn: true,
        foglightSwitchOn: true,
        cameraRec: false,
        cameraRecMenu: true,
        cameraPlay: false,
        help: false
    };
    $scope.leftDataPump = {
        focusLeftIndex: 0,
        positionClass: ["focus-left", "left-one"],
        focusOrigClass: "left-two",
        gpsCompass: -15,
        localLat: 12.583967,
        localLong: 32.985734,
        targetLat: 46.123432,
        targetLong: 36.023563,
        horizonPitch: 0,
        horizonRoll: 0

    };
    $scope.rightDataPump = {
        focusRightIndex: 0,
        positionClass: ["focus-right", "right-one", "right-two"],
        focusOrigClass: "right-three",
        powerNeedleAngle: 0,
        thrust: 0,
        depth: 0.7,
        security: 40,
        securityAlert: false,
        ballastFill: 70,
        thrust: 0.2,
        isCtrl: false,
        help: false
    };
    $scope.winderData = {
        mainControl: 0,
        winderControl1: 0,
        winderControl2: 0,
        winderControl3: 0,
        winderControl4: 0,
        winderLength1: 0,
        winderSpeed1: 0,
        pressure1: 0.93,
        minPressure1: 0.8,
        pressureAlert1: false,
        winderAlert1: false,
        reset1: false,
        winderLength2: 0,
        winderSpeed2: 0,
        pressure2: 0.97,
        minPressure2: 0.7,
        pressureAlert2: false,
        winderAlert2: false,
        reset2: false,
        winderLength3: 0,
        winderSpeed3: 0,
        pressure3: 0.95,
        minPressure3: 0.6,
        pressureAlert3: false,
        winderAlert3: false,
        reset3: false,
        winderLength4: 0,
        winderSpeed4: 0,
        pressure4: 0.9,
        minPressure4: 0.9,
        pressureAlert4: false,
        winderAlert4: false,
        reset4: false,
        railMode: false,
        railLength: 0,
        railAlert: false,
        help: false
    };
    $scope.mapData = {
        displayFe: false,
        displayPb: false,
        displayCu: false,
        displaySn: false,
        displayPath: true,
        displayVa: true,
        displayMovie: false,
        displayMagn: false,
        displayTurbi: false,
        extractingData: false,
        bubblots: [],
        bubblotCursor: 1,
        dates: [],
        dateCursor: [],
        latitudeCursor: [],
        longitudeCursor: [],
        depthCursor: [],
        tempCursor: [],
        dataxPump: [],
        datayPump: [],
        datax: new Array(3),
        datay: new Array(3),
        isVa: new Array(3),
        isFe: new Array(3),
        isPb: new Array(3),
        isCu: new Array(3),
        isSn: new Array(3),
        infoVa: [],
        isMovie: new Array(3),
        avgMagnetism: new Array(3),
        infoMagnetism: [],
        isTurbi: new Array(3),
        avgTurbi: new Array(3),
        infoTurbiRed: [],
        infoTurbiGreen: [],
        infoTurbiBlue: [],
        zoom: 1,
        xImage: 0,
        yImage: 0,
        xNew: 0,
        yNew: 0,
        xLast: 0,
        yLast: 0,
        vaCursor: false,
        turbiCursor: false,
        magnCursor: false,
        movieCursor: false,
        updatePanel: false
    };
    $scope.notifData = {
        bubblotSecurity: false,
        bubblotTwistLeft: false,
        bubblotTwistRight: false,
        audioBubblot: false,
        pumpSecurity: false,
        audioPump: false,
        winderPressure1: false,
        winderReset1: false,
        winderPressure2: false,
        winderReset2: false,
        winderPressure3: false,
        winderReset3: false,
        winderPressure4: false,
        winderReset4: false,
        audioWinder: false,
        recData: false,
        help: false
    };
    var bubblot1YoctoModules = {
        yPwmOutput1_LedTop: null,
        yPwmOutput1_LedBottom: null,
        yPwmOutput2_Jabsco: null,
        yGenericSensor_Security: null,
        yGenericSensor_Depth: null,
        yDigitalIO: null,
        yTilt_Roll: null,
        yTilt_Pitch: null,
        yCompass: null,
        yQt_gx: null,
        yQt_gy: null,
        yQt_gz: null,
        yServo1_Camera: null,
        yServo1_VSPTopLeft_1: null,
        yServo1_VSPTopLeft_2: null,
        yServo1_VSPTopRight_1: null,
        yServo1_VSPTopRight_2: null,
        yServo2_Thrust: null,
        yServo2_VSPBottomLeft_1: null,
        yServo2_VSPBottomLeft_2: null,
        yServo2_VSPBottomRight_1: null,
        yServo2_VSPBottomRight_2: null,
        yGps_Longitude: null,
        yGps_Latitude: null,
        yColorLedCluster_Turbidity: null,
        yTemperature: null,
        yAnButton_turbidity: null
    }

    var serialBubblot1 = {
        yPwmOutput1: 'PWM1_12345',
        yPwmOutput2: 'PWM2_12345',
        yGenericSensor: 'RX010V_12345',
        yDigitalIO: 'MAXIO_12345',
        y3d: 'Y3DMK002-A6AB2',
        yGps: 'GPS_12345',
        yServo1: 'SERVORC1-510C2',
        //yServo2: 'SERVORC1-510C2',
        yColorLedCluster: 'YRGBLED2-7F244',
        yTemperature: 'TMPSENS1-68156',
        yAnButton: 'YBUTTON1-80841',
    }

    var pumpYoctoModules = {
        yGenericSensor_Security: null,
        yGenericSensor_Depth: null,
        yDigitalIO: null,
        yTilt_Roll: null,
        yTilt_Pitch: null,
        yCompass: null,
        yServo1_VSPTopLeft_1: null,
        yServo1_VSPTopLeft_2: null,
        yServo1_VSPTopRight_X: null,
        yServo1_VSPTopRight_Y: null,
        yServo2_Thrust: null,
        yServo2_VSPBottomLeft_X: null,
        yServo2_VSPBottomLeft_Y: null,
        yServo2_VSPBottomRight_X: null,
        yServo2_VSPBottomRight_Y: null,
        yGps_Longitude: null,
        yGps_Latitude: null,
        yPwmOutput_pump: null,
    }

    var serialPump = {
        yPwmOutput: 'YPWMTX01-4FFB9',
    }

    var winderYoctoModules = {
        yRelay1_Winder1Direction: null,
        yRelay1_Winder1Brake: null,
        yPwmOutput1_Winder1Speed: null,
        yPwmInput1_Winder1Length: null
    }

    var serialWinder = {
        yRelay1: 'RELAYLO1-79765',
        yPwmOutput1: 'YPWMTX01-4FFB9',
        yPwmInput1: 'YPWMRX01-79FB9'
    }

    function connectYoctoBubblot(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + ipaddress + ':4444', errmsg);
        }
            ).then((res) => {
                if (res != YAPI.SUCCESS) {
                    console.log('Cannot contact VirtualHub on ' + ipaddress + ': ' + errmsg.msg);
                    return;
                }
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to tilt module
                modules.yTilt_Roll = YTilt.FindTilt(serials.y3d + ".tilt1");
                modules.yTilt_Roll.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.y3d + ".tilt1");
                        modules.yTilt_Roll.registerValueCallback(computeRoll);
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".tilt1");
                    }
                })
                modules.yTilt_Pitch = YTilt.FindTilt(serials.y3d + ".tilt2");
                modules.yTilt_Pitch.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.y3d + ".tilt2");
                        modules.yTilt_Pitch.registerValueCallback(computePitch);
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".tilt2");
                    }
                })
                //Connexion to compass module
                modules.yCompass = YCompass.FindCompass(serials.y3d + ".compass");
                modules.yCompass.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.y3d + ".compass");
                        modules.yCompass.registerValueCallback(computeCompass);
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".compass");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to GPS module
                modules.yGps_Latitude = YGps.FindGps(serials.yGps + ".latitude");
                modules.yGps_Latitude.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yGps + ".latitude");
                        modules.yGps_Latitude.registerValueCallback(computeLatitude);
                    }
                    else {
                        console.log("Can't find module " + serials.yGps + ".latitude");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connextion to Digital-IO module
                modules.yDigitalIO = YDigitalIO.FindDigitalIO(serials.yDigitalIO + ".digitalIO");
                modules.yDigitalIO.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yDigitalIO + ".digitalIO");
                        modules.yDigitalIO.set_portDirection(252);
                        modules.yDigitalIO.set_portPolarity(0); // polarity set to regular
                        modules.yDigitalIO.set_portOpenDrain(3);
                        modules.yDigitalIO.get_portState().then((value) => {
                        });
                    }
                    else {
                        console.log("Can't find module " + serials.yDigitalIO + ".digitalIO");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to servo 1 module 
                modules.yServo1_Camera = YServo.FindServo(serials.yServo1 + ".servo1");
                modules.yServo1_Camera.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yServo1 + ".servo1");
                    }
                    else {
                        console.log("Can't find module " + serials.yServo1 + ".servo1");
                    }
                })
                modules.yServo1_VSPTopLeft_1 = YServo.FindServo(serials.yServo1 + ".servo2");
                modules.yServo1_VSPTopLeft_1.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log("Using module " + serials.yServo1 + ".servo2");
                        modules.yServo1_VSPTopLeft_1.set_position(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo1 + ".servo2");
                    }
                })
                modules.yServo1_VSPTopLeft_2 = YServo.FindServo(serials.yServo1 + ".servo3");
                modules.yServo1_VSPTopLeft_2.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yServo1 + ".servo3");
                        modules.yServo1_VSPTopLeft_2.set_position(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo1 + ".servo3");
                    }
                })
                modules.yServo2_Thrust = YServo.FindServo(serials.yServo1 + ".servo4");
                modules.yServo2_Thrust.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yServo1 + ".servo4");
                        modules.yServo2_Thrust.set_position(-1000);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo1 + ".servo4");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to temperature module
                modules.yTemperature = YTemperature.FindTemperature(serials.yTemperature + ".temperature");
                modules.yTemperature.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device ' + serials.yTemperature + ".temperature");
                        modules.yTemperature.registerValueCallback(computeTemp);
                    }
                    else {
                        console.log("Can't find module " + serials.yTemperature + ".temperature");
                    }
                })
            }
            );
        var YAPI2 = _yocto_api.YAPI;
        YAPI2.LogUnhandledPromiseRejections().then(() => {
            return YAPI2.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI2.RegisterHub('http://' + 'localhost' + ':4444', errmsg);
        }
            ).then((res) => {
                if (res != YAPI2.SUCCESS) {
                    console.log('Cannot contact VirtualHub on ' + 'localhost' + ':4444' + errmsg.msg);
                    return;
                }
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to gyro x module
                modules.yQt_gx = YQt.FindQt(serials.y3d + ".w");
                modules.yQt_gx.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device ' + serials.y3d + ".w");
                        modules.yQt_gx.set_logicalName("gx").then(() => {
                            modules.yQt_gx.registerValueCallback(computeGyroX);
                            console.log('Device ' + serials.y3d + ".w renamed " + serials.y3d + ".gx");
                        })
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".w");
                    }
                })
                //Connexion to gyro y module
                modules.yQt_gy = YQt.FindQt(serials.y3d + ".x");
                modules.yQt_gy.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device ' + serials.y3d + ".x");
                        modules.yQt_gy.set_logicalName("gy").then(() => {
                            modules.yQt_gy.registerValueCallback(computeGyroY);
                            console.log('Device ' + serials.y3d + ".x renamed " + serials.y3d + ".gy");
                        })
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".x");
                    }
                })
                //Connexion to gyro z module
                modules.yQt_gz = YQt.FindQt(serials.y3d + ".y");
                modules.yQt_gz.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device ' + serials.y3d + ".y");
                        modules.yQt_gz.set_logicalName("gz").then(() => {
                            modules.yQt_gz.registerValueCallback(computeGyroZ);
                            console.log('Device ' + serials.y3d + ".y renamed " + serials.y3d + ".gz");
                        })
                    }
                    else {
                        console.log("Can't find module " + serials.y3d + ".y");
                    }
                })
            }
            );
    }

    function connectYoctoPump(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        console.log(ipaddress, serials, modules);
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + ipaddress + ':4444', errmsg);
        }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to Pwm Tx module
                modules.yPwmOutput_pump = YPwmOutput.FindPwmOutput(serials.yPwmOutput + ".pwmOutput1");
                modules.yPwmOutput_pump.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yPwmOutput + ".pwmOutput1");
                        modules.yPwmOutput_pump.set_frequency(20000);
                        modules.yPwmOutput_pump.set_enabled(Y_ENABLED_TRUE);
                        modules.yPwmOutput_pump.set_dutyCycle(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmOutput + ".pwmOutput1");
                    }
                })
            }
            );
    }

    function connectYoctoWinder(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + ipaddress + ':4444', errmsg);
        }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to relay module
                modules.yRelay1_Winder1Direction = YRelay.FindRelay(serials.yRelay1 + ".relay1");
                modules.yRelay1_Winder1Direction.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yRelay1 + ".relay1");
                    }
                    else {
                        console.log("Can't find module " + serials.yRelay1 + ".relay1");
                    }
                })
                modules.yRelay1_Winder1Brake = YRelay.FindRelay(serials.yRelay1 + ".relay2");
                modules.yRelay1_Winder1Brake.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yRelay1 + ".relay2");
                        modules.yRelay1_Winder1Brake.set_state(true);
                    }
                    else {
                        console.log("Can't find module " + serials.yRelay1 + ".relay2");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to PWM output module
                modules.yPwmOutput1_Winder1Speed = YPwmOutput.FindPwmOutput(serials.yPwmOutput1 + ".pwmOutput1");
                modules.yPwmOutput1_Winder1Speed.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yPwmOutput1 + ".pwmOutput1");
                        modules.yPwmOutput1_Winder1Speed.set_frequency(5000);
                        modules.yPwmOutput1_Winder1Speed.set_enabled(Y_ENABLED_TRUE);
                        modules.yPwmOutput1_Winder1Speed.set_dutyCycle(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmOutput1 + ".pwmOutput1");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to PWM input module
                modules.yPwmInput1_Winder1Length = YPwmInput.FindPwmInput(serials.yPwmInput1 + ".pwmInput1");
                modules.yPwmInput1_Winder1Length.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using module ' + serials.yPwmInput1 + ".pwmInput1");
                        modules.yPwmInput1_Winder1Length.resetCounter();
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmInput1 + ".pwmInput1");
                    }
                });
            }
            );
    }
    var serialPortOpenOptions = {
        baudRate: 115200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1
    };
    //Open serialport for DropSens sensor
    var serialPort = new SerialPort('COM9', serialPortOpenOptions, function (err) { if (err) console.error('Error opening port'); });
    var couch, couchExternal, couchAuth;
    var previousWinderSpeed1 = 0, previousWinderSpeed2 = 0, switchWinderDirection1 = false, stopWinderTime, stopWinderOk = true, winderDirection1 = true;
    function init() {
        //Connect to Yocto module
        connectYoctoBubblot("169.254.58.33", serialBubblot1, bubblot1YoctoModules);
        //connectYoctoWinder("169.254.58.33", serialWinder, winderYoctoModules);
        //connectYoctoPump("169.254.58.33", serialPump, pumpYoctoModules);
        setInterval(computeWinderLength, 1000);

        //Connection to platform camera 
        //rtsp://192.168.100.100:554/11
        var CAMERA_HOST = '192.168.100.100',
            USERNAME = 'admin',
            PASSWORD = '',
            PORT = 8080;

        var onvif = require('onvif');
        onvif.Discovery.probe(function (err, cams) {
            //Search for IP Camera
            if (err) { throw err; }
            cams.forEach(function (cam) {
                cam.username = 'admin';
                cam.password = '';
                console.log(cam);
            });
            //Create new camera
            winderCamera = new Cam({
                hostname: CAMERA_HOST,
                username: USERNAME,
                password: PASSWORD,
                port: PORT
            }, function (err) {
                if (err) {
                    console.log('Connection with Platform Camera (IP: ' + CAMERA_HOST + ') failed');
                    return;
                }
                console.log('Platform Camera (IP: ' + CAMERA_HOST + ') connected');
            });
        });
        //Open function for DropSens sensor
        var writeToSerial = ['$V;', '$Ltech=01;'];
        var indexSerial = 0;
        var vaPotential, vaCurrent;
        var tempStringData = [], serialAllData = [], packageTransmitted = 0, flag = false;
        serialPort.on('open', function () {
            console.log('Serialport opened, writing ' + writeToSerial[indexSerial]);
            serialPort.write(writeToSerial[indexSerial]);
            indexSerial++;
        });
        //Data callback for DropsSens sensor 
        serialPort.on('data', function (data) {
            //console.log('Data received: ', data.length);
            //console.log(new Uint16Array(data));
            var serialStringData = String.fromCharCode.apply(null, new Uint16Array(data));
            console.log('Serialport: received')
            console.log(serialStringData);
            if (serialStringData[serialStringData.length - 3] = ';' && indexSerial < writeToSerial.length) {
                console.log('Serialport: writing ' + writeToSerial[indexSerial]);
                serialPort.write(writeToSerial[indexSerial]);
                indexSerial++;
            }
            else if ($scope.leftData.computeVa) {
                if (packageTransmitted == 0 && serialStringData[serialStringData.length - 1].charCodeAt() == 10) {
                    packageTransmitted = 1;
                    console.log("Serialport: Computing VA measurement... ");
                }
                else if (packageTransmitted == 1) {
                    if (serialStringData[serialStringData.length - 4] != "E") {
                        tempStringData = tempStringData + serialStringData;
                        flag = true;
                    }
                    else if (serialStringData[serialStringData.length - 4] == "E" && flag) {
                        flag = false;
                        serialAllData = tempStringData + serialStringData;
                        tempStringData = [];
                        packageTransmitted = 2;
                        console.log("Serialport: VA measurement results");
                        console.log(serialAllData);
                    }
                    else if (serialStringData[serialStringData.length - 4] == "E") {
                        serialAllData = serialStringData;
                        packageTransmitted = 2;
                        console.log("Serialport: VA measurement results");
                        console.log(serialAllData);
                    }
                }
                if (packageTransmitted == 2) {
                    console.log("Serialport: Data");
                    for (var i = 0; i < (serialAllData.length - 5) / 25; i++) {
                        vaPotential = 0;
                        vaCurrent = 0;
                        for (j = 0; j < 4; j++) {
                            var asciiCodeData = serialAllData[i * 25 + j + 10].charCodeAt();
                            if (asciiCodeData <= 57 && asciiCodeData > 48) {
                                vaPotential = vaPotential + (asciiCodeData - 48) * Math.pow(16, 3 - j);
                            }
                            else if (asciiCodeData <= 70 && asciiCodeData >= 65) {
                                vaPotential = vaPotential + (asciiCodeData + 10 - 65) * Math.pow(16, 3 - j);
                            }
                        }
                        for (j = 0; j < 4; j++) {
                            var asciiCodeData = serialAllData[i * 25 + j + 2].charCodeAt();
                            if (asciiCodeData <= 57 && asciiCodeData > 48) {
                                vaCurrent = vaCurrent + (asciiCodeData - 48) * Math.pow(16, 3 - j);
                            }
                            else if (asciiCodeData <= 70 && asciiCodeData >= 65) {
                                vaCurrent = vaCurrent + (asciiCodeData + 10 - 65) * Math.pow(16, 3 - j);
                            }
                        }
                        console.log("Applied potential: " + vaPotential / 1000 + " V " + "Current on electrode 1: " + vaCurrent + " mV*2");
                    }
                    packageTransmitted = 0;
                    $scope.leftData.computeVa = false;
                }
            }
        });
        //Compute measurement for DropSens sensor
        $scope.$watch('leftData.computeVa', function (value) {
            if (value) {
                vaPotential = 0;
                console.log('serialPort writing $R;');
                serialPort.write('$R;');
            }
        });
        // node-couchdb instance with default options
        couch = new NodeCouchDb();

        // node-couchdb instance with Memcached
        /*const MemcacheNode = require('node-couchdb-plugin-memcached');
        const couchWithMemcache = new NodeCouchDb({
                            cache: new MemcacheNode
        });*/

        // node-couchdb instance talking to external service
        couchExternal = new NodeCouchDb({
            host: 'localhost',
            protocol: 'http',
            port: 5984
        });

        // not admin party
        couchAuth = new NodeCouchDb({
            auth: {
                user: 'admin',
                pass: 'admin'
            }
        });

        //Terminal command for starting HotSpot: netsh wlan start hostednetwork
        //require('nw.gui').Window.get().showDevTools(); alert('pause'); debugger;

        if (module3dconnexion) {
            module3dconnexion.init3dConnexion("Bubblot NW");
        }
        transitionTimeout = $timeout(getValues, 500);
        setInterval(getEvent, 200);
        //Keyboard shortcuts
        var isOne = false, isTwo = false, isThree = false, isFour = false, isCtrl = false;
        document.onkeydown = function (e) {
            var keyCode = e.keyCode;
            //F1 is pressed
            if (keyCode == 112) {
                //Show shortcut help
                $scope.notifData.help = true;
                $scope.leftData.help = true;
                $scope.rightData.help = true;
                $scope.rightDataPump.help = true;
                $scope.winderData.help = true;
                $scope.$apply();
            }
            //1 is pressed
            else if (keyCode == 49) {
                isOne = true;
            }
            //2 is pressed
            else if (keyCode == 50) {
                isTwo = true;
            }
            //3 is pressed
            else if (keyCode == 51) {
                isThree = true;
            }
            //4 is pressed
            else if (keyCode == 52) {
                isFour = true;
            }
            //Ctrl is pressed
            else if (keyCode == 17) {
                $scope.rightDataPump.isCtrl = true;
                isCtrl = true;
            }
            //Left arrow is pressed
            else if (keyCode == 37) {
                //Move winder camera
                if (document.getElementById('winderDisplay').style.display == "block" && !ignore_keypress && winderCamera) moveWinderCamera(-1, 0, 0, 'left');
            }
            //Right arrow is pressed
            else if (keyCode == 39) {
                //Move winder camera
                if (document.getElementById('winderDisplay').style.display == "block" && !ignore_keypress && winderCamera) moveWinderCamera(1, 0, 0, 'right');
            }
            //Up arrow is pressed
            else if (keyCode == 38) {
                //Move winder camera
                if (document.getElementById('winderDisplay').style.display == "block" && !ignore_keypress && winderCamera) moveWinderCamera(0, 1, 0, 'up');
            }
            //Down arrow is pressed
            else if (keyCode == 40) {
                //Move winder camera
                if (document.getElementById('winderDisplay').style.display == "block" && !ignore_keypress && winderCamera) moveWinderCamera(0, -1, 0, 'down');
            }
        };
        document.onkeyup = function (e) {
            var keyCode = e.keyCode;
            //F1 is released
            if (keyCode == 112) {
                //Hide shortcut help
                $scope.notifData.help = false;
                $scope.leftData.help = false;
                $scope.rightData.help = false;
                $scope.rightDataPump.help = false;
                $scope.winderData.help = false;
                $scope.$apply();
            }
            //1 is released
            else if (keyCode == 49) {
                isOne = false;
            }
            //2 is released
            else if (keyCode == 50) {
                isTwo = false;
            }
            //3 is released
            else if (keyCode == 51) {
                isThree = false;
            }
            //4 is released
            else if (keyCode == 52) {
                isFour = false;
            }
            //Ctrl is released
            else if (keyCode == 17) {
                $scope.rightDataPump.isCtrl = false;
                isCtrl = false;
            }
            //S is released
            else if (keyCode == 83 && $('#winderDisplay').is(':visible')) {
                $scope.winderData.mainControl = 0;
                $scope.winderData.winderControl1 = 0;
                $scope.winderData.winderControl2 = 0;
                $scope.winderData.winderControl3 = 0;
                $scope.winderData.winderControl4 = 0;
                $scope.$apply();
            }
            //R is released
            else if (keyCode == 82 && $('#winderDisplay').is(':visible')) {
                $scope.winderData.winderControl1 = 0;
                $scope.winderData.winderControl2 = 0;
                $scope.winderData.winderControl3 = 0;
                $scope.winderData.winderControl4 = 0;
                $scope.$apply();
            }
        };
        //Scroll winder control with keyboard shortcuts
        var winderScreen = document.getElementById('winderDisplay');
        winderScreen.addEventListener("wheel", function () {
            var clientRect = winderScreen.getBoundingClientRect();
            var minX = clientRect.left + (clientRect.width / 5);
            var maxX = clientRect.right - (clientRect.width / 5);
            if (event.screenX > minX && event.screenX < maxX) {
                if (isOne && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl1 <= 0.5 && $scope.winderData.winderControl1 >= -0.5) {
                        $scope.winderData.winderControl1 = $scope.winderData.winderControl1 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl1 > 0.5) {
                            $scope.winderData.winderControl1 = 0.5;
                        }
                        else if ($scope.winderData.winderControl1 < -0.5) {
                            $scope.winderData.winderControl1 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isTwo && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl2 <= 0.5 && $scope.winderData.winderControl2 >= -0.5) {
                        $scope.winderData.winderControl2 = $scope.winderData.winderControl2 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl2 > 0.5) {
                            $scope.winderData.winderControl2 = 0.5;
                        }
                        else if ($scope.winderData.winderControl2 < -0.5) {
                            $scope.winderData.winderControl2 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isThree && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl3 <= 0.5 && $scope.winderData.winderControl3 >= -0.5) {
                        $scope.winderData.winderControl3 = $scope.winderData.winderControl3 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl3 > 0.5) {
                            $scope.winderData.winderControl3 = 0.5;
                        }
                        else if ($scope.winderData.winderControl3 < -0.5) {
                            $scope.winderData.winderControl3 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isFour && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl4 <= 0.5 && $scope.winderData.winderControl4 >= -0.5) {
                        $scope.winderData.winderControl4 = $scope.winderData.winderControl4 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl4 > 0.5) {
                            $scope.winderData.winderControl4 = 0.5;
                        }
                        else if ($scope.winderData.winderControl4 < -0.5) {
                            $scope.winderData.winderControl4 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isCtrl && !ignore_keypress) {
                    if (event.deltaY < 0) moveWinderCamera(0, 0, 1, "zoom in");
                    else moveWinderCamera(0, 0, -1, "zoom out");
                }
                else if (!isCtrl) {
                    if ($scope.winderData.mainControl <= 0.5 && $scope.winderData.mainControl >= -0.5) {
                        $scope.winderData.mainControl = $scope.winderData.mainControl - event.deltaY / 5000;
                        if ($scope.winderData.mainControl > 0.5) {
                            $scope.winderData.mainControl = 0.5;
                        }
                        else if ($scope.winderData.mainControl < -0.5) {
                            $scope.winderData.mainControl = -0.5;
                        }
                        $scope.$apply();
                    }
                }
            }

        });
        var j = 0;
        $scope.$watch('leftData.pumpOn', function (value) {
            /*
            if (bubblot1YoctoModules.yColorLedCluster_Turbidity) {
                if (value){
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.resetBlinkSeq(0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0xFF0000, 0);
                        setInterval(computeAverageTurbidity, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0xFF0000, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x00FF00, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x00FF00, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x0000FF, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x0000FF, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.linkLedToBlinkSeq(0, 2, 0, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.startBlinkSeq(0);
                } 
                else{
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.stopBlinkSeq(0);
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.resetBlinkSeq(0);
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.rgb_move(0, 2, 0x000000, 0);
                } 
            }
            */
            if (value) $scope.leftData.turbidityData = [];
        });
        $scope.$watch('rightData.spotlightSwitchOn', function (value) {
            if (digitalio) {
                if (value) {
                    digitalIoState |= 64;
                } else {
                    digitalIoState &= 255 - 64;
                }
                digitalio.set_portState(digitalIoState);
            }
        });
        $scope.$watch('rightData.foglightSwitchOn', function (value) {
            if (digitalio) {
                if (value) {
                    digitalIoState |= 128;
                } else {
                    digitalIoState &= 255 - 128;
                }
                digitalio.set_portState(digitalIoState);
            }
        });
        $scope.$watch('leftData.threeDAngle', function (value) {
            if (bubblot1YoctoModules.yServo1_Camera) {
                bubblot1YoctoModules.yServo1_Camera.set_position((value - 38) / 16 * 2000);
            }
        });
        $scope.$watch('rightData.thrust', function (value) {
            if (bubblot1YoctoModules.yServo2_Thrust) {
                bubblot1YoctoModules.yServo2_Thrust.set_position((value - 1) * 1000);
            }
        });
        $scope.$watch('winderData.railMode', function (value) {
            if (value) {
                $scope.notifData.winderPressure1 = false;
                $scope.notifData.winderPressure2 = false;
                $scope.notifData.winderPressure3 = false;
                $scope.notifData.winderPressure4 = false;
                $scope.winderData.winderSpeed3 = 0;
                $scope.winderData.winderSpeed4 = 0;
                $scope.winderData.winderAlert1 = false;
            }
            else {
                $scope.winderData.railAlert = false;
            }
            if (winderYoctoModules.yPwmInput1_Winder1Length) {
                winderYoctoModules.yPwmInput1_Winder1Length.resetCounter();
                previousWinderPulse = 1;
            }
        });
        $scope.$watch('winderData.mainControl', function (value) {
            if ($scope.winderData.railMode) {
                $scope.winderData.winderSpeed1 = value * 11;
                $scope.winderData.winderSpeed2 = value * 11;
            }
            else {
                $scope.winderData.winderSpeed1 = value * 10 + $scope.winderData.winderControl1;
                $scope.winderData.winderSpeed2 = value * 10 + $scope.winderData.winderControl2;
                $scope.winderData.winderSpeed3 = value * 10 + $scope.winderData.winderControl3;
                $scope.winderData.winderSpeed4 = value * 10 + $scope.winderData.winderControl4;
            }
        });
        $scope.$watch('winderData.winderControl1', function (value) {
            $scope.winderData.winderSpeed1 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl2', function (value) {
            $scope.winderData.winderSpeed2 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl3', function (value) {
            $scope.winderData.winderSpeed3 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl4', function (value) {
            $scope.winderData.winderSpeed4 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderSpeed1', function (value) {
            if (previousWinderSpeed2 * value < 0 && !switchWinderDirection1 && !stopWinderOk) {
                switchWinderDirection1 = true;
                //Stop de motor and wait 5s before switching direction
                if (winderYoctoModules.yPwmOutput1_Winder1Speed) {
                    winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(0);
                    clearTimeout(stopWinderTime);
                    setTimeout(winderDirectionTimeout, 4000);
                }
            }
            else if (!switchWinderDirection1) {
                if (winderYoctoModules.yRelay1_Winder1Direction) {
                    if (value > 0) {
                        winderYoctoModules.yRelay1_Winder1Brake.set_state(false);
                        winderYoctoModules.yRelay1_Winder1Direction.set_state(true);
                        winderDirection1 = true;
                        stopWinderOk = false;
                        clearTimeout(stopWinderTime);
                    }
                    else if (value < 0) {
                        winderYoctoModules.yRelay1_Winder1Brake.set_state(false);
                        winderYoctoModules.yRelay1_Winder1Direction.set_state(false);
                        winderDirection1 = false;
                        stopWinderOk = false;
                        clearTimeout(stopWinderTime);
                    }
                    else stopWinderTime = setTimeout(stopWinderTimeout, 4000);
                }
                if (winderYoctoModules.yPwmOutput1_Winder1Speed) {
                    winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(Math.abs(value) / 5.5 * 100);
                }
            }
            previousWinderSpeed2 = previousWinderSpeed1;
            previousWinderSpeed1 = value;
        });
        $scope.$watch('winderData.pressureAlert1', function (value) {
            $scope.notifData.winderPressure1 = value;
        });
        $scope.$watch('winderData.pressureAlert2', function (value) {
            $scope.notifData.winderPressure2 = value;
        });
        $scope.$watch('winderData.pressureAlert3', function (value) {
            $scope.notifData.winderPressure3 = value;
        });
        $scope.$watch('winderData.pressureAlert4', function (value) {
            $scope.notifData.winderPressure4 = value;
        });
        $scope.$watch('winderData.reset1', function (value) {
            $scope.notifData.winderReset1 = value;
        });
        $scope.$watch('winderData.reset2', function (value) {
            $scope.notifData.winderReset2 = value;
        });
        $scope.$watch('winderData.reset3', function (value) {
            $scope.notifData.winderReset3 = value;
        });
        $scope.$watch('winderData.reset4', function (value) {
            $scope.notifData.winderReset4 = value;
        });
        $scope.$watch('rightData.securityAlert', function (value) {
            $scope.notifData.bubblotSecurity = value;
        });
        $scope.$watch('leftData.twistLeft', function (value) {
            $scope.notifData.bubblotTwistLeft = value;
        });
        $scope.$watch('leftData.twistRight', function (value) {
            $scope.notifData.bubblotTwistRight = value;
        });
        $scope.$watch('rightDataPump.securityAlert', function (value) {
            $scope.notifData.pumpSecurity = value;
        });
        var audioBubblot = document.getElementById("audio-alert-bubblot");
        $scope.$watch('notifData.audioBubblot', function (value) {
            if (value) {
                audioBubblot.play();
            }
            else {
                audioBubblot.pause();
                audioBubblot.currentTime = 0;
            }
        });
        var audioPump = document.getElementById("audio-alert-pump");
        $scope.$watch('notifData.audioPump', function (value) {
            if (value) {
                audioPump.play();
            }
            else {
                audioPump.pause();
                audioPump.currentTime = 0;
            }
        });
        var audioWinder = document.getElementById("audio-alert-winder");
        $scope.$watch('notifData.audioWinder', function (value) {
            if (value) {
                audioWinder.play();
            }
            else {
                audioWinder.pause();
                audioWinder.currentTime = 0;
            }
        });
        var intervalDataSave;
        $scope.$watch('notifData.recData', function (value) {
            if ($scope.notifData.recData) intervalDataSave = setInterval(saveData, 2000);
            else clearInterval(intervalDataSave);
        });
    }
    function getEvent() {
        if (module3dconnexion) {
            var result = module3dconnexion.get3dEvent();
            if (result !== "") {
                var spwData = JSON.parse(result);
                //Calcul angle et rayon des vecteurs VSP en fonction du 3Dconnexion si drag pas activé
                if ($scope.rightData.thrustDragOn == false && $('#bubblotDisplay').is(':visible')) {
                    if (spwData.tx > spwDataMax) {
                        spwData.tx = spwDataMax;
                    }
                    if (spwData.tx < -spwDataMax) {
                        spwData.tx = -spwDataMax;
                    }
                    if (spwData.ty > spwDataMax) {
                        spwData.ty = spwDataMax;
                    }
                    if (spwData.ty < -spwDataMax) {
                        spwData.ty = -spwDataMax;
                    }
                    if (spwData.tz > spwDataMax) {
                        spwData.tz = spwDataMax;
                    }
                    if (spwData.tz < -spwDataMax) {
                        spwData.tz = -spwDataMax;
                    }
                    if (spwData.rx > spwDataMax) {
                        spwData.rx = spwDataMax;
                    }
                    if (spwData.rx < -spwDataMax) {
                        spwData.rx = -spwDataMax;
                    }
                    if (spwData.ry > spwDataMax) {
                        spwData.ry = spwDataMax;
                    }
                    if (spwData.ry < -spwDataMax) {
                        spwData.ry = -spwDataMax;
                    }
                    if (spwData.rz > spwDataMax) {
                        spwData.rz = spwDataMax;
                    }
                    if (spwData.rz < -spwDataMax) {
                        spwData.rz = -spwDataMax;
                    }
                    if (Math.abs(spwData.tx) >= Math.abs(spwData.ty) && Math.abs(spwData.tx) >= Math.abs(spwData.tz)
                        && Math.abs(spwData.tx) >= Math.abs(spwData.rx) && Math.abs(spwData.tx) >= Math.abs(spwData.ry)
                        && Math.abs(spwData.tx) >= Math.abs(spwData.rz)) {
                        if (spwData.tx >= 0) {
                            //$scope.rightData.engine1Angle = 180 + 135;
                            $scope.rightData.engine1Angle = 0 + 135;
                            $scope.rightData.engine2Angle = 0 + 135;
                            $scope.rightData.engine3Angle = 180 + 135;
                            $scope.rightData.engine4Angle = 0 + 135;
                        }
                        else {
                            //$scope.rightData.engine1Angle = 0 + 135;
                            $scope.rightData.engine1Angle = 180 + 135;
                            $scope.rightData.engine2Angle = 180 + 135;
                            $scope.rightData.engine3Angle = 0 + 135;
                            $scope.rightData.engine4Angle = 180 + 135;
                        }
                        $scope.rightData.engine1Radius = (spwData.tx * spwData.tx) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    else if (Math.abs(spwData.ty) >= Math.abs(spwData.tz) && Math.abs(spwData.ty) >= Math.abs(spwData.rx)
                        && Math.abs(spwData.ty) >= Math.abs(spwData.ry) && Math.abs(spwData.ty) >= Math.abs(spwData.rz)) {
                        if (spwData.ty >= 0) {
                            $scope.rightData.engine1Angle = 180 + 135;
                            $scope.rightData.engine2Angle = 180 + 135;
                            $scope.rightData.engine3Angle = 0 + 135;
                            $scope.rightData.engine4Angle = 0 + 135;
                        }
                        else {
                            $scope.rightData.engine1Angle = 0 + 135;
                            $scope.rightData.engine2Angle = 0 + 135;
                            $scope.rightData.engine3Angle = 180 + 135;
                            $scope.rightData.engine4Angle = 180 + 135;
                        }
                        $scope.rightData.engine1Radius = (spwData.ty * spwData.ty) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    else if (Math.abs(spwData.tz) >= Math.abs(spwData.rx) && Math.abs(spwData.tz) >= Math.abs(spwData.ry)
                        && Math.abs(spwData.tz) >= Math.abs(spwData.rz)) {
                        if (spwData.tz >= 0) {
                            //$scope.rightData.engine1Angle = 90 + 135;
                            $scope.rightData.engine1Angle = 90 + 135;
                            $scope.rightData.engine2Angle = 270 + 135 - 360;
                            $scope.rightData.engine3Angle = 270 + 135 - 360;
                            $scope.rightData.engine4Angle = 90 + 135;
                        }
                        else {
                            //$scope.rightData.engine1Angle = 270 + 135 - 360;
                            $scope.rightData.engine1Angle = 270 + 135 - 360;
                            $scope.rightData.engine2Angle = 90 + 135;
                            $scope.rightData.engine3Angle = 90 + 135;
                            $scope.rightData.engine4Angle = 270 + 135 - 360;
                        }
                        $scope.rightData.engine1Radius = (spwData.tz * spwData.tz) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    else if (Math.abs(spwData.rx) >= Math.abs(spwData.ry) && Math.abs(spwData.rx) >= Math.abs(spwData.rz)) {
                        if (spwData.rx >= 0) {
                            $scope.rightData.engine1Angle = 270 + 135 - 360;
                            $scope.rightData.engine2Angle = 90 + 135;
                            $scope.rightData.engine3Angle = 270 + 135 - 360;
                            $scope.rightData.engine4Angle = 90 + 135;
                        }
                        else {
                            $scope.rightData.engine1Angle = 90 + 135;
                            $scope.rightData.engine2Angle = 270 + 135 - 360;
                            $scope.rightData.engine3Angle = 90 + 135;
                            $scope.rightData.engine4Angle = 270 + 135 - 360;
                        }
                        $scope.rightData.engine1Radius = (spwData.rx * spwData.rx) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    else if (Math.abs(spwData.ry) >= Math.abs(spwData.rz)) {
                        if (spwData.ry >= 0) {
                            $scope.rightData.engine1Angle = 270 + 135 - 360;
                            $scope.rightData.engine2Angle = 270 + 135 - 360;
                            $scope.rightData.engine3Angle = 90 + 135;
                            $scope.rightData.engine4Angle = 90 + 135;
                        }
                        else {
                            $scope.rightData.engine1Angle = 90 + 135;
                            $scope.rightData.engine2Angle = 90 + 135;
                            $scope.rightData.engine3Angle = 270 + 135 - 360;
                            $scope.rightData.engine4Angle = 270 + 135 - 360;
                        }
                        $scope.rightData.engine1Radius = (spwData.ry * spwData.ry) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    else {
                        if (spwData.rz >= 0) {
                            $scope.rightData.engine1Angle = 180 + 135;
                            $scope.rightData.engine2Angle = 0 + 135
                            $scope.rightData.engine3Angle = 0 + 135;
                            $scope.rightData.engine4Angle = 180 + 135;
                        }
                        else {
                            $scope.rightData.engine1Angle = 0 + 135;
                            $scope.rightData.engine2Angle = 180 + 135;
                            $scope.rightData.engine3Angle = 180 + 135;
                            $scope.rightData.engine4Angle = 0 + 135;
                        }
                        $scope.rightData.engine1Radius = (spwData.rz * spwData.rz) / (spwDataMax * spwDataMax) * 60;
                        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
                        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
                    }
                    /*
                    if (spwData.rz == 0) {
                        if (-spwData.rx > 0) {
                            $scope.rightData.engine1Angle = 90;
                        }
                        else {
                            $scope.rightData.engine1Angle = 270;
                        }
                    }
                    else if (spwData.rz < 0) $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz) + 180;
                    else if (-spwData.rx < 0) $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz) + 360;
                    else $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz);
                    $scope.rightData.engine1Radius = (spwData.rz * spwData.rz + spwData.rx * spwData.rx) / (spwDataMax * spwDataMax) * 100;
                    */

                }
            }
            else {
                $scope.rightData.engine1Radius = 0;
                $scope.rightData.engine2Radius = 0;
                $scope.rightData.engine3Radius = 0;
                $scope.rightData.engine4Radius = 0;
            }
        }
        else {
            $scope.rightData.engine1Radius = 0;
            $scope.rightData.engine2Radius = 0;
            $scope.rightData.engine3Radius = 0;
            $scope.rightData.engine4Radius = 0;
        }
        $scope.$apply();
        //Calcul angles des servos en fonction du rayon et de l'angle des vecteurs VSP
        VSP1Angle = $scope.rightData.engine1Angle;
        VSP2Angle = $scope.rightData.engine2Angle;
        VSP3Angle = $scope.rightData.engine3Angle;
        VSP4Angle = $scope.rightData.engine4Angle;
        VSP1Radius = $scope.rightData.engine1Radius;
        VSP2Radius = $scope.rightData.engine2Radius;
        VSP3Radius = $scope.rightData.engine3Radius;
        VSP4Radius = $scope.rightData.engine4Radius;

        VSP1AngleServo1 = -VSP1Radius / 45 * 10 * (-5.553 * Math.pow(10, -10) * Math.pow(VSP1Angle, 5) + 5.675 * Math.pow(10, -7) * Math.pow(VSP1Angle, 4)
            - 1.915 * Math.pow(10, -4) * Math.pow(VSP1Angle, 3) + 2.169 * Math.pow(10, -2) * Math.pow(VSP1Angle, 2) - 1.610 * Math.pow(10, -1) * VSP1Angle
            - 22.44);
        VSP1AngleServo2 = -VSP1Radius / 45 * 10 * (-5.415 * Math.pow(10, -10) * Math.pow(VSP1Angle, 5) + 4.225 * Math.pow(10, -7) * Math.pow(VSP1Angle, 4)
            - 9.197 * Math.pow(10, -5) * Math.pow(VSP1Angle, 3) + 2.847 * Math.pow(10, -3) * Math.pow(VSP1Angle, 2) + 2.585 * Math.pow(10, -1) * VSP1Angle
            + 31.42);
        VSP2AngleServo1 = -VSP2Radius / 45 * 10 * (-5.553 * Math.pow(10, -10) * Math.pow(VSP2Angle, 5) + 5.675 * Math.pow(10, -7) * Math.pow(VSP2Angle, 4)
            - 1.915 * Math.pow(10, -4) * Math.pow(VSP2Angle, 3) + 2.169 * Math.pow(10, -2) * Math.pow(VSP2Angle, 2) - 1.610 * Math.pow(10, -1) * VSP2Angle
            - 22.44);
        VSP2AngleServo2 = -VSP2Radius / 45 * 10 * (-5.415 * Math.pow(10, -10) * Math.pow(VSP2Angle, 5) + 4.225 * Math.pow(10, -7) * Math.pow(VSP2Angle, 4)
            - 9.197 * Math.pow(10, -5) * Math.pow(VSP2Angle, 3) + 2.847 * Math.pow(10, -3) * Math.pow(VSP2Angle, 2) + 2.585 * Math.pow(10, -1) * VSP2Angle
            + 31.42);
        VSP3AngleServo1 = -VSP3Radius / 45 * 10 * (-5.553 * Math.pow(10, -10) * Math.pow(VSP3Angle, 5) + 5.675 * Math.pow(10, -7) * Math.pow(VSP3Angle, 4)
            - 1.915 * Math.pow(10, -4) * Math.pow(VSP3Angle, 3) + 2.169 * Math.pow(10, -2) * Math.pow(VSP3Angle, 2) - 1.610 * Math.pow(10, -1) * VSP3Angle
            - 22.44);
        VSP3AngleServo2 = -VSP3Radius / 45 * 10 * (-5.415 * Math.pow(10, -10) * Math.pow(VSP3Angle, 5) + 4.225 * Math.pow(10, -7) * Math.pow(VSP3Angle, 4)
            - 9.197 * Math.pow(10, -5) * Math.pow(VSP3Angle, 3) + 2.847 * Math.pow(10, -3) * Math.pow(VSP3Angle, 2) + 2.585 * Math.pow(10, -1) * VSP3Angle
            + 31.42);
        VSP4AngleServo1 = -VSP4Radius / 45 * 10 * (-5.553 * Math.pow(10, -10) * Math.pow(VSP4Angle, 5) + 5.675 * Math.pow(10, -7) * Math.pow(VSP4Angle, 4)
            - 1.915 * Math.pow(10, -4) * Math.pow(VSP4Angle, 3) + 2.169 * Math.pow(10, -2) * Math.pow(VSP4Angle, 2) - 1.610 * Math.pow(10, -1) * VSP4Angle
            - 22.44);
        VSP4AngleServo2 = -VSP4Radius / 45 * 10 * (-5.415 * Math.pow(10, -10) * Math.pow(VSP4Angle, 5) + 4.225 * Math.pow(10, -7) * Math.pow(VSP4Angle, 4)
            - 9.197 * Math.pow(10, -5) * Math.pow(VSP4Angle, 3) + 2.847 * Math.pow(10, -3) * Math.pow(VSP4Angle, 2) + 2.585 * Math.pow(10, -1) * VSP4Angle
            + 31.42);
        //Moving servo motor to orientate propellers
        if (bubblot1YoctoModules.yServo1_VSPTopLeft_1) {
            bubblot1YoctoModules.yServo1_VSPTopLeft_1.set_position(VSP1AngleServo1);
        }
        if (bubblot1YoctoModules.yServo1_VSPTopLeft_2) {
            bubblot1YoctoModules.yServo1_VSPTopLeft_2.set_position(VSP1AngleServo2);
        }
        if (bubblot1YoctoModules.yServo1_VSPTopRight_1) {
            bubblot1YoctoModules.yServo1_VSPTopRight_1.set_position(VSP2AngleServo1);
        }
        if (bubblot1YoctoModules.yServo1_VSPTopRight_2) {
            bubblot1YoctoModules.yServo1_VSPTopRight_2.set_position(VSP2AngleServo2);
        }
        if (bubblot1YoctoModules.yServo2_VSPBottomLeft_1) {
            bubblot1YoctoModules.yServo2_VSPBottomLeft_1.set_position(VSP3AngleServo1);
        }
        if (bubblot1YoctoModules.yServo2_VSPBottomLeft_2) {
            bubblot1YoctoModules.yServo2_VSPBottomLeft_2.set_position(VSP3AngleServo2);
        }
        if (bubblot1YoctoModules.yServo2_VSPBottomRight_1) {
            bubblot1YoctoModules.yServo2_VSPBottomRight_1.set_position(VSP4AngleServo1);
        }
        if (bubblot1YoctoModules.yServo2_VSPBottomRight_2) {
            bubblot1YoctoModules.yServo2_VSPBottomRight_2.set_position(VSP4AngleServo2);
        }
    }

    //Computer the length of the winder
    var previousWinderPulse = 1;
    function computeWinderLength() {
        //Computation of the length for rail mode
        if ($scope.winderData.railMode && winderYoctoModules.yPwmInput1_Winder1Length) {
            winderYoctoModules.yPwmInput1_Winder1Length.get_pulseCounter().then((value) => {
                //Compare speed with approximation
                if (value - previousWinderPulse < 4.3 * (Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100) - 30 ||
                    value - previousWinderPulse > 4.3 * (Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100) + 30) {
                    //Speed not as expected    
                    $scope.winderData.railAlert = true;
                }
                else {
                    //Speed ok
                    $scope.winderData.railAlert = false;
                }
                //Compute rail length
                if (!stopWinderOk) {
                    if (winderDirection1) $scope.winderData.railLength = $scope.winderData.railLength + (value - previousWinderPulse) / 100;
                    else $scope.winderData.railLength = $scope.winderData.railLength - (value - previousWinderPulse) / 100;
                    if ($scope.winderData.railLength < 0) {
                        $scope.winderData.railLength = 0;
                    }
                }
                previousWinderPulse = value;
                if (value > 10000) {
                    winderYoctoModules.yPwmInput1_Winder1Length.resetCounter();
                    previousWinderPulse = 1;
                }
                $scope.$apply();
            });
        }
        //Computation of the length for winder mode
        else if (!$scope.winderData.railMode && winderYoctoModules.yPwmInput1_Winder1Length) {
            winderYoctoModules.yPwmInput1_Winder1Length.get_pulseCounter().then((value) => {
                //Compare speed with approximation
                if (value - previousWinderPulse < 4.3 * (Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100) - 30 ||
                    value - previousWinderPulse > 4.3 * (Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100) + 30) {
                    //Speed not as expected    
                    $scope.winderData.winderAlert1 = true;
                }
                else {
                    //Speed ok
                    $scope.winderData.winderAlert1 = false;
                }
                //Compute winder length
                if (!stopWinderOk) {
                    if (winderDirection1) $scope.winderData.winderLength1 = $scope.winderData.winderLength1 + (value - previousWinderPulse) / 100;
                    else $scope.winderData.winderLength1 = $scope.winderData.winderLength1 - (value - previousWinderPulse) / 100;
                    if ($scope.winderData.winderLength1 < 0) {
                        $scope.winderData.winderLength1 = 0;
                    }
                }
                previousWinderPulse = value;
                if (value > 10000) {
                    winderYoctoModules.yPwmInput1_Winder1Length.resetCounter();
                    previousWinderPulse = 1;
                }
                $scope.$apply();
            });
        }
    }
    function getValues() {
        if (receivedPitch && receivedRoll) {
            receivedPitch = false;
            receivedRoll = false;
            $scope.$apply();
        }
    }
    function computePitch(object, value) {
        $scope.leftDataPump.horizonPitch = value;
        $scope.leftData.horizonPitch = value;
        if (!receivedPitch) {
            receivedPitch = true;
            if (receivedRoll) {
                getValues();
            }
        }
    }
    function computeRoll(object, value) {
        $scope.leftDataPump.horizonRoll = value;
        $scope.leftData.horizonRoll = value;
        if (!receivedRoll) {
            receivedRoll = true;
            if (receivedPitch) {
                getValues();
            }
        }
    }
    var gyroX = 0, gyroY = 0, gyroZ = 0;
    var gyroXOk = false, gyroYOk = false, gyroZOk = false;
    function computeGyroX(object, value) {
        gyroX = value;
        console.log(value);
    }
    function computeGyroY(object, value) {
        gyroY = value;
    }
    function computeGyroZ(object, value) {
        gyroZ = value;
    }
    function computeCompass(object, value) {
        $scope.leftDataPump.gpsCompass = value;
        $scope.$apply();
    }
    function computeLatitude(object, value) {
    }
    function computeTemp(object, value) {
    }
    var amountTurbi = 0, totalTurbi = 0;
    function computeTurbidity(object, value) {
        amountTurbi++;
        totalTurbi = totalTurbi + (1000 - value);
        $scope.leftData.turbidity = 1 - value / 1000;

    }
    function computeAverageTurbidity() {
        if (!amountTurbi == 0) $scope.leftData.turbidityRed = totalTurbi / amountTurbi;
        console.log($scope.leftData.turbidityRed);
        totalTurbi = 0;
        amountTurbi = 0;
    }
    function stopWinderTimeout() {
        stopWinderOk = true;
        winderYoctoModules.yRelay1_Winder1Brake.set_state(true);
    }
    function winderDirectionTimeout() {
        if (winderYoctoModules.yRelay1_Winder1Direction && $scope.winderData.winderSpeed1 > 0) {
            winderYoctoModules.yRelay1_Winder1Direction.set_state(true);
            winderDirection1 = true;
        }
        else if (winderYoctoModules.yRelay1_Winder1Direction) {
            winderYoctoModules.yRelay1_Winder1Direction.set_state(false);
            winderDirection1 = false;
        }
        winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100);
        switchWinderDirection1 = false;
    }
    var allScreen = document.getElementById('bubblotDisplay');
    allScreen.addEventListener('mousedown', dragDirection);
    var clientRect = allScreen.getBoundingClientRect();
    var margeX = clientRect.width / 5;
    var margeY = clientRect.height / 5;
    var minX = clientRect.left + margeX;
    var maxX = clientRect.right - margeX;
    var startX, startY, x, y;
    function dragDirection(event) {
        startX = event.screenX;
        startY = event.screenY;
        if (startX > minX && startX < maxX) {
            allScreen.addEventListener('mousemove', mousemove);
            allScreen.addEventListener('mouseup', mouseup);
        }
    }
    function mousemove(event) {
        x = event.screenX - startX;
        y = event.screenY - startY;
        if (x > margeX) {
            x = margeX;
        }
        if (x < -margeX) {
            x = -margeX;
        }
        if (y > margeY) {
            y = margeY;
        }
        if (y < -margeY) {
            y = -margeY;
        }
        bubblotDeltaY = x / margeX;
        bubblotDeltaX = -y / margeY;
    }
    function mouseup() {
        allScreen.removeEventListener('mousemove', mousemove);
        allScreen.removeEventListener('mouseup', mouseup);
    }

    var counter1 = 0, counter2 = 0, counter3 = 0;

    //Save the data in the database
    function saveData() {
        var date = new Date(), year, month, day, hours, minutes, seconds;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();

        $scope.rightData.distancexToPump = $scope.rightData.distancexToPump + 20 * Math.random() - 10;
        $scope.rightData.distanceyToPump = $scope.rightData.distanceyToPump + 20 * Math.random() - 10;

        var fe = false, pb = false, cu = false, sn = false, isVa = false, isMovie = false;
        counter1++;
        counter2++;
        counter3++;
        var dataVa = [];
        if (counter1 == 6) {
            var va = 6 * Math.random();
            if (va <= 1) {
                isVa = true;
            }
            else if (va > 1 && va <= 2) {
                pb = true;
                isVa = true;
            }
            else if (va > 3 && va <= 4) {
                cu = true;
                isVa = true;
            }
            else if (va > 4 && va <= 5) {
                sn = true;
                isVa = true;
            }
            else {
                fe = true;
                isVa = true;
            }
            for (var i = 0; i <= 30; i++) {
                dataVa.push(1 * Math.random());
            }
            counter1 = 0;
        }
        if (counter2 == 20) {
            isMovie = true;
            counter2 = 0;
        }
        var isTurbi = false, avgRed = 0, avgGreen = 0, avgBlue = 0, dataTurbiRed = [], dataTurbiGreen = [], dataTurbiBlue = [];
        if (counter3 == 4) {
            isTurbi = true;
            counter3 = 0;
            avgRed = 1 * Math.random();
            avgGreen = 1 * Math.random();
            avgBlue = 1 * Math.random();
            for (var i = 0; i <= 15; i++) {
                var dataRed = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiRed.push(dataRed);
                var dataGreen = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiGreen.push(dataGreen);
                var dataBlue = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiBlue.push(dataBlue);
            }
        }
        var dataMagn = [], avgMagn = 1 * Math.random();
        for (var i = 0; i <= 15; i++) {
            var obj = { x: 2 * i, y: 5 * Math.random() };
            dataMagn.push(obj);
        }

        couch.insert("bubblot", {
            "data_key": [year, month, day, hours, minutes, seconds, 1],
            "data": {
                pumpLatitude: $scope.leftDataPump.localLat,
                pumpLongitude: $scope.leftDataPump.localLong,
                pumpOrientation: $scope.leftDataPump.gpsCompass,
                distancexToPump: $scope.rightData.distancexToPump,
                distanceyToPump: $scope.rightData.distanceyToPump,
                depth: $scope.rightData.depth * 100,
                temperature: 24,
                VA: {
                    available: isVa,
                    data: dataVa,
                    fe: fe,
                    pb: pb,
                    cu: cu,
                    sn: sn,
                },
                magnetism: {
                    data: dataMagn,
                    mean: avgMagn,
                },
                turbidity: {
                    available: isTurbi,
                    dataRed: dataTurbiRed,
                    dataGreen: dataTurbiGreen,
                    dataBlue: dataTurbiBlue,
                    avgRed: avgRed,
                    avgGreen: avgGreen,
                    avgBlue: avgBlue,
                },
                movie: {
                    available: isMovie,
                    data: [],
                }
            }
        }).then(({ data, headers, status }) => {
            // data is json response 
            // headers is an object with all response headers 
            // status is statusCode number 
        }, err => {
            // either request error occured 
            // ...or err.code=EDOCCONFLICT if document with the same id already exists 
        });
    }
    var stop_timer, ignore_keypress = false, winderCamera = null;
    function moveWinderCamera(x_speed, y_speed, zoom_speed, msg) {
        // Step 1 - Turn off the keyboard processing (so keypresses do not buffer up)
        // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function 
        // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
        // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

        // Clear any pending 'stop' commands
        if (stop_timer) clearTimeout(stop_timer);

        // Pause keyboard processing
        ignore_keypress = true;

        // Move the camera
        winderCamera.continuousMove({
            x: x_speed,
            y: y_speed,
            zoom: zoom_speed
        },
            // completion callback function
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                } else {
                    // schedule a Stop command to run in the future 
                    stop_timer = setTimeout(stopwinderCamera, 100);
                    ignore_keypress = false;
                }
            });
    }
    function stopwinderCamera() {
        // send a stop command, stopping Pan/Tilt and stopping zoom
        winderCamera.stop({ panTilt: true, zoom: true },
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                }
            });
    }
    init();
}
])
