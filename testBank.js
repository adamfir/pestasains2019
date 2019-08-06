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
let parsed_string = decrypt("Uh8YIlIZHBtIT0hgBgdcFUBMSUFUCRFEHz4ONwoHW1UJSl1Oc0RMXQ4DBgknOxpNGxwbSEshG1MVTBRUSkYDYA",cid,sck);

console.log({
    "client_id":cid,
    "data":encrypted_string
});
console.log(parsed_string);