import {ElasticBeanstalk} from 'aws-sdk';
import {
  info as logInfo,
  error as logError
} from 'npmlog';
import getAWSCredentials from './utils/getAWSCredentials';

const DEPLOYMENT_ID = process.env.GIT_COMMIT;

logInfo(`Deploying version ${DEPLOYMENT_ID}`);

(async () => {
  const credentials = await getAWSCredentials();

  const elasticBeanstalk = new ElasticBeanstalk({
    credentials,
    region: 'us-west-2'
  });
  elasticBeanstalk.createApplicationVersion({
    ApplicationName: 'foodie-server',
    VersionLabel: DEPLOYMENT_ID,
    Description: `commit:${process.env.GIT_COMMIT}/build-number:${process.env.BUILD_NUMBER}`,
    Process: true,
    SourceBundle: {
      S3Bucket: 'foodie-server',
      S3Key: 'foodie-server.zip'
    }
  }, (error, data) => {
    if (error) {
      logError('deploy', 'createApplicationVersion failed:', error);
      return;
    } else {
      logInfo('deploy', 'createApplicationVersion succeeded:', data);
    }

    elasticBeanstalk.updateEnvironment({
      EnvironmentName: 'foodieserver',
      VersionLabel: DEPLOYMENT_ID
    }, (error, data) => {
      if (error) {
        logError('deploy', 'updateEnvironment failed:', error);
      } else {
        logInfo('deploy', 'updateEnvironment succeeded:', data);
      }
    });
  });
})();
