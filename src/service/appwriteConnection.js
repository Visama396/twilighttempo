import { Client, Account } from 'appwrite'

const appwriteClient = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("68de9d570025737d5967")

const appwriteAccount = new Account(appwriteClient)

export { appwriteAccount, appwriteClient };