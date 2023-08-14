import got from 'got';

const getSunshineConversationData = async (
  userId
) => {
  try {
    const body = await got.get(
      `https://api.smooch.io/v2/apps/${process.env.ZENDESK_APP_ID}/users/${userId}/clients`,
      {
        headers: {
          Authorization: `Basic ${process.env.ZENDESK_API_KEY}`
        },
        responseType: 'buffer',
        resolveBodyOnly: true
      }
    ).json();

    return body;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getSunshineConversationData;