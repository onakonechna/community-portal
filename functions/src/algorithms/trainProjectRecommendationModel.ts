interface DataInterface {
  user_id: string;
  recommended: string[];
  project_id: string;
  timestamp: number;
}

function setIfNotExists(map: Map<string, any>, key: any, value: any) {
  if (!map.has(key)) map.set(key, value);
}

function increment(map: Map<string, number>, key: any) {
  setIfNotExists(map, key, 0);
  map.set(key, map.get(key) + 1);
}

function recordTransition(transitions: Map<string, any>, project_seq: string[], project_id: string) {
    const project_seq_signature = JSON.stringify(project_seq);
    setIfNotExists(transitions, project_seq_signature, new Map());
    increment(transitions.get(project_seq_signature), project_id);
}

/** The data is partitioned by user_id and sorted by timestamp
    We just need to iterate over the data to get the state transitions
    k indicates the length of the sequence in a state
    That is, how many projects into the past do we consider when making recommendations

    hitTransitions keeps track of the state transitions where user adopts a recommendation
    totalTransitions keeps track of the total transitiions regardless of
    whether user adopts a recommendation
 */
function getTransitions(data: DataInterface[], k: number) {
  const hitTransitions = new Map();
  const totalTransitions = new Map();
  let project_seq = [data[0].project_id];

  for (let i=1; i<data.length; i++) {
    if (data[i].user_id !== data[i-1].user_id) project_seq = [];
    if (project_seq.length === k) {
      if (data[i-1].recommended.includes(data[i].project_id)) {
        recordTransition(hitTransitions, project_seq, data[i].project_id);
      }
      recordTransition(totalTransitions, project_seq, data[i].project_id);
    }
    project_seq.push(data[i].project_id);
    if (project_seq.length > k) project_seq.shift();
  }

  return { hitTransitions, totalTransitions };
}

function trainProjectRecommendationModel(data: DataInterface[]) {

  const model = { success: true };

  try {

    console.log('logging all data..');
    console.log(data);
    console.log(getTransitions(data));

  } catch (error) {
    console.log(error);
  }

  return { model };
}

export default trainProjectRecommendationModel;
