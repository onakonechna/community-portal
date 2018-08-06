interface DataInterface {
  users: any;
  projects: any;
  skill_name: string;
}

function setIfNotExists(map: Map<string, any>, key: any, value: any) {
  if (!map.has(key)) map.set(key, value);
}

function increment(map: Map<string, number>, key: any) {
  setIfNotExists(map, key, 0);
  map.set(key, map.get(key) + 1);
}

function divide(map: Map<string, number>, key: any, divider: number) {
  if (!divider) return 0; // divide by zero
  map.set(key, map.get(key) / divider);
}

function divideByConstant(divider: number) {
  return (count: number, key: string, map: Map<string, number>) => {
    divide(map, key, divider);
  };
}

function divideByDict(dividerDict: Map<string, number>) {
  return (count: number, key: string, map: Map<string, number>) => {
    divide(map, key, dividerDict.get(key));
  };
}

function topValues(map: Map<string, number>, k: number) {
  return [...map.entries()].sort(([k1, v1], [k2, v2]) => v2 - v1).slice(0, k);
}

function rankBySkill(data: DataInterface[]) {
  const rankedUsersByProject = new Map();
  const rankedProjectsByUser = new Map();
  const numSkillsByProject = new Map();

  try {

    for (const entry of data) {
      for (const project of entry.projects.values) {
        setIfNotExists(rankedUsersByProject, project, new Map());
        increment(numSkillsByProject, project);

        for (const user of entry.users.values) {
          setIfNotExists(rankedProjectsByUser, user, new Map());

          increment(rankedUsersByProject.get(project), user);
          increment(rankedProjectsByUser.get(user), project);
        }
      }
    }

    // sort and limit to top 10
    for (const [project, counts] of rankedUsersByProject) {
      counts.forEach(divideByConstant(numSkillsByProject.get(project)));
      rankedUsersByProject.set(project, topValues(counts, 10));
    }
    for (const [user, counts] of rankedProjectsByUser) {
      counts.forEach(divideByDict(numSkillsByProject));
      rankedProjectsByUser.set(user, topValues(counts, 10));
    }

  } catch (error) {
    console.log(error);
  }

  return { rankedUsersByProject, rankedProjectsByUser };
}

export default rankBySkill;
