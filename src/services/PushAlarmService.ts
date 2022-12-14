import admin from 'firebase-admin';
import serviceAccount from '../../firebase-admin.json';

const firebaseKeys = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
});

const pushAlarm = async (fcmToken: string, nickname: string, groupId: string) => {
  try {
    const message = {
      notification: {
        title: '그룹 초대',
        body: `[${nickname}] 님의 방에 초대되었습니다.`
      },
      data: {
        groupId: groupId
      },
      token: fcmToken,
    };

    admin
      .messaging()
      .send(message)
      .then(function (res) {
        console.log('Successfully sent message: : ', res);
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const PushAlarmService = {
  pushAlarm,
};

export default PushAlarmService;
