const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const textract = new AWS.Textract();

const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};
//code to extract text from image
module.exports.imgToText = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    context.timeout = 300000;
    console.log(event);
    const requestBody = JSON.parse(event.body);
    const imageBase64 = requestBody.image;
    const email = requestBody.email;
    const name = requestBody.name;
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const timestamp = Date.now();
    const s3Key = `input_images/${email}/${name}_${timestamp}.jpg`;

    const s3Params = {
      Bucket: "term-assignment-b00920744-1",
      Key: s3Key,
      Body: imageBuffer,
    };

    //uploading the file to s3
    const uploadResponse = await S3.upload(s3Params).promise();

    console.log("Uploaded image URL:", uploadResponse.Location);

    const textractParams = {
      Document: {
        S3Object: {
          Bucket: "term-assignment-b00920744-1",
          Name: s3Key,
        },
      },
      FeatureTypes: ["FORMS"],
    };

    //textract response to extract the text from file
    const textractResponse = await new Promise((resolve, reject) => {
      textract.analyzeDocument(textractParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const extractedText = textractResponse.Blocks.filter(
      (block) => block.BlockType === "LINE"
    )
      .map((block) => block.Text)
      .join(" ");

    console.log("Extracted Text:", extractedText);

    // URL of the txt file generated
    const textDocumentKey = `output_documents/${email}/${name}_${timestamp}.txt`;
    const textDocumentParams = {
      Bucket: "term-assignment-b00920744-1",
      Key: textDocumentKey,
      Body: extractedText,
    };

    const textDocument = await S3.upload(textDocumentParams).promise();
    const textDocumentUrl = `https://term-assignment-b00920744-1.s3.amazonaws.com/${textDocumentKey}`;

    const listObjectsParams = {
      Bucket: "term-assignment-b00920744-1",
      Prefix: `output_documents/${email}/`,
    };

    //listing the file present in the document
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
        message: "Image uploaded and text extracted successfully!",
        textDocumentUrl,
        filesList: filesArray,
      }),
      headers: headers,
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading the image or extracting text.",
        headers,
      }),
      headers: headers,
    };
  }
};
