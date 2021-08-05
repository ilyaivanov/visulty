import { firebaseConfig } from "./config";
declare const firebase: any;

export const authorize = () =>
  firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

export const logout = () => firebaseAuth.signOut();

let firebaseAuth: ReturnType<typeof firebase.auth>;
export const initFirebase = (onAuthChanged: any) => {
  firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
  firebaseAuth.onAuthStateChanged(onAuthChanged);
};

export const saveUserSettings = (
  userSettings: PersistedState,
  userId: string
): Promise<any> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ id: userId, ...userSettings })
    .catch((e: any) => {
      console.error("Error while saving user settings");
    });

export const loadUserSettings = (userId: string): Promise<PersistedState> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((res: any) => res.data() as PersistedState);

export const auth = () => {};

const api = {
  saveUserSettings,
  loadUserSettings,
  auth,
};
export default api;
