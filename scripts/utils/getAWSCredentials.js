import {
  FileSystemCredentials,
  EnvironmentCredentials,
  SharedIniFileCredentials,
  CredentialProviderChain
} from 'aws-sdk';
import {
  info as logInfo,
  error as logError
} from 'npmlog';

export default function getAWSCredentials() {
  const providerChain = new CredentialProviderChain([
    new FileSystemCredentials('./awsCredentials.json'),
    new EnvironmentCredentials('AWS'),
    new SharedIniFileCredentials()
  ]);

  return new Promise((resolve, reject) => {
    providerChain.resolve((error, credentials) => {
      if (error) {
        logError('deploy', 'No AWS credentials found', error);
        reject(error);
        return;
      }

      logInfo('deploy', 'AWS credentials found', credentials);
      resolve(credentials);
    });
  });
}
