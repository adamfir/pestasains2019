let {encrypt, decrypt} = require('./routes/Midleware/PaymentEncription');
let cid = '00298'; //from BNI
let sck = '787b175aeb54a1e133fb71b5d2ebe11d'; //from BNI
let two_hours = new Date(+new Date() + 2 * 3600 * 1000);
let data = {
    type : "createbilling",
    trx_amount : 100000,
    customer_name : "David",
    customer_email : "david@example.com",
    customer_phone : "08123456781011",
    description : "Test Create Billing",
    trx_id : "invoice-0001",
    virtual_account : "9880161400018820",
    billing_type : "c",
    client_id : cid,
    datetime_expired : two_hours.toISOString()
};
let encrypted_string = encrypt(data,cid,sck);
let parsed_string = decrypt("TyAeIU8ZHBtIT0hgBgdjDUYFH0F9WUZ1YgFEfgAKUk97Cx0RdU1SUwcJcVBROxs3ExwdT0oLFjxZBlx9A3kDHT8kTBtMTFUcRnxRUUhEGgRPFRR8fScScxs_FjcGCWJIdVRZZQhVCSFRUUIVFkoVN0NOWAp7VUp6YQ1SfD1XA0Q4HBJKB1ZkXH56Bk1ack58DCUFaWExNzIWNi8PcwJEUX0JZQ",cid,sck);

console.log({
    "client_id":cid,
    "data":encrypted_string
});
console.log(parsed_string);