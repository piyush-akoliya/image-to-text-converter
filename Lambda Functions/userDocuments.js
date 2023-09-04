const AWS = require("aws-sdk");
const S3 = new AWS.S3();

const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};

module.exports.userDocuments = async (event, context) => {
  try {
    const email = event.queryStringParameters.email;
    const listObjectsParams = {
      Bucket: "term-assignment-b00920744-1",
      Prefix: `output_documents/${email}/`,
    };

    const filesListResponse = await S3.listObjectsV2(
      listObjectsParams
    ).promise();
    const filesArray = filesListResponse.Contents.map((file) => ({
      Key: file.Key,
      Url: `https://term-assignment-b00920744-1.s3.amazonaws.com/${file.Key}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        filesList: filesArray,
      }),
      headers: headers,
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching files list.", headers }),
      headers: headers,
    };
  }
};
