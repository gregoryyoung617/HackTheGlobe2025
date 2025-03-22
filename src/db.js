import { collection, addDoc } from "firebase/firestore";

// export class Database {
//     constructor () {
//     }
//     addData() {
//       try {
//         const docRef = await addDoc(collection(db, "your-collection-name"), {
//           name: "John Doe",
//           age: 30,
//         });
//         console.log("Document written with ID: ", docRef.id);
//       } catch (e) {
//         console.error("Error adding document: ", e);
//       }
//     }

// }