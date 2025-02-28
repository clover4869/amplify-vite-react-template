export const handle = async (event: any) => {
    console.log('helloworld', JSON.stringify(event, null, 2));

    return {
        statusCode: 200,
        body: 'Messages processed successfully!',
    };
};
