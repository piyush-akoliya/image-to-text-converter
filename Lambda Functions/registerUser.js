const AWS = require("aws-sdk");
const SecretsManager = new AWS.SecretsManager();

const region = "us-east-1";

const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};

const registerUser = async (event) => {
  try {
    const keyalias = "encryptionKeys";
    AWS.config.update({ region });
    const docClient = new AWS.DynamoDB.DocumentClient();

    // const requestBody = event;
    const requestBody = JSON.parse(event.body);
    const checkUserParams = {
      TableName: "Users",
      Key: {
        email: requestBody.email,
      },
    };

    const existingUser = await docClient.get(checkUserParams).promise();
    if (existingUser.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "User with this email already exists.",
        }),
        headers: headers,
      };
    }

    const encryptedPassword = await encryptDataWithKMS(
      requestBody.password,
      keyalias
    );

    const params = {
      TableName: "Users",
      Item: {
        name: requestBody.name,
        email: requestBody.email,
        password: encryptedPassword,
      },
    };

    await docClient.put(params).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully" }),
      headers: headers,
    };

    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: headers,
    };
  }
};

module.exports.register = async (event, context) => {
  try {
    const response = await registerUser(event);
    return response;
  } catch (error) {
    console.error("Error handling the request:", error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

async function encryptDataWithKMS(dataToEncrypt, kmsKeyAlias) {
  try {
    const kms = new AWS.KMS();
    console.log(dataToEncrypt);
    console.log(kmsKeyAlias);

    const dataBuffer = Buffer.from(dataToEncrypt, "utf-8");

    const describeKeyResult = await kms
      .describeKey({ KeyId: `alias/${kmsKeyAlias}` })
      .promise();

    const keyId = describeKeyResult.KeyMetadata.KeyId;

    const encryptionResult = await kms
      .encrypt({ KeyId: keyId, Plaintext: dataBuffer })
      .promise();
    console.log(encryptionResult);
    const encryptedData = encryptionResult.CiphertextBlob.toString("base64");
    console.log(encryptedData);
    return encryptedData;
  } catch (error) {
    console.error("Error encrypting data with AWS KMS:", error);
    throw error;
  }
}
