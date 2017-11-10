'use strict';
const createError = require('micro').createError
const prices = {
  OneDay: { 
    adultPrice : 19, kidPrice: 9
  },
  FourDays: { 
    adultPrice: 59, kidPrice: 29
  },
  SevenDays: { 
    adultPrice : 79, kidPrice: 39
  },
  FourteenDays: {
    adultPrice : 99, kidPrice: 49
  }
};

const pricesWithDiscount = {
  OneDay: { 
    adultPrice : 19, kidPrice: 9
  },
  FourDays: { 
    adultPrice: 29, kidPrice: 14
  },
  SevenDays: { 
    adultPrice : 39, kidPrice: 19
  },
  FourteenDays: {
    adultPrice : 49, kidPrice: 24
  }
};

module.exports = {
  // Returns final price in cents in order to send it to Stripe
  totalChargeAmount: function (req, discount) {
    console.log('Total charge amount for request:' , req)
    console.log('Discount for charge:', discount);
    let pricing;
    if(discount && discount.hasDiscountCode) {
        pricing = pricesWithDiscount[req.plan]
    } else {
      pricing = prices[req.plan];
    }
    console.log('Pricing to use: ', pricing);
    if(!pricing) throw createError(400,'Invalid plan value: '+ req.plan);
    const _amount = pricing.adultPrice * req.adultsAmount + pricing.kidPrice * req.kidsAmount;
    return _amount * 100;
  },

  // returns final price in dolars in order to show it in the subscription email
  finalPriceForEmail: function (req, discount, res) {
    let pricing;
    if(discount && discount.hasDiscountCode) {
        pricing = pricesWithDiscount[req.plan]
    } else {
      pricing = prices[req.plan];
    }
    return pricing.adultPrice * req.adultsAmount + pricing.kidPrice * req.kidsAmount;
  }
  
}
