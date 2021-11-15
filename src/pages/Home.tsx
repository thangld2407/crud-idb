import {  IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar, useIonAlert } from '@ionic/react';
import { home as homeIcon, create as createIcon, home, add, close, createOutline, addCircle, key, searchCircleOutline, searchCircle, searchCircleSharp, searchOutline } from 'ionicons/icons'

import './Home.css';

import { deleteRoom, getAllRoom } from '../databaseHandle';
import { Room } from '../room';
import { useEffect, useState } from 'react';
const Home: React.FC = () => {
  const [room, setRooms] = useState<Room[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [prensent] = useIonAlert();
  async function fetchData() {
    const allRoom = await getAllRoom();
    setRooms(allRoom);
  }
  useEffect(() => {
    fetchData();
  }, []);
  async function doRefresh(event: any) {
    setMessage('Data have been updated');
    setShowToast(true);
    fetchData();
    setTimeout(()=>{
      event.detail.complete();
      setShowToast(false);
    },500)
  }
  async function handeDelete(id: number) {
    prensent({
      header: 'Warning',
      message: 'Do You Want To Delete This Room?',
      buttons: [
        'No',
        {
          text: 'Yes', handler: async (d) => {
            await deleteRoom(id);
            setMessage('You have been delete this rooom');
            setShowToast(true);

            setTimeout(() => {
              setShowToast(false);
            }, 3000);
            await fetchData();
          }
        }
      ],
      onDidDismiss: (e) => console.log("Dismiss")
    })
  }

  return (
    <IonPage className="container-content">
      <IonHeader translucent>
        <div className="header">
          <IonGrid>
            <IonRow>
              <IonCol><h2>Manage Room Page</h2></IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonGrid>
          <div className="content">
            {room &&
              room.map((listRoom, index) =>
                <IonCard key={index}>
                  <IonCardHeader><h2>Room ID: {listRoom.id}</h2></IonCardHeader>
                  <IonCardContent>

                    <IonRow>
                      <IonCol size="7" className="display-content">
                        <p> Property Type: </p>
                        <p> Bed Rooms: </p>
                        <p> Date Time Adding: </p>
                        <p> Monthly Rent Price: </p>
                        <p> Furniture Types: </p>
                        <p> Name Reporter: </p>
                        <p> Notes: </p>

                      </IonCol>
                      <IonCol size="5" className="display-detail">
                        <p>{listRoom.properties}</p>
                        <p>{listRoom.bedrooms}</p>
                        <p>{listRoom.dateTime}</p>
                        <p>{listRoom.monthlyRentPrice}</p>
                        <p>{listRoom.furnished}</p>
                        <p>{listRoom.reporter}</p>
                        <p>{listRoom.notes}</p>
                      </IonCol>
                    </IonRow>
                  </IonCardContent>
                  <IonRow>
                    <IonCol className="btn-icon">
                      <div className="btn-icon">
                        <IonButton routerLink={`update/${listRoom.id}`}>
                          <IonIcon icon={createOutline} />
                        </IonButton>
                      </div>
                    </IonCol>
                    <IonCol className="btnicon">
                      <div className="btn-icon">
                        <IonButton color="danger" onClick={() => handeDelete(listRoom.id || 1)}>
                          <IonIcon icon={close} />
                        </IonButton>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonCard>
              )}
          </div>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <div className="footer">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full" shape="round" href="/home" >
                  <IonIcon icon={home} /> Home
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" color="warning" shape="round" routerLink="/create">
                  <IonIcon icon={addCircle} /> Creat
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <IonToast isOpen={showToast} message={message} color="success" position="bottom"></IonToast>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
