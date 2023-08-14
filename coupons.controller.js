import express from 'express';
import getSunshineConversationData from './lib/getSunshineConversationData.js';
import generateCoupon from './lib/integrator/generateCoupon.js';
import generateCouponPDF from './lib/helpers/generateCouponPDF.js';
import moment from 'moment-timezone';
import { formatMoney } from './lib/helpers/utils.js';
const router = express.Router();
import AWS from 'aws-sdk';
const S3 = new AWS.S3();

const COUPON_TEMPLATE = 'portalweb-cupon-general'

router.post('/generate', async (req, res) => {
  try{
    const conversationData = await getSunshineConversationData('5542c41e5adcc0d6376ab749');
    const client = conversationData.clients[0];
    const userPhoneNumber = client.raw.from;
  
    //contrato, valor, userId
    const value = 5430;
    const contractId = 10;
  
    const cupons = [];
  
    for(let i = 0; i < 4; i++){
      const quarterValue = Math.floor(value / 4);
      const coupon = await generateCoupon(contractId, quarterValue);
      const couponId =  coupon.CUPONUME;
      const expiryDate = moment().add(10, 'years');
  
      const couponValue = i === 3 ? quarterValue + value % 4 : quarterValue;
  
      const templateParams = {
        REASON_TEXT: 'CUPÓN PARA PAGO',
        DATA: [
          { text: 'CUPÓN', value: couponId },
          { text: 'VALOR', value: formatMoney(couponValue) },
          {
            text: "CONTRATO",
            value: contractId
          }
        ]
      };
  
      // //returns id, url and base64
      const { id, base64 } = await generateCouponPDF(
        couponId,
        couponValue,
        expiryDate,
        COUPON_TEMPLATE,
        templateParams
      );
  
      const pdfPath = `/gestion-cartera/dividir-factura/${userPhoneNumber}/${id}.pdf`;
  
      const paramsPdf = {
        Body: Buffer.from(base64, 'base64'),
        Bucket: process.env.STORAGE_S3_BUCKET,
        Key: pdfPath
      };
  
      S3.putObject(paramsPdf).promise();
  
      coupons.push({
        couponValue, couponId, pdfPath
      })
    }

    const output = { userPhoneNumber, contractId, coupons}
  
    return res.status(200).json({
      status: 'success',
      data: output
    });
  }catch(error){
    console.error('Unexpected error', error);
    return res.status(422).json({
      status: 'error',
      errors: {
        base: 'Ocurrió error, intente más tarde'
      }
    });
  }
})

export default router;