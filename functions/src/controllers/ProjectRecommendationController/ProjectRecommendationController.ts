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
  const nextState = getStateFromSignature(signature).slice(1);
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
  console.log('t1', getSecondLevelCount(hitTransitionMap, signature, nextProj));
  console.log('t2', getSecondLevelCount(missTransitionMap, signature, nextProj));
  console.log('t3', values);
  console.log('t4', values.get(getNextStateSignature(signature, nextProj)));
  return (
    getSecondLevelCount(hitTransitionMap, signature, nextProj)
      - getSecondLevelCount(missTransitionMap, signature, nextProj)
  )
    * values.get(getNextStateSignature(signature, nextProj));
}

function getRandomElements(array: any[], n: number) {
  const shuffled = array.sort(() => .5 - Math.random());
  return shuffled.slice(0, n);
}

function randomModel(state: string[]) {
  const projects = [
    '8f1b18ab-907f-4c59-8778-f56154fd6c27',
    'd2de6415-403f-41d1-b722-c178653828c7',
    'b8c129ed-d004-4fa7-9012-61f3e95bd757',
    'e701e6b3-c39c-408e-9188-2df4e6fc6a81',
  ];
  if (state.length === 0) return getRandomElements(projects, 2);

  const projectPool: any = [];
  for (const project of projects) {
    if (project !== state[state.length-1]) projectPool.push(project);
  }
  return getRandomElements(projectPool, 2);
}

// k represents the number of projects to recommend
function packageModel(
  values: Counter,
  hitTransitionMap: any,
  missTransitionMap: any,
  observedTransitions: any,
  k: number,
) {
  return (state: string[]) => {
    try {
      const signature = getSignature(state);
      if (!observedTransitions.has(signature)) return randomModel(state);
      const nextProjects = observedTransitions.get(signature);
      const nextStates = nextProjects.map((nextProj: string) => ({
        delta: delta(signature, nextProj, hitTransitionMap, missTransitionMap, values),
        id: nextProj,
      }));
      console.log('before sorting! +++', nextStates);
      nextStates.sort((a: any, b: any) => a.delta < b.delta);
      console.log('Sorted! ================================');
      console.log(nextStates);
      return nextStates.slice(0, k).map((project: any) => project.id);
    } catch (e) {
      console.log('error:', e);
    }
  };
}

function buildSecondLevelMap(nestedList: any) {
  const result = new Map(nestedList);
  result.forEach((list: any, key: any, map: Map<any, any>) => {
    map.set(key, new Map(list));
  })
  return result;
}

export default class ProjectRecommendationController implements ProjectTrafficControllerInterface {

  // intermediary controllers
  getModel(data: any) {
    return (result: any) => {
      if (typeof result === 'undefined') return { model: randomModel };

      let {
        values,
        hitTransitionMap,
        missTransitionMap,
        observedTransitions,
      } = JSON.parse(result.Body.toString());

      values = new Counter(values);
      hitTransitionMap = buildSecondLevelMap(hitTransitionMap);
      missTransitionMap = buildSecondLevelMap(missTransitionMap);
      observedTransitions = buildSecondLevelMap(observedTransitions);

      console.log('values:', values)
      console.log('hitTransitionMap:', hitTransitionMap)
      console.log('missTransitionMap:', missTransitionMap)
      console.log('observedTransitions:', observedTransitions)

      const model = packageModel(
        values,
        hitTransitionMap,
        missTransitionMap,
        observedTransitions,
        3,
      );

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
