import Counter from './../../custom/Counter';

interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

function getSecondLevelCount(map: Map<string, any>, firstKey: string, secondKey: string) {
    if (map.has(firstKey)) {
        if (map.get(firstKey).has(secondKey)) return map.get(firstKey).get(secondKey);
    }
    return 0;
}

function getSignature(array: string[]) {
  return JSON.stringify(array);
}

function getStateFromSignature(signature: string) {
  return JSON.parse(signature);
}

function getNextStateSignature(signature: string, next: string) {
  let nextState = getStateFromSignature(signature).slice(1);
  nextState.push(next);
  return getSignature(nextState);
}

function delta(
  signature: string,
  nextProj: string,
  hitTransitionMap: any,
  missTransitionMap: any,
  values: Counter,
) {
  return (
    getSecondLevelCount(hitTransitionMap, signature, nextProj)
      - getSecondLevelCount(missTransitionMap, signature, nextProj)
  )
    * values.get(getNextStateSignature(signature, nextProj));
}

// k represents the number of projects to recommend
function packageModel(
  values: Counter,
  hitTransitionMap: any,
  missTransitionMap: any,
  observedTransitions: any,
  k: number,
) {
  return (state: string[], nextProj: string) => {
    const signature = getSignature(state);
    if (!observedTransitions.has(signature)) return [];
    const nextProjects = observedTransitions.get(signature);
    const nextStates = nextProjects.map((nextProj: string) => ({
      delta: delta(signature, nextProj, hitTransitionMap, missTransitionMap, values),
      id: nextProj,
    }));
    nextStates.sort((a: any, b: any) => a.delta < b.delta);
    return nextStates.slice(0, k).map((project: any) => project.id);
  }
}

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getModel(data: any) {
    return (result: any) => {
      const { values, hitTransitionMap, missTransitionMap, observedTransitions } = JSON.parse(result.Body.toString());
      const model = packageModel(values, hitTransitionMap, missTransitionMap, observedTransitions, 3);

      return { model };
    };
  }

  getRecommendations(data: any) {
    return (result: any) => {
      const { recommended } = result;
      return { recommended };
    };
  }

  // special controllers
  null(data: any) {
    return (result: any) => {};
  }

}
