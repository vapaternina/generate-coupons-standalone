import moment from "moment-timezone";
import getSunshineConversationData from "./lib/getSunshineConversationData.js";
import { formatMoney, readCSVFile } from "./helpers/utils.js";
import generateCoupon from "./lib/integrator/generateCoupon.js";

const generateCouponAndPdf = async (contractId, couponValue) => {
  const coupon = await generateCoupon(contractId, quarterValue);
  const couponId = coupon.CUPONUME;
  const expiryDate = moment().add(10, 'years');

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

  return { couponValue, couponId, pdfPath }
}

const processFile = async ()=> {
  try{
    const csvData = await readCSVFile('./test.csv');

    const output = [];

    for(const line of csvData){
      const contractId = line[0];
      const value = line[1];
      const userId = line[2];

      const conversationData = await getSunshineConversationData(userId);
      const client = conversationData.clients[0];
      const userPhoneNumber = client.raw.from;
  
      const coupons = [];
    
      for(let i = 0; i < 4; i++){
        const quarterValue = Math.floor(value / 4);
        const remaining = value % 4;
        const couponValue = i === 3 ? quarterValue + remaining : quarterValue;

        const couponData = await generateCouponAndPdf(contractId, couponValue);
        coupons.push(couponData)
      }
  
      const outputData = { userPhoneNumber, contractId, coupons}
      output.push(outputData)
    }

    return output;
  }catch(error){
    console.error('Unexpected error', error);
  }
};

export default processFile;
