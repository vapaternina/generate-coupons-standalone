/* eslint-disable max-len */
import got from 'got'

export default async (contractId, value) => {
  try {
    const body = await got.post(`${process.env.INTEGRATOR_URL}/coupons/generate/v2`, {
        json: { contractId, value },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: process.env.INTEGRATOR_TOKEN
        },
        resolveBodyOnly: true
      }).json();

    return body.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
