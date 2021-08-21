import { forEachChild } from "../items";
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
  userSettings: MappedPersistedState,
  userId: string
): Promise<any> => {
  const state: PersistedState = {
    itemsSerialized: serializeRootItem(userSettings.root),
  };
  return firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ id: userId, ...state })
    .catch((e: any) => {
      console.error("Error while saving user settings");
    });
};

export const loadUserSettings = (
  userId: string
): Promise<MappedPersistedState> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((res: any) => {
      const state = res.data() as PersistedState;
      return {
        root: deserializeRootItem(state.itemsSerialized),
      };
    });

export const auth = () => {};

const api = {
  saveUserSettings,
  loadUserSettings,
  auth,
};
export default api;

export const serializeRootItem = (item: MyItem): string =>
  JSON.stringify(item, (key, value) => {
    if (key !== "parent") {
      return value;
    }
    return undefined;
  });

export const deserializeRootItem = (item: string): MyItem => {
  const parsed = JSON.parse(item) as MyItem;
  forEachChild(parsed, (item, parent) => (item.parent = parent));
  return parsed;
};
