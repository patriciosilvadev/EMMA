import React, { useState } from 'react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonMenuButton,
  IonPage,
  IonIcon,
  IonToolbar,
  IonButton,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonRouterLink
} from '@ionic/react';
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import './Chat.css';
import { useStores, useMessageGroups } from '../hooks';
import { archiveChat } from '../firebase';
import ChatOutput from '../components/ChatOutput';
import ChatInput from '../components/ChatInput';
import EmptyStateContainer from '../components/EmptyStateContainer';

interface ChatProps extends RouteComponentProps<{ cid: string }> {}

const Chat: React.FC<ChatProps> = ({ match }) => {
  const { firebaseStore } = useStores();

  const messageGroups = useMessageGroups(firebaseStore.isLoggedIn, match.params.cid);
  const user = firebaseStore.user;
  const chat = firebaseStore.chat(match.params.cid);
  const buddy = chat ? firebaseStore.buddy(chat.bid) : null;
  const userIsBuddy = chat && user && chat.bid === user.uid;

  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setShowPopoverEvent] = useState<any | undefined>(undefined);

  const openPopover = (event: any) => {
    console.log(event);
    event.persist();
    setShowPopover(true);
    setShowPopoverEvent(event);
  };

  const history = useHistory();
  const closeChat = () => {
    archiveChat(match.params.cid)
      .then(() => {
        history.push('/chats');
      })
      .catch(error => {
        console.error('Failed to archive chat', error);
      });
  };

  if (user && chat) {
    return (
      <IonPage>
        <IonHeader className='ion-no-border'>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonButtons slot='primary'>
              <IonButton color='primary' onClick={event => openPopover(event)}>
                <IonIcon slot='icon-only' ios={ellipsisHorizontal} md={ellipsisVertical} />
              </IonButton>
            </IonButtons>
            <IonTitle>{user.uid && buddy ? `Chat mit ${userIsBuddy ? `Anonymer Nutzer ${chat?.uid}` : buddy?.givenName}` : 'Chat'}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonPopover isOpen={showPopover} event={popoverEvent} onDidDismiss={() => setShowPopover(false)}>
          <IonList lines='none'>
            <IonItem button onClick={closeChat}>
              <IonLabel color='danger'>Chat Beenden</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>

        <ChatOutput chat={chat} user={user} messageGroups={messageGroups} />
        <ChatInput chat={chat} user={user} />
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader className='ion-no-border'>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <EmptyStateContainer message='Fehler beim Laden des Chats.'>
            Zurück zur{' '}
            <IonRouterLink href='/chats' color='primary'>
              Übersichtsseite
            </IonRouterLink>
            .
          </EmptyStateContainer>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(Chat);
