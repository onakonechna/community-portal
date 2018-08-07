import { exp } from 'mathjs';
import * as _ from 'lodash';

// Helper classes and functions

class Counter {
    private isCounter: boolean;

    constructor(default_value: number = 0, map: any = undefined) {
        this.map = new Map(map);
        this.default_value = default_value;
        this.isCounter = true;
    }

    size() {
        return this.map.size;
    }

    copy() {
        return new Counter(this.default_value, this.map);
    }

    has(key: any) {
        return this.map.has(key);
    }

    set(key: any, value: number) {
        this.map.set(key, value);
    }

    setIfNotExists(key: any, value: any) {
        if (!this.has(key)) this.set(key, value);
    }

    get(key: any) {
        setIfNotExists(this.map, key, this.default_value);
        return this.map.get(key);
    }

    increment(key: any) {
        this.set(key, this.get(key) + 1);
    }

    square() {
        const counter = this.copy();
        this.map.forEach((value: number, key: any) => {
            counter.set(key, value * value);
        });
        return counter;
    }

    equals(other: Counter) {
        if (!other.isCounter || !(this.default_value === other.default_value)) return false;
        if (!(this.size() !== other.size())) return false;
        this.map.forEach((value: number, key: any) => {
            if (!other.has(key) || other.get(key) !== this.get(key)) return false;
        });
        return true;
    }

    op(func: any, other: any) {
        const counter = this.copy();
        if (typeof other == 'number') {
            counter.map.forEach((value: number, key: any) => {
                counter.set(key, func(value, other));
            })
        } else if (other.isCounter) {
            counter.map.forEach((value: number, key: any) => {
                counter.set(key, func(value, other.get(key)));
            })
        } else {
            throw 'A Counter object can only be operated with a number or another Counter';
        }
        return counter;
    }

    add(other: any) {
        return this.op((a: number, b: number) => a + b, other);
    }

    multiply(other: any) {
        return this.op((a: number, b: number) => a * b, other);
    }

    sum() {
        let sum = 0;
        this.map.forEach((value: number) => { sum += value });
        return sum;
    }

    normalize() {
        const sum = this.sum();
        this.map.forEach((value: number, key: any, map: Map<any, number>) => {
            map.set(key, value / sum);
        });
    }

    argMax() {
        let maxKey: number;
        let maxValue: number;
        this.map.forEach((value: number, key: any) => {
            if (typeof maxValue === 'undefined' || value > maxValue) {
                maxKey = key;
                maxValue = value;
            }
        });
        return maxKey;
    }

    changeKey(func: any) {
        const counter = new Counter(this.default_value);
        this.map.forEach((value: number, key: any) => {
            counter.set(func(key), value);
        });
        return counter;
    }

    changeValue(func: any) {
        const counter = this.copy();
        this.map.forEach((value: number, key: any) => {
            counter.set(key, func(value));
        });
        return counter;
    }
}

function setIfNotExists(map: Map<string, any>, key: any, value: any) {
  if (!map.has(key)) map.set(key, value);
}

function setSecondLevel(map: Map<string, any>, firstKey: string, secondKey: string, value: any) {
    setIfNotExists(map, firstKey, new Map());
    map.get(firstKey).set(secondKey, value);
}

function getSecondLevelCount(map: Map<string, any>, firstKey: string, secondKey: string) {
    if (!map.has(firstKey)) return -1;
    if (!map.get(firstKey).has(secondKey)) return -1;
    return map.get(firstKey).get(secondKey);
}

function increment(map: Map<string, number>, key: any) {
  setIfNotExists(map, key, 0);
  map.set(key, map.get(key) + 1);
}

function recordTransition(transitions: Map<string, any>, project_seq_signature: string, project_id: string) {
    setIfNotExists(transitions, project_seq_signature, new Map());
    increment(transitions.get(project_seq_signature), project_id);
}

function recordTransitionWithActions(transitions: Map<string, any>, project_seq_signature: string, recommended: string[], project_id: string) {
    setIfNotExists(transitions, project_seq_signature, new Map());
    for (let recommended_project of recommended) {
        setIfNotExists(transitions.get(project_seq_signature), recommended_project, new Counter());
        transitions.get(project_seq_signature).get(recommended_project).increment(project_id);
    }
}

