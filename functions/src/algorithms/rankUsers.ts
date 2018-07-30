interface DataInterface {
  users: any;
  projects: any;
  skill_name: string;
}

function rankUsers(data: DataInterface[]) {
  let results = new Map();

  try {

    for (let entry of data) {
      for (let project of entry.projects.values) {
        if (!results.has(project)) results.set(project, new Map());

        for (let user of entry.users.values) {
          if (!results.get(project).has(user)) results.get(project).set(user, 0);
          results.get(project).set(user, results.get(project).get(user)+1);
        }
      }
    }

    for (let [project, counts] of results) {
      results.set(project, [...counts.entries()].sort(([k1, v1], [k2, v2]) => v2-v1));
    }

  } catch (error) {
    console.log(error);
  }

  return results;
}

export default rankUsers;
