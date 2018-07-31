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
  map.set(key, map.get(key)+1);
}

function rankBySkill(data: DataInterface[]) {
  let rankedUsersByProject = new Map();
  let rankedProjectsByUser = new Map();

  try {

    for (let entry of data) {
      for (let project of entry.projects.values) {
        setIfNotExists(rankedUsersByProject, project, new Map());
        for (let user of entry.users.values) {
          setIfNotExists(rankedProjectsByUser, user, new Map());

          increment(rankedUsersByProject.get(project), user);
          increment(rankedProjectsByUser.get(user), project);
        }
      }
    }

    // sort and limit to top 10 users
    for (let [project, counts] of rankedUsersByProject) {
      rankedUsersByProject.set(project, [...counts.entries()].sort(([k1, v1], [k2, v2]) => v2-v1).slice(0,10));
    }

  } catch (error) {
    console.log(error);
  }

  return { rankedUsersByProject, rankedProjectsByUser };
}

export default rankUsers;