function getSecondLevelCount(map: Map<string, number>, firstKey: string, secondKey: string) {
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

function getNextStateSignature(project_seq_signature: string, next_proj: string) {
  let next_state = getStateFromSignature(project_seq_signature).slice(1);
  next_state.push(next_proj);
  return getSignature(next_state);
}

function resolveLastProjectInSignature(signature) {
    return getStateFromSignature(signature).pop();
}

/** The data is partitioned by user_id and sorted by timestamp
    We just need to iterate over the data to get the state transitions
    k indicates the length of the sequence in a state
    That is, how many projects into the past do we consider when making recommendations

    hitTransitions keeps track of the state transitions where user adopts a recommendation
    totalTransitions keeps track of the total transitiions regardless of
    whether user adopts a recommendation
 */
 interface DataInterface {
   user_id: string;
   recommended: string[];
   project_id: string;
   timestamp: number;
 }

 function getTransitions(data: DataInterface[], k: number) {
   const hitTransitions = new Map();
   const totalTransitions = new Map();
   const MDPTree = new Map();
   let project_seq = [data[0].project_id];

   for (let i=1; i<data.length; i++) {
     if (data[i].user_id !== data[i-1].user_id) project_seq = [];
     if (project_seq.length === k && project_seq[k-1] !== data[i].project_id) {
       let project_seq_signature = getSignature(project_seq);
       // build MDP tree
       recordTransitionWithActions(MDPTree, project_seq_signature, data[i-1].recommended, data[i].project_id);

       // record total and hit transitions (miss transitions calculated later)
       if (data[i-1].recommended.includes(data[i].project_id)) {
         recordTransition(hitTransitions, project_seq_signature, data[i].project_id);
       }
       recordTransition(totalTransitions, project_seq_signature, data[i].project_id);
     }
     project_seq.push(data[i].project_id);
     if (project_seq.length > k) project_seq.shift();
   }

   return { hitTransitions, totalTransitions, MDPTree };
 }

function exp_decay(frac: number, param: number = 1) {
  return math.exp(-param * frac);
}

function initializePolicy(MDPTree: Map<string, any>, rewards: Counter) {
  const policy = new Map();
  MDPTree.forEach((actions: Map<string, Counter>, project_seq_signature: string) => {
    policy.set(project_seq_signature, new Counter());
    actions.forEach((nextState: Counter, recommended_project: string) => {
      policy.get(project_seq_signature).set(recommended_project, rewards.get(recommended_project));
    });
    policy.set(project_seq_signature, policy.get(project_seq_signature).argMax());
  });
  return policy;
}

function getExpectedValue(transitionProb: Counter, values: Counter, state: string, gamma: number = .9) {
    let discountedValues = transitionProb.changeValue(() => 1)
      .changeKey((project_id: string) => getNextStateSignature(state, project_id))
      .multiply(values)
      .changeKey(resolveLastProjectInSignature)
      .multiply(gamma);
    return transitionProb.multiply(discountedValues.add(rewards)).sum();
}

function valueIteration(MDPTree: Map<string, any>, values: Counter, policy: Map<string, string>, rewards: Counter, gamma: number = .9) {
  MDPTree.forEach((actions: Map<string, Counter>, state: string) => {
    let transitionProb = actions.get(policy.get(state));
    values.set(state, getExpectedValue(transitionProb, values, state, gamma));
  });
}

function updatePolicy(MDPTree: Map<string, any>, values: Counter, policy: Map<string, string>) {
    policy.forEach((action: string, state: string, map: Map<string, string>) => {
        let bestAction: string;
        let maxValue: number;
        MDPTree.get(state).forEach((transitionProb: Counter, action: string) => {
            let expectedValue = getExpectedValue(transitionProb, values, state);
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
    a.forEach((value: number, key: any) => {
        if (!b.has(key) || b.get(key) !== a.get(key)) return false;
    });
    return true;
}

function policyIteration(MDPTree: Map<string, any>, values: Counter, policy: Map<string, string>, rewards: Counter, gamma: number = .9) {
    do {
        let lastPolicy = new Map(policy);
        do {
            let lastValues = values.copy();
            valueIteration(MDPTree, values, policy, rewards);
        }
        while (!hasConverged(lastValues, values));
        updatePolicy(MDPTree, values, policy);
    }
    while (!isEqual(lastPolicy, policy));
}

function trainProjectRecommendationModel(projects: any, data: DataInterface[]) {

  try {

    // normalize MDP tree
    const { hitTransitions, totalTransitions, MDPTree } = getTransitions(traffic, 3);

     MDPTree.forEach((actionSpace: Map<string, Counter>) => {
        actionSpace.forEach((counter: Counter) => counter.normalize());
    })

    // initialize values and policy
    values = new Counter(1);

    rewards = new Counter();
    for (let {project_id, pledged, estimated} of projects) {
      if (estimated === 0) continue;
      rewards.set(project_id, exp_decay(pledged/estimated));
    }

    const policy = initializePolicy(MDPTree, rewards);

    policyIteration(MDPTree, values, policy, rewards);

    return { model: policy };

  } catch (error) {
    console.log(error);
  }
}

export default trainProjectRecommendationModel;
