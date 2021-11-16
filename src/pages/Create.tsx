import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { addCircleOutline as add, bed } from 'ionicons/icons'

import './Home.css';

import { createRoom } from "../databaseHandle";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";

export function isEmptyOrWhiteSpace(value: string) {
  const re = /^\s*$/;
  return re.test(value);
}

export function isNumber(value: string) {
  const re = /^\d+$/;
  return re.test(value);
}

export function validateDate(value: string) {
  const re = /^\d{4}[\/.]\d{1,2}[\/.]\d{1,2}$/;
  return re.test(value);
}

function convertDate(date: string) {
  if (!date) {
    return '';
  }

  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1);
  const day = newDate.getDate();


  return formartDateYearMonthDay(year, month, day);
};

function formartDateYearMonthDay(year: number, month: number, date: number) {
  if (!year && !month && !date) {
    return '';
  }

  return `${year}/${month}/${date}`;
};

function validateForm(Form: any) {
  const properties = ['Flat', 'House', 'Bungalow'];
  const bedrooms = ['Studio', 'One', 'Two'];
  const furnished = ['Furnished', 'Unfurnished', 'PartFunished'];

  let isValidated = [];

  for (const index in Form) {
    if (Object.prototype.hasOwnProperty.call(Form, index)) {
      const el = Form[index];
      switch (index) {
        case 'monthlyRentPrice': {
          if (!isNumber(el)) {
            isValidated.push('You need to enter monthly rent price');
          }
          break;
        }
        case 'dateTime': {
          if (!validateDate(el)) {
            isValidated.push('You need to enter Date Time')
          }
          break;
        }
        case 'notes': {

          break;
        }
        case 'properties': {
          if (!properties.includes(el)) {
            isValidated.push('You need to enter type of Houses');
          }
          break;
        }
        case 'bedrooms': {
          if (!bedrooms.includes(el)) {
            isValidated.push('You need to enter type of Bedrooms');
          }
          break;
        }
        case 'furnished': {
          if (!furnished.includes(el)) {
            isValidated.push(' You need to enter type of Furnitures');
          }
          break;
        }
        case 'reporter': {
          if (isEmptyOrWhiteSpace(el)) {
            isValidated.push('You need to enter name of Reporter');
          }
          break;
        }
        // default:{
        //   isValidate.push(false);
        // }
      }
    }
  }
  return isValidated;
}

function createMessageError(listError: any) {
  const message = listError.join('<br>');

  return `${message}`;
}

const Create: React.FC = () => {
  const [properties, setProperties] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [monthlyRentPrice, setMonthlyRentPrice] = useState('');
  const [furnished, setFurnished] = useState('');
  const [notes, setNotes] = useState('');
  const [reporter, setReporter] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [colorMessage, setColorMessage] = useState('');

  const history = useHistory();

  const addNewRoom = async () => {
    const newRoom = {
      properties: properties,
      bedrooms: bedrooms,
      dateTime: convertDate(dateTime),
      monthlyRentPrice: monthlyRentPrice,
      furnished: furnished,
      notes: notes,
      reporter: reporter,
    };
    const validateFormAddNewRoom: any = validateForm(newRoom);

    if (validateFormAddNewRoom.length === 0) {

      setMessage('You created a new room');
      setShowToast(true);
      setColorMessage('success');
      await createRoom(newRoom);
      history.goBack();

      setTimeout(() => {
        setShowToast(false);
      }, 3000)
    } else {
      setMessage(createMessageError(validateFormAddNewRoom));
      setShowToast(true);
      setColorMessage('warning');

      setTimeout(() => {
        setShowToast(false);
      }, 3000)
    }
  }
  return (
    <IonPage>
      <IonHeader translucent>
      <IonToolbar>
          <div className="header-style">
            <IonButton color="light" mode="ios">
              <IonBackButton />
            </IonButton>
            <IonTitle>Create New Room</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Property Type</IonLabel>
            <IonSelect onIonChange={e => setProperties(e.detail.value)}>
              <IonSelectOption value="Flat">Flat</IonSelectOption>
              <IonSelectOption value="House">House</IonSelectOption>
              <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Bedroom</IonLabel>
            <IonSelect onIonChange={e => setBedrooms(e.detail.value)} >
              <IonSelectOption value="One">One</IonSelectOption>
              <IonSelectOption value="Studio">Studio</IonSelectOption>
              <IonSelectOption value="Two">Two</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Choose Date Time</IonLabel>
            <IonDatetime onIonChange={e => setDateTime(e.detail.value!)} displayFormat="YYYY/MM/DD"></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Monthly rent price</IonLabel>
            <IonInput onIonChange={e => setMonthlyRentPrice(e.detail.value!)} type="number" required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Furniture Type</IonLabel>
            <IonSelect onIonChange={e => setFurnished(e.detail.value)} >
              <IonSelectOption value="Furnished">Furnished</IonSelectOption>
              <IonSelectOption value="PartFunished">Part Furnished</IonSelectOption>
              <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Notes</IonLabel>
            <IonTextarea onIonChange={e => setNotes(e.detail.value!)} placeholder="Optional"></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Reporter</IonLabel>
            <IonInput onIonChange={e => setReporter(e.detail.value!)} type="text"></IonInput>
          </IonItem>
          <IonButton fill="solid" expand="block" className="btn-create" onClick={addNewRoom}>
            <IonIcon icon={add} /> Create
          </IonButton>
        </IonList>
      </IonContent>
      <IonToast
        message={message}
        isOpen={showToast}
        position="bottom"
        color={colorMessage}
      />
    </IonPage>
  );
};

export default Create;