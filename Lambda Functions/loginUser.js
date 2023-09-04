const AWS = require("aws-sdk");

const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
};

module.exports.login = async (event) => {
  let response = {};
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const requestBody = JSON.parse(event.body);
    // const requestBody = event;
    const email = requestBody.email;
    const password = requestBody.password;

    const keyalias = "encryptionKeys";

    const params = {
      TableName: "Users",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
      Limit: 1,
    };

    try {
      const result = await docClient.query(params).promise();

      if (result.Count === 0) {
        response = {
          statusCode: 400,
          body: JSON.stringify("User doesn't exist!!"),
          headers: headers,
        };
      } else {
        const user = result.Items[0];

        const decryptedPassword = await decryptDataWithKMS(
          user.password,
          keyalias
        );

        if (decryptedPassword == password) {
          const userName = user.name;
          const userEmail = user.email;
          response = {
            statusCode: 200,
            body: JSON.stringify({
              message: "Login successful",
              name: userName,
              email: userEmail,
            }),
            headers: headers,
          };
        } else {
          response = {
            statusCode: 401,
            body: JSON.stringify("Invalid credentials"),
            headers: headers,
          };
        }
      }
    } catch (error) {
      console.log(error);
      response = {
        statusCode: 500,
        body: JSON.stringify("Internal server error1"),
        headers: headers,
      };
    }
  } catch (error) {
    console.log(error);
    response = {
      statusCode: 500,
      body: JSON.stringify("Internal server error2"),
      headers: headers,
    };
  }
  return response;
};

async function decryptDataWithKMS(encryptedData, kmsKeyAlias) {
  try {
    const kms = new AWS.KMS();

    const describeKeyResult = await kms
      .describeKey({ KeyId: `alias/${kmsKeyAlias}` })
      .promise();

    const keyId = describeKeyResult.KeyMetadata.KeyId;

    const encryptedDataBuffer = Buffer.from(encryptedData, "base64");

    // Decrypt the data using AWS KMS
    const decryptionResult = await kms
      .decrypt({ CiphertextBlob: encryptedDataBuffer, KeyId: keyId })
      .promise();

    const decryptedData = decryptionResult.Plaintext.toString("utf-8");

    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data with AWS KMS:", error);
    throw error;
  }
}
