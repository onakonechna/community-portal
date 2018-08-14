import { numProjectsToTrack, numProjectsToRecommend } from './../../config/Config';
import Counter from './../custom/Counter';
import { exp } from 'mathjs';
import * as _ from 'lodash';

function mapToObject(map: Map<string, any>) {
  const obj = Object.create(null);
  for (const [k, v] of map) {
    obj[k] = v;
  }
  return obj;
}

function setIfNotExists(map: Map<string, any>, key: any, value: any) {
  if (!map.has(key)) map.set(key, value);
}

function setSecondLevel(map: Map<string, any>, firstKey: string, secondKey: string, value: any) {
  setIfNotExists(map, firstKey, new Map());
  map.get(firstKey).set(secondKey, value);
}

function increment(map: Map<string, number>, key: any) {
  setIfNotExists(map, key, 0);
  map.set(key, map.get(key) + 1);
}

function recordTransition(
  transitions: Map<string, any>,
  signature: string,
  project_id: string,
) {
  setIfNotExists(transitions, signature, new Map());
  increment(transitions.get(signature), project_id);
}

function recordTransitionWithActions(
  transitions: Map<string, any>,
  signature: string,
  recommended: string[],
  project_id: string,
) {
  setIfNotExists(transitions, signature, new Map());
  for (const recommended_project of recommended) {
    setIfNotExists(transitions.get(signature), recommended_project, new Counter());
    transitions.get(signature).get(recommended_project).increment(project_id);
  }
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

function getNextStateSignature(signature: string, next_proj: string) {
  const next_state = getStateFromSignature(signature).slice(1);
  next_state.push(next_proj);
  return getSignature(next_state);
}

function resolveLastProjectInSignature(signature: string) {
  return getStateFromSignature(signature).pop();
}

/**
 * The data is partitioned by user_id and sorted by timestamp
 * We just need to iterate over the data to get the state transitions
 * k indicates the length of the sequence in a state
 * That is, how many projects into the past do we consider when making recommendations

 * hitTransitions keeps track of the state transitions where user adopts a recommendation
 * totalTransitions keeps track of the total transitiions regardless of
 * whether user adopts a recommendation
 */
interface DataInterface {
  user_id: string;
  recommended: any;
  project_id: string;
  timestamp: number;
}

/**
 * k represents the number of projects to *track*
 */
function getTransitions(data: DataInterface[], k: number) {
  const hitTransitions = new Map();
  const totalTransitions = new Map();
  const MDPTree = new Map();
  let state = data.length > 0 ? [data[0].project_id] : [];

  for (let i = 1; i < data.length; i += 1) {
    if (data[i].user_id !== data[i - 1].user_id) state = [];
    if (state.length === k && state[k - 1] !== data[i].project_id) {
      const signature = getSignature(state);
      // build MDP tree
      recordTransitionWithActions(
        MDPTree,
        signature,
        data[i - 1].recommended,
        data[i].project_id,
      );

      // record total and hit transitions (miss transitions calculated later)
      if (data[i - 1].recommended.includes(data[i].project_id)) {
        recordTransition(hitTransitions, signature, data[i].project_id);
      }
      recordTransition(totalTransitions, signature, data[i].project_id);
    }
    state.push(data[i].project_id);
    if (state.length > k) state.shift();
  }

  return { hitTransitions, totalTransitions, MDPTree };
}

function exp_decay(frac: number, param: number = 1) {
  return exp(-param * frac);
}

function initializePolicy(MDPTree: Map<string, any>, rewards: Counter) {
  const policy = new Map();
  MDPTree.forEach((actions: Map<string, Counter>, signature: string) => {
    policy.set(signature, new Counter());
    actions.forEach((nextState: Counter, recommended_project: string) => {
      policy.get(signature).set(recommended_project, rewards.get(recommended_project));
    });
    policy.set(signature, policy.get(signature).argMax());
  });
  return policy;
}

function getExpectedValue(
  transitionProb: Counter,
  values: Counter,
  state: string,
  rewards: Counter,
  gamma: number = .9,
) {
  const discountedValues = transitionProb.changeValue(() => 1)
    .changeKey((project_id: string) => getNextStateSignature(state, project_id))
    .multiply(values)
    .changeKey(resolveLastProjectInSignature)
    .multiply(gamma);
  return transitionProb.multiply(discountedValues.add(rewards)).sum();
}

function valueIteration(
  MDPTree: Map<string, any>,
  values: Counter,
  policy: Map<string, string>,
  rewards: Counter,
  gamma: number = .9,
) {
  const prevValues = values.copy();
  MDPTree.forEach((actions: Map<string, Counter>, state: string) => {
    const transitionProb = actions.get(policy.get(state));

    // when previously recommended projects are empty, transition prob may be undefined
    if (typeof transitionProb !== 'undefined') {
      values.set(state, getExpectedValue(transitionProb, prevValues, state, rewards, gamma));
    }
  });
}

function updatePolicy(
  MDPTree: Map<string, any>,
  values: Counter,
  policy: Map<string, string>,
  rewards: Counter,
  gamma: number = .9,
) {
  policy.forEach((action: string, state: string, map: Map<string, string>) => {
    let bestAction: string;
    let maxValue: number;
    MDPTree.get(state).forEach((transitionProb: Counter, action: string) => {
      const expectedValue = getExpectedValue(transitionProb, values, state, rewards, gamma);
      if (typeof maxValue === 'undefined' || expectedValue > maxValue) {
        maxValue = expectedValue;
        bestAction = action;
      }
    });
    map.set(state, bestAction);
  });
}

function hasConverged(a: Counter, b: Counter, threshold: number = 0.1) {
  return a.add(b.multiply(-1)).square().sum() < threshold;
}

function isEqual(a: Map<string, string>, b: Map<string, string>) {
  if (a.size !== b.size) return false;
  let flag = true;
  a.forEach((value: any, key: any) => {
    if (!b.has(key) || b.get(key) !== a.get(key)) flag = false;
  });
  return flag;
}

function policyIteration(
  MDPTree: Map<string, any>,
  values: Counter, policy:
  Map<string, string>,
  rewards: Counter,
  gamma: number = .9,
) {
  let lastValues: Counter;
  let lastPolicy: Map<string, string>;
  do {
    lastPolicy = new Map(policy);
    do {
      lastValues = values.copy();
      valueIteration(MDPTree, values, policy, rewards);
    }
    while (!hasConverged(lastValues, values));
    updatePolicy(MDPTree, values, policy, rewards);
  }
  while (!isEqual(lastPolicy, policy));
}

function buildTransitionMaps(hitTransitions: Map<string, any>, totalTransitions: Map<string, any>) {
  const hitTransitionMap = new Map();
  const missTransitionMap = new Map();

  totalTransitions.forEach((next_state: Map<string, number>, signature: string) => {
    next_state.forEach((totalCount: number, next_proj: string) => {
      const hitCount = getSecondLevelCount(hitTransitions, signature, next_proj);
      setSecondLevel(
        hitTransitionMap,
        signature,
        next_proj,
        hitCount / totalCount,
      );
      setSecondLevel(
        missTransitionMap,
        signature,
        next_proj,
        (totalCount - hitCount) / totalCount,
      );
    });
  });

  return { hitTransitionMap, missTransitionMap };
}

function getObservedTransitions(totalTransitions: Map<string, any>) {
  const result = new Map();
  totalTransitions.forEach((nextState: Map<string, number>, signature: string) => {
    result.set(signature, [...nextState.keys()]);
  });
  return result;
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

/**
 * This function gets the top k projects with the highest delta values
 * delta values are calculated as (P(hit) - P(miss)) * value(state)
 * this approach has been proven to optimize total rewards
 * corresponding to total project views adjusted by pledger proportions
 * proof can be found at http://www.jmlr.org/papers/volume6/shani05a/shani05a.pdf
 * k represents the maximum number of projects to *recommend*
 */
function getRecommendations(
  hitTransitionMap: any,
  missTransitionMap: any,
  values: Counter,
  observedTransitions: Map<string, string[]>,
  k: number,
) {
  const recommendations: any = {};
  observedTransitions.forEach((nextProjects: string[], signature: string) => {
    const nextStates = nextProjects.map((nextProj: string) => ({
      delta: delta(signature, nextProj, hitTransitionMap, missTransitionMap, values),
      id: nextProj,
    }));
    nextStates.sort((a: any, b: any) => a.delta < b.delta ? 1 : -1);
    recommendations[signature] = nextStates.slice(0, k).map((project: any) => project.id);
  });
  return recommendations;
}

/**
 * This function all projects ranked by reward
 * reward is calculated as e^(-pledged/estimated)
 * we give higher rewards to projects with less proportion of pledgers
 * so they will be recommended more frequently
 * we store all projects so that we can also use the projects list
 * when we want to randomly recommend k projects to encourage exploration
 * and facilitate learning in the reinforcement learning process
 * k represents the maximum number of projects to *recommend*
 */
function getDefaultRecommendations(rewards: Counter, k: number) {
  return [...rewards.getMap().entries()]
    .sort(([p1, r1], [p2, r2]) => r2 - r1)
    .map(([project, reward]) => project);
}

function trainProjectRecommendationModel(projects: any, traffic: DataInterface[]) {
  try {
    // construct data structures from input data for model building
    const {
      hitTransitions,
      totalTransitions,
      MDPTree,
    } = getTransitions(traffic, numProjectsToTrack);

    const {
      hitTransitionMap,
      missTransitionMap,
    } = buildTransitionMaps(hitTransitions, totalTransitions);

    // normalize transition counts to obtain empirical transition probabilities
    MDPTree.forEach((actionSpace: Map<string, Counter>) => {
      actionSpace.forEach((counter: Counter) => counter.normalize());
    });

    // initialize values and policy
    const values = new Counter(1);
    const rewards = new Counter();
    for (const { project_id, pledged, estimated } of projects) {
      if (estimated === 0) continue;
      rewards.set(project_id, exp_decay(pledged / estimated));
    }
    const policy = initializePolicy(MDPTree, rewards);

    // run policy iteration to find optimal values for the states
    policyIteration(MDPTree, values, policy, rewards);

    // generate recommendations for each state signature to be stored in S3
    const observedTransitions = getObservedTransitions(totalTransitions);
    const recommendations = getRecommendations(
      hitTransitionMap,
      missTransitionMap,
      values,
      observedTransitions,
      numProjectsToRecommend,
    );

    const defaultRecommendations = getDefaultRecommendations(rewards, numProjectsToRecommend);

    return {
      recommendations,
      defaultRecommendations,
    };

  } catch (error) {
    console.log(error);
  }
}

export default trainProjectRecommendationModel;
