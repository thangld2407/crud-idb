import { openDB } from 'idb';
import { Room } from './room';

const DATABASE_NAME = 'roomStore';

async function initDB() {
    const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
            const store = db.createObjectStore('roomStore', {
                keyPath: 'id',
                autoIncrement: true,
            })
        }
    });
};

initDB().then(() => {
    console.log("Database already to use");
});

export async function createRoom(room: any) {
    const db = await openDB(DATABASE_NAME, 1);

    await db.put('roomStore', room)
        .then(() => {
            console.log("You have been create 1 room: ", room);
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function updateRoom(newRoom: any, id: number) {
    const db = await openDB(DATABASE_NAME, 1);
    const room = await db.transaction('roomStore').objectStore('roomStore').get(id) as Room;
    room.properties = newRoom.properties;
    room.bedrooms = newRoom.bedrooms;
    room.dateTime = newRoom.dateTime;
    room.monthlyRentPrice = newRoom.monthlyRentPrice;
    room.furnished = newRoom.furnished;
    room.notes = newRoom.notes;
    room.reporter = newRoom.reporter;

    await db.put(DATABASE_NAME, room)
        .then(() => {
            console.log("udpate susccessfully");
            console.log(room);
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function deleteRoom(id: number) {
    const db = await openDB(DATABASE_NAME, 1);

    await db.delete('roomStore', id)
        .then(() => {
            console.log("Delete room successfully");
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function getOneRoom(id: number) {
    const db = await openDB(DATABASE_NAME, 1);

    const room = await db.transaction('roomStore').objectStore('roomStore').get(id);

    return room;
}

export async function getAllRoom() {
    const db = await openDB(DATABASE_NAME, 1);

    let room = await db.transaction('roomStore').objectStore('roomStore').openCursor();

    let allRoom = [];

    while (room) {
        allRoom.push(room.value);
        room = await room.continue();
    }
    return allRoom;
}