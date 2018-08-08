interface ProjectTrafficControllerInterface {
  getRecommendations(data: any): (result: any) => any;
}

function getSecondLevelCount(map: Map<string, number>, firstKey: string, secondKey: string) {
    if (map.has(firstKey)) {
        if (map.get(firstKey).has(secondKey)) return map.get(firstKey).get(secondKey);
    }
    return 0;
}

function getStateFromSignature(signature: string) {
  return JSON.parse(signature);
}

function getNextStateSignature(signature: string, next: string) {
  let nextState = getStateFromSignature(signature).slice(1);
  nextState.push(next);
  return getSignature(nextState);
}

function delta(project_seq_signature: string, next_proj: string, hitTransitionFunc: any, missTransitionFunc: any, values: Counter) {
  return (hitTransitionFunc(project_seq_signature, next_proj) - missTransitionFunc(project_seq_signature, next_proj)) * values.get(getNextStateSignature(project_seq_signature, next_proj));
}

hitTransitionFunc: (signature: string, next: string) => getSecondLevelCount(hitTransitionMap, signature, next),
missTransitionFunc: (signature: string, next: string) => getSecondLevelCount(missTransitionMap, signature, next),

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getModel(data: any) {
    return (result: any) => {
      const { values, hitTransitionMap, missTransitionMap, observedTransitions } = JSON.parse(result.Body.toString());

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
