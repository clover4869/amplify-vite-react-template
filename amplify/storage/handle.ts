import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
    console.log("Event:", JSON.stringify(event, null, 2));

    try {
        const bucketName = event.Records[0].s3.bucket.name;
        const objectKey = event.Records[0].s3.object.key;
        console.log(`File uploaded to bucket ${bucketName} with key ${objectKey}`);

        // const apiHost = env.API_HOST;
        // const token = env.API_TOKEN;

        // const createThumbnailUrl = `${apiHost}/api/admin/event/folder/create-thumbnail`;
        // const requestData = {
        //     path: objectKey
        // };

        // const headers = {
        //     Authorization: `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // };

        // const response = await axios.post(createThumbnailUrl, requestData, { headers });
        // console.log("API Response:", response.data);
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error calling API'
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify('S3 event processed successfully!')
    };
};
