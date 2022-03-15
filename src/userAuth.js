import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
  } from 'amazon-cognito-identity-js'

  import { promisify } from "util"

  const poolData = {
    UserPoolId: "ca-central-1_qdkIWRnndca-central-1_qdkIWRnnd",
    ClientId: "66lbflc59gmmcbc1t93t5joje0"
  }

  const userPool = new CognitoUserPool(poolData)

  export async function signUp(username, password, email) {
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email })
    ]

    const cognitoSignUp = promisify(userPool.signUp).bind(userPool)

    try {
      const result = await cognitoSignUp(username, password, attributeList, null)
      const user = result.user
      return user
    } catch (error) {
      console.log("Error signing up", error)
    }
  }

  export async function confirmUser(username, code) {
    const userData = {
      Username: username,
      Pool: userPool
    }

    const cognitoUser = new CognitoUser(userData)
    const confirm = promisify(cognitoUser.confirmRegistration).bind(cognitoUser)

    try {
      const result = await confirm(code, false)
      return result
    } catch (error) {
      console.log("Error confirming user", error)
    }
  }
