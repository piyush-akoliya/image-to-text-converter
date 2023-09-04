const AWS = require("aws-sdk");
const S3 = new AWS.S3();

module.exports.deleteFile = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const userEmail = event.queryStringParameters.email;
    const documentName = event.queryStringParameters.documentName;

    const s3Key = `output_documents/${userEmail}/${documentName}`;

    await S3.deleteObject({
      Bucket: "term-assignment-b00920744-1",
      Key: s3Key,
    }).promise();

    const listObjectsResponse = await S3.listObjectsV2({
      Bucket: "term-assignment-b00920744-1",
      Prefix: `output_documents/${userEmail}/`,
    }).promise();
    const availableFiles = listObjectsResponse.Contents.map((item) => ({
      Key: item.Key,
      Url: `https://term-assignment-b00920744-1.s3.amazonaws.com/${item.Key}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Deleted file ${documentName} successfully`,
        filesList: availableFiles,
      }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting the document." }),
      headers: {
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
