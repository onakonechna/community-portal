interface DataInterface {
  users: any;
  projects: any;
  skill_name: string;
}

function rankUsers(data: DataInterface[]) {
  let results = new Map();
  for (let entry of data) {
    for (let project of entry.projects.values) {
      if (!results.has(project)) results.set(project, new Map());

      for (let user of entry.users.values) {
        if (!results.get(project).has(user)) results.get(project).set(user, 0);
        results.get(project).set(user, results.get(project).get(user)+1);
      }
    }
  }

  for (let [skill, counts] of results) {
    results.set(skill, new Map([...counts.entries].sort(
      (first: any, second: any) => {
        return second[1] - first[1];
      }
    )));
  }

  return results;
}

export default rankUsers;
