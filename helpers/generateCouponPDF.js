import moment from 'moment-timezone';
import bwipjs from 'bwip-js';
import generateBase64PDF from '../lib/pdfgenerator/generatePDF.js';

const barcodeText = 7707232377896;
const couponPadSize = 10;

const getBarcodeText = (couponText, valueText, expiryText) => {
  const expiryCode = expiryText ? `96${expiryText}` : '';
  const expiryAltCode = expiryText ? `(96)${expiryText}` : '';

  return {
    // eslint-disable-next-line max-len
    text: `415${barcodeText}8020${couponText}3900${valueText}${expiryCode}`,
    // eslint-disable-next-line max-len
    altText: `(415)${barcodeText}(8020)${couponText}(3900)${valueText}${expiryAltCode}`
  };
};

const barcodeConfig = {
  scale: 1,
  height: 20,
  includetext: true,
  textxalign: 'center',
  textyoffset: 5
};

const generateCouponBarcode = async (couponId, value, expiryDate) => {
  const couponText = couponId.toString().padStart(couponPadSize, '0');
  const valueText = Math.trunc(value)
    .toString()
    .padStart(10, '0');
  const expiryText = moment(expiryDate)
    .tz('America/Bogota')
    .format('YYYYMMDD');

  const { text, altText } = getBarcodeText(couponText, valueText, expiryText);

  const image = await bwipjs.toBuffer({
    bcid: 'code128',
    text,
    alttext: altText,
    ...barcodeConfig
  });
  return image.toString('base64');
};

const generateCouponPDF = async (
  couponId,
  value,
  expiryDate,
  templateId,
  templateParams
) => {
  const barcode = await generateCouponBarcode(couponId, value, expiryDate);

  const params = {
    ...templateParams,
    BARCODE: {
      base64: barcode,
      width: 320
    }
  };

  return await generateBase64PDF(templateId, params);
};

export default generateCouponPDF;