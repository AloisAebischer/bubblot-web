"use strict";

require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_genericsensor.js');

let sensor1, sensor2;

async function startDemo()
{
    await YAPI.LogUnhandledPromiseRejections();
    await YAPI.DisableExceptions();

    // Setup the API to use the VirtualHub on local machine
    let errmsg = new YErrorMsg();
    if(await YAPI.RegisterHub('127.0.0.1', errmsg) != YAPI.SUCCESS) {
        console.log('Cannot contact VirtualHub on 127.0.0.1: '+errmsg.msg);
        return;
    }

    // Select specified device, or use first available one
    let serial = process.argv[process.argv.length-1];
    if(serial[8] != '-') {
        // by default use any connected module suitable for the demo
        let anysensor = YGenericSensor.FirstGenericSensor();
        if(anysensor) {
            let module = await anysensor.module();
            serial = await module.get_serialNumber();
        } else {
            console.log('No matching sensor connected, check cable !');
            return;
        }
    }
    console.log('Using device '+serial);
    sensor1  = YGenericSensor.FindGenericSensor(serial+".genericSensor1");
    sensor2  = YGenericSensor.FindGenericSensor(serial+".genericSensor2");

    refresh();
}

async function refresh()
{
    if (await sensor1.isOnline()) {
        console.log('Input 1: '+(await sensor1.get_currentValue()) + (await sensor1.get_unit()));
        console.log('Input 2: '+(await sensor2.get_currentValue()) + (await sensor2.get_unit()));
    } else {
        console.log('Module not connected');
    }
    setTimeout(refresh, 500);
}

startDemo();