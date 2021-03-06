import { IonContent, IonRow, IonCol, IonTitle, IonInput, IonList, IonItem, IonLabel, IonButton, IonToggle, IonNote } from '@ionic/react';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from '../firebase';
import { useHistory } from 'react-router-dom';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = () => {
    setLoginError(null);
    signInWithEmailAndPassword(email, password, rememberMe)
      .then(() => history.push('/chats'))
      .catch(error => {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setLoginError('Der angegebene Benutzer existiert nicht oder das Passwort ist falsch.');
            break;
          default:
            setLoginError('Anmeldung fehlgeschlagen.');
        }
      });
  };

  return (
    <IonContent>
      <IonRow>
        <IonCol>
          <IonTitle>Anmeldung</IonTitle>
          <IonNote>Wenn du als Berater bei EMMA Buddy registriert bist, kannst du dich hier anmelden.</IonNote>
        </IonCol>
      </IonRow>
      {loginError ? (
        <IonRow>
          <p className='callout callout-error'>{loginError}</p>
        </IonRow>
      ) : null}
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem>
              <IonLabel position='stacked'>E-Mail Adresse</IonLabel>
              <IonInput type='text' value={email} onIonChange={e => setEmail(e.detail.value || '')}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position='stacked'>Passwort</IonLabel>
              <IonInput type='password' value={password} onIonChange={e => setPassword(e.detail.value || '')}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Angemeldet bleiben</IonLabel>
              <IonToggle checked={rememberMe} onIonChange={e => setRememberMe(e.detail.checked)} />
            </IonItem>
          </IonList>
          <div className='ion-padding'>
            <IonButton expand='block' class='ion-no-marging' onClick={login}>
              Anmelden
            </IonButton>
          </div>
        </IonCol>
      </IonRow>
    </IonContent>
  );
};

export default LoginForm;
