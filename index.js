import 'dotenv/config';
import moment from 'moment-timezone';
import 'moment/locale/es.js';
moment.locale('es');
import getSunshineConversationData from "./lib/getSunshineConversationData.js";
import { formatMoney, readCSVFile, writeJSONFile } from "./helpers/utils.js";
import generateOsfCoupon from "./lib/integrator/generateCoupon.js";
import generateCouponPDF from "./helpers/generateCouponPDF.js";
import AWS from 'aws-sdk';
const S3 = new AWS.S3();

const COUPON_TEMPLATE = 'portalweb-cupon-general'

const generateCouponAndPdf = async (contractId, couponValue, userPhoneNumber, index) => {
  const coupon = await generateOsfCoupon(contractId, couponValue);
  const couponId = coupon.CUPONUME;
  const expiryDate = moment().add(10, 'years').tz('America/Bogota');

  const templateParams = {
    REASON_TEXT: 'CUPÓN PARA PAGO',
    DATA: [
      { text: 'CUPÓN', value: couponId },
      { text: 'VALOR', value: formatMoney(couponValue) },
      { text: "CONTRATO", value: contractId }
    ]
  };

  const { id, base64 } = await generateCouponPDF(
    couponId,
    couponValue,
    expiryDate,
    COUPON_TEMPLATE,
    templateParams
  );

  const fileName = `${contractId}_${couponId}_pago${index}`;

  const pdfPath = `gestion-cartera/dividir-factura/${userPhoneNumber}/${fileName}.pdf`;

  const paramsPdf = {
    Body: Buffer.from(base64, 'base64'),
    Bucket: process.env.STORAGE_S3_BUCKET,
    Key: pdfPath,
    ContentType: 'application/pdf'
  };

  S3.putObject(paramsPdf).promise();

  return { couponValue, couponId, pdfPath }
}

const getCouponValues = (value) => {
  const couponValues = []

  for(let i = 0; i < 4; i++){
    const quarterValue = Math.floor(value / 4);
    const remaining = value % 4;
    const couponValue = i === 3 ? quarterValue + remaining : quarterValue;

    couponValues.push(couponValue)
  }

  return couponValues;
}

const processFile = async ()=> {
  try{
    const csvData = await readCSVFile('./input.csv');

    const output = [];

    for (const line of csvData){
      const contractId = line[0];
      const value = line[1];
      const userId = line[2];

      const conversationData = await getSunshineConversationData(userId);
      const client = conversationData.clients[0];
      const userPhoneNumber = client.raw.from;

      const couponValues = getCouponValues(value);

      const coupons = await Promise.all(couponValues.map(async (couponValue, index) => {
        const couponData = await generateCouponAndPdf(contractId, couponValue, userPhoneNumber, index + 1);
        console.log(couponData);

        return couponData; 
      }));
  
      const outputData = { userPhoneNumber, contractId, coupons }

      output.push(outputData)
    }

    await writeJSONFile(JSON.stringify(output, null, '\t'))

    return output;
  }catch(error){
    console.error('Unexpected error', error);
  }
};

await processFile();
