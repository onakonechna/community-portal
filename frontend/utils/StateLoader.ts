const localStorageIdentifier = "state";

export default class StateLoader {
  loadState() {
    try {
      let serializedState = localStorage.getItem(localStorageIdentifier);

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    }
    catch (err) {
      return this.initializeState();
    }
  }

  saveState(state: any) {
    try {
      let serializedState = JSON.stringify(state);
      localStorage.setItem(localStorageIdentifier, serializedState);
    }
    catch (err) {
    }
  }

  initializeState() {
    return {};
  };
}
