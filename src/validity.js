'use strict';
const moment = require('moment');

module.exports = {
    from: (startsAt) => {
        const validity = moment(startsAt).set({
            'hours': 0,
            'minutes': 0,
            'seconds': 0,
            'milliseconds': 0
        });
        console.log('[Validity] From:', validity.toISOString());
        return validity.toISOString();
    },
    to: (plan, startsAt) => {
        const init = moment(startsAt).set({
            'hours': 0,
            'minutes': 0,
            'seconds': 0,
            'milliseconds': 0
        });
    
        var validity = init.clone();
        validity = validity.hours(23).minutes(59).seconds(59);
        switch(plan){
            case('FourDays'):
                validity.add(3, 'day');
                break;
            case('SevenDays'):
                validity.add(6, 'day');
                break;
            case('FourteenDays'):
                validity.add(13, 'day');
            break;
            default:
                //for OneDay plan, no day is added. 
                //validity is for the same day, from 0 to 23:59 hs
                break;
        }
        console.log('[Validity] To:', validity.toISOString());
        return validity.toISOString();
    }

}
