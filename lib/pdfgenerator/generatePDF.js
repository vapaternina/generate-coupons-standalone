import got from 'got';

const getPdfFromUrl = async url => {
  const body = await got.get(url, {
    responseType: 'buffer',
    resolveBodyOnly: true
  });
  return body;
};

const generatePDF = async (templateName, data) => {
  try {
    const body = await got.post(`${process.env.PDF_GENERATOR_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: process.env.PDF_GENERATOR_TOKEN
      },
      json: {
        templateName,
        data
      },
      responseType: 'json',
      resolveBodyOnly: true
    });

    if (!Object.prototype.hasOwnProperty.call(body, 'data')) {
      console.error('Invalid generate response', templateName, body);
      throw new Error(
        `Invalid generate response for order ${templateName}: ${JSON.stringify(
          body
        )}`
      );
    }

    return body;
  } catch (error) {
    if (error instanceof got.HTTPError) {
      const { statusCode, body } = error.response;
      throw new Error(
        `Unexpected response status code for template ${templateName}: ${statusCode} - ${JSON.stringify(
          body
        )}`
      );
    }

    throw error;
  }
};

const generateBase64PDF = async (templateName, data) => {
  const body = await generatePDF(templateName, data);

  const { url, id } = body.data;

  const pdf = await getPdfFromUrl(url);
  
  return {
    id,
    base64: pdf.toString('base64'),
    url
  };
};

export default generateBase64PDF;